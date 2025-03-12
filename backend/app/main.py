from fastapi import FastAPI, Response, Request, HTTPException, Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import redis
import uuid
from app.core.db import get_db
from app.crud.users import get_user, get_user_with_pass


app = FastAPI()
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],  # Указываем точный адрес фронтенда
    allow_credentials=True,  # Разрешаем куки
    allow_methods=["*"],  # Разрешаем все методы (POST, GET и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)


class LoginUser(BaseModel):
    email: str
    password: str


@app.post('/api/users/authenticate')
async def authenticate(user: LoginUser, response: Response, request: Request, session: AsyncSession = Depends(get_db)):
    user = await get_user_with_pass(user.email, user.password, session)
    if not user:
        raise HTTPException(status_code=409, detail="User not found")
    #---------------------------
    print(user)
    session_id = str(uuid.uuid4())
    #add session
    redis_client.sadd(f"user_sessions:{user.get('id')}", session_id)
    redis_client.hset(f"session:{session_id}", mapping={
        "user_id": user.get('id'),
        "user_agent": request.headers.get("User-Agent", "Unknown")
    })

    # set expiration
    redis_client.expire(f"session:{session_id}", 3600)
    redis_client.expire(f"user_sessions:{user.get('email')}", 3600)

    # set cookie
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600, secure=True, samesite="None")

    return user


@app.post('/api/users/logout')
def logout(response: Response, session_id: str = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    email = redis_client.hget(f"session:{session_id}", "email")
    redis_client.srem(f"user_sessions:{email}", session_id)
    redis_client.delete(f"session:{session_id}")
    response.delete_cookie(key="session_id")
    return {"message": "Logout successful"}



@app.post('/api/users/getUser')
def get_user(response: Response, session_id: str = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    email = redis_client.hget(f"session:{session_id}", "email")
    user_data = get_user(email)
    return {"email": user_data.get('email'), "username": user_data.get('username')}


@app.post('/api/users/editPassword')
def edit_password():
    
    pass


@app.post('/api/users/editPicture')
def edit_picture():
    pass




