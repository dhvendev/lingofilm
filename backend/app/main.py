from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.users import router as users_router
from app.routers.movies import router as movies_router
from app.routers.filters import router as filters_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://192.168.0.166:3000"],  # Указываем точный адрес фронтенда
    allow_credentials=True,  # Разрешаем куки
    allow_methods=["*"],  # Разрешаем все методы (POST, GET и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

app.include_router(users_router, prefix='/api/users')
app.include_router(movies_router, prefix='/api/movies')
app.include_router(filters_router, prefix='/api/filters')



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )