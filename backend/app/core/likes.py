import json
from typing import Optional, Union
from app.core.redis_connections import redis_client
from redis.asyncio.client import RedisError
from app.core.logger import logger
from datetime import datetime

class LikeManager:
    """
    Manager for control user likes
    """

    @staticmethod
    async def toggle_like(user_id: int, content_id: int, content_type: str) -> dict:
        """
        Переключает состояние лайка пользователя (добавляет если нет, удаляет если есть)
        
        Args:
            user_id: ID пользователя
            content_id: ID контента (фильма или сериала)
            content_type: Тип контента ("movie" или "series")
            
        Returns:
            dict: Информация о новом состоянии лайка
        """

        user_like_key = f"user_like:{user_id}:{content_type}:{content_id}"
        content_likes_key = f"content_likes:{content_type}:{content_id}"
        pending_updates_key = "pending_likes_updates"
        
        exists = await redis_client.exists(user_like_key)
        
        if exists:
            await redis_client.delete(user_like_key)
            await redis_client.hincrby(content_likes_key, "count", -1)
            
            update_data = {
                "user_id": user_id,
                "content_id": content_id,
                "content_type": content_type,
                "action": "remove",
                "timestamp": int(datetime.now().timestamp())
            }
            await redis_client.zadd(
                pending_updates_key, 
                {json.dumps(update_data): int(datetime.now().timestamp())}
            )
            
            liked = False
        else:
            await redis_client.set(user_like_key, 1)
            
            if not await redis_client.exists(content_likes_key):
                await redis_client.hset(content_likes_key, "count", 0)
                
            await redis_client.hincrby(content_likes_key, "count", 1)
            
            update_data = {
                "user_id": user_id,
                "content_id": content_id,
                "content_type": content_type,
                "action": "add",
                "timestamp": int(datetime.now().timestamp())
            }
            await redis_client.zadd(
                pending_updates_key, 
                {json.dumps(update_data): int(datetime.now().timestamp())}
            )
            
            liked = True
        
        likes_count = await redis_client.hget(content_likes_key, "count")
        likes_count = int(likes_count) if likes_count else 0
        
        return {
            "liked": liked,
            "likes_count": likes_count
        }
    
    @staticmethod
    async def check_if_liked(user_id: int, content_id: int, content_type: str) -> bool:
        """
        Проверяет, поставил ли пользователь лайк контенту
        
        Args:
            user_id: ID пользователя
            content_id: ID контента
            content_type: Тип контента ("movie" или "series")
            
        Returns:
            bool: True если пользователь поставил лайк, иначе False
        """
        user_like_key = f"user_like:{user_id}:{content_type}:{content_id}"
        return bool(await redis_client.exists(user_like_key))
    
    
    @staticmethod
    async def get_likes_count(content_id: int, content_type: str) -> int:
        """
        Получает количество лайков для контента
        
        Args:
            content_id: ID контента
            content_type: Тип контента ("movie" или "series")
            
        Returns:
            int: Количество лайков
        """
        content_likes_key = f"content_likes:{content_type}:{content_id}"
        likes_count = await redis_client.hget(content_likes_key, "count")
        return int(likes_count) if likes_count else 0
