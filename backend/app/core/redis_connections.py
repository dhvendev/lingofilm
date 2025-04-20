import redis.asyncio as redis
from app.core.config import settings

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True,
    password=settings.REDIS_PASSWORD
)

redis_rate_limiter = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=1,
    decode_responses=True,
    password=settings.REDIS_PASSWORD
)
