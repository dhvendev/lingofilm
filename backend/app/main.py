from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.users import router as users_router
from app.routers.movies import router as movies_router
from app.routers.filters import router as filters_router
from app.routers.interactions import router as interactions_router
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.tasks.sync_tasks import sync_likes_to_database

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://192.168.0.166:3000", "https://lingofilm.ru", "http://lingofilm.ru"],  # Указываем точный адрес фронтенда
    allow_credentials=True,  # Разрешаем куки
    allow_methods=["*"],  # Разрешаем все методы (POST, GET и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

app.include_router(users_router, prefix='/api/users')
app.include_router(movies_router, prefix='/api/movies')
app.include_router(filters_router, prefix='/api/filters')
app.include_router(interactions_router, prefix='/api/interactions')



# Создаем scheduler
scheduler = AsyncIOScheduler()

# Запускаем scheduler при запуске приложения
@app.on_event("startup")
async def startup_event():
    # Добавляем задачу синхронизации лайков, которая запускается каждые 5 минут
    scheduler.add_job(
        sync_likes_to_database,
        CronTrigger(minute="*/1"),  # Каждые 5 минут
        id="sync_likes",
        max_instances=1,
        replace_existing=True,
    )
    
    # Запускаем scheduler
    scheduler.start()

# Останавливаем scheduler при остановке приложения
@app.on_event("shutdown")
async def shutdown_event():
    # Останавливаем scheduler
    scheduler.shutdown()



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )