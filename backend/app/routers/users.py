from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import redis
import uuid
from app.core.db import get_db
from app.crud.users import get_user, get_user_with_pass, check_subscription

router = APIRouter()
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)


class LoginUser(BaseModel):
    email: str
    password: str


@router.post('/authenticate')
async def authenticate(user: LoginUser, response: Response, request: Request, session: AsyncSession = Depends(get_db)):
    user = await get_user_with_pass(user.email, user.password, session)
    if not user:
        raise HTTPException(status_code=409, detail="User not found")
    print(user)
    session_id = str(uuid.uuid4())
    redis_client.sadd(f"user_sessions:{user.get('id')}", session_id)
    redis_client.hset(f"session:{session_id}", mapping={
        "user_id": user.get('id'),
        "user_agent": request.headers.get("User-Agent", "Unknown")
    })
    redis_client.expire(f"session:{session_id}", 3600)
    redis_client.expire(f"user_sessions:{user.get('email')}", 3600)
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600, secure=True, samesite="None")
    return user


@router.post('/logout')
async def logout(response: Response, session_id: str = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    email = redis_client.hget(f"session:{session_id}", "email")
    redis_client.srem(f"user_sessions:{email}", session_id)
    redis_client.delete(f"session:{session_id}")
    response.delete_cookie(key="session_id")
    return {"message": "Logout successful"}


@router.post('/getUser')
async def get_user_post(response: Response, session_id: str = Cookie(default=None), session: AsyncSession = Depends(get_db)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = redis_client.hget(f"session:{session_id}", "user_id")
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    user_data = await get_user(int(user_id), session)
    if not user_data:
        raise HTTPException(status_code=500, detail="Please contact tg:@plymv about this incident")
    return user_data


@router.post('/checkSubscription')
async def get_user_post(response: Response, session_id: str = Cookie(default=None), session: AsyncSession = Depends(get_db)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = redis_client.hget(f"session:{session_id}", "user_id")
    if not user_id:
        response.delete_cookie(key="session_id")
        raise HTTPException(status_code=401, detail="Unauthorized", headers=response.headers)
    
    user_data = await check_subscription(int(user_id), session)
    if not user_data:
        raise HTTPException(status_code=500, detail="Please contact tg:@plymv about this incident")
    return user_data


@router.post('/editPassword')
def edit_password():
    pass


@router.post('/editPicture')
def edit_picture():
    pass