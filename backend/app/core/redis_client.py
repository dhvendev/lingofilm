import redis.asyncio as redis
from app.core.config import settings

#TODO Change static variables to settings variables

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True,
)
