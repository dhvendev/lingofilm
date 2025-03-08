from fastapi import FastAPI, Response, Request, HTTPException, Depends, Cookie
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from db import DatabaseManager
from pydantic import BaseModel
import redis
import uuid


app = FastAPI()
db = DatabaseManager()
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
def authenticate(user: LoginUser, response: Response, request: Request):

    #add crypto decode email and password

    #get user (EDIT IN FUTURE)
    user_data = db.get_user(user.email)
    print(user_data)
    if not user_data:
        raise HTTPException(status_code=409, detail="User not found")
    #---------------------------

    session_id = str(uuid.uuid4())

    #add session
    redis_client.sadd(f"user_sessions:{user.email}", session_id)
    redis_client.hset(f"session:{session_id}", mapping={
        "email": user.email,
        "user_agent": request.headers.get("User-Agent", "Unknown")
    })

    # set expiration
    redis_client.expire(f"session:{session_id}", 3600)
    redis_client.expire(f"user_sessions:{user.email}", 3600)

    # set cookie
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600, secure=True, samesite="None")

    return {"email": user_data.get('email'), "username": user_data.get('username')}


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
    user_data = db.get_user(email)
    return {"email": user_data.get('email'), "username": user_data.get('username')}


@app.post('/api/users/editPassword')
def edit_password():
    pass


@app.post('/api/users/editPicture')
def edit_picture():
    pass




