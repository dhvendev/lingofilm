from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.core.db import get_db
from app.crud.users import generate_user_data, get_user, get_user_with_pass, check_subscription, get_user_by_email, create_user, update_image
from app.core.logger import logger
from app.core.session import SessionManager as redis_manager
from datetime import datetime
from typing import Optional
from app.schemas.user import CreateUserModel, LoginUser, NewPicture
from app.schemas.other import TranslateWord
from app.core.config import settings
from app.services.translate_api import translate_word

router = APIRouter()

@router.post('/authenticate')
async def authenticate(user: LoginUser, response: Response, request: Request, session: AsyncSession = Depends(get_db)):
    """
    Authenticate a user and return the user data and set a session cookie

    Args:
        user (LoginUser): The user credentials
        response (Response): The response object
        request (Request): The request object
        session (AsyncSession, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: The user data

    Raises:
        HTTPException: If the user is not found
    """
    user = await get_user_with_pass(user.email, user.password, session)
    if not user:
        raise HTTPException(status_code=409, detail="User not found")
    session_id = str(uuid.uuid4())
    is_created = await redis_manager.create_session(user.get('id'), session_id, request.headers.get("User-Agent", "Unknown"))
    if not is_created:
        raise HTTPException(status_code=500)
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600, secure=True, samesite="none" if not settings.DEBUG else "lax")
    return user

@router.post('/register')
async def register(user: CreateUserModel, response: Response, request: Request, session: AsyncSession = Depends(get_db)):
    """
    Register a new user

    Args:
        user (CreateUserModel): The user data
        response (Response): The response object
        request (Request): The request object
        session (AsyncSession, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: The user data

    Raises:
        HTTPException: If the user already exists
    """

    #TODO: Сначала проверить captchaToken на валидность

    db_user = await get_user_by_email(user.email, session)
    if db_user:
        raise HTTPException(status_code=409, detail="User already exists")
    user = await create_user(user, session)
    if not user:
        raise HTTPException(status_code=400, detail="Username already exists")
    session_id = str(uuid.uuid4())
    is_created = await redis_manager.create_session(user.id, session_id, request.headers.get("User-Agent", "Unknown"))
    if not is_created:
        raise HTTPException(status_code=500)
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600, secure=True, samesite="none" if not settings.DEBUG else "lax")
    del user.hashed_password
    return user



@router.post('/logout')
async def logout(response: Response, session_id: str = Cookie(default=None)):
    """
    Logout a user and delete the session

    Args:
        response (Response): The response object
        session_id (str, optional): The session ID. Defaults to None.

    Returns:
        dict: Message indicating successful logout

    Raises:
        HTTPException: If the user is not authenticated
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    await redis_manager.delete_session(session_id)
    response.delete_cookie(key="session_id")
    return {"detail": "Logout successful"}


@router.post('/getUser')
async def get_user_post(response: Response, session_id: str = Cookie(default=None), session: AsyncSession = Depends(get_db)):
    """
    Get user data

    Args:
        response (Response): The response object
        session_id (str, optional): The session ID. Defaults to None.

    Returns:
        dict: The user data

    Raises:
        HTTPException: If the user is not authenticated or if the user is not found
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await redis_manager.get_user_id_from_session(session_id)
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    user_data = await get_user(int(user_id), session)
    if not user_data:
        await redis_manager.delete_session(session_id)
        logger.error(f"User with id {user_id} not found")
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=500, detail="User not found", headers=response.headers)
    return user_data


@router.post('/checkSubscription')
async def get_user_post(response: Response, session_id: str = Cookie(default=None), session: AsyncSession = Depends(get_db)):
    """
    Get user data

    Args:
        response (Response): The response object
        session_id (str, optional): The session ID. Defaults to None.

    Returns:
        dict: The user data

    Raises:
        HTTPException: If the user is not authenticated or if the user is not found
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = await redis_manager.get_user_id_from_session(session_id)
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    user_data = await check_subscription(int(user_id), session)
    if not user_data:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=500, detail="User not found", headers=response.headers)
    return user_data


@router.post('/editPassword')
def edit_password():
    pass


@router.post('/editPicture')
async def edit_picture(payload: NewPicture,response: Response, session: AsyncSession = Depends(get_db), session_id: str = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = await redis_manager.get_user_id_from_session(session_id)
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    await update_image(user_id, payload.image, session)
    return {"detail": "Picture updated"}


@router.post('/translateWord')
async def translate(response: Response, payload: TranslateWord, session: AsyncSession = Depends(get_db), session_id: str = Cookie(default=None)):
    """
    Translate a word only if the user is authenticated

    Args:
        response (Response): The response object
        session_id (str, optional): The session ID. Defaults to None.
        payload (TranslateWord): The word to translate {"word": :example}

    Returns:
        dict: The translated word

    Raises:
        HTTPException: If the user is not authenticated
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = await redis_manager.get_user_id_from_session(session_id)
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    translated_word = await translate_word(payload.word)
    return translated_word