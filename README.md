This project in progress

## LingoFilm.ru

### Example .env file content

```
DATABASE_URL=postgresql+asyncpg://user:1234@postgres/db_name
DB_USER=user
DB_PASSWORD=1234
DB_HOST=postgres
DB_PORT=5432
DB_NAME=db_name

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=12345

# Настройки приложения
DEBUG=True

# API Настройки
API_HOST=backend
API_PORT=8000
API_DOMAIN=https://api.yorsite.ru

# Настройки фронтенда
NEXT_PUBLIC_API_URL=https://api.yorsite.ru
FRONTEND_PORT=3000
```