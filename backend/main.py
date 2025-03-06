from fastapi import FastAPI, Response, Request, HTTPException, Depends  
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
    allow_origins=["http://127.0.0.1:3001"],  # Указываем точный адрес фронтенда
    allow_credentials=True,  # Разрешаем куки
    allow_methods=["*"],  # Разрешаем все методы (POST, GET и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)


# oauth = OAuth2PasswordBearer(tokenUrl="token")
# test_access_token = 'test_access_token'
# test_refresh_token = 'test_refresh_token'
# def verify_token(token):
#     if token == test_access_token or token == test_refresh_token:
#         return True
#     return False

# def create_token():
#     return test_access_token


# @app.post('/api/users/getUser')
# def get_user(request: Request, token: str = Depends(oauth)):
#     status = verify_token(token)
#     print('Status token', status)
#     test_email = 'test@test.com'
#     user = db.get_user(test_email)
#     if user:
#         return {'email': user[1], 'username': user[2]}
#     return HTTPException(status_code=404, detail="User not found")






class LoginUser(BaseModel):
    email: str
    password: str



@app.post('/api/users/aunthenticate')
def aunthenticate(user: LoginUser, response: Response):
    # print(user.email, user.password)
    # token = create_token()
    # response.set_cookie(key='access_token', value=token, httponly=True, samesite='lax', secure=True)
    # return {'access_token': token }
    print(user.email, user.password)
    session_id = str(uuid.uuid4())
    redis_client.setex(f"session:{session_id}", 3600, user.email)

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600)
    return response




@app.post('/api/users/createUser')
def create_user():
    pass


@app.post('/api/users/editPassword')
def edit_password():
    pass


@app.post('/api/users/editPicture')
def edit_picture():
    pass





if __name__ == '__main__':
    import uvicorn
    db = DatabaseManager()
    uvicorn.run(app, host="127.0.0.1", port=8000)



