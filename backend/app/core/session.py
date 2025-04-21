from typing import Optional, Union
from app.core.redis_connections import redis_client
from redis.asyncio.client import RedisError
from app.core.logger import logger
from datetime import datetime

class SessionManager:
    """
    Manager for controlling user sessions in Redis.
    """
    
    @staticmethod
    async def get_user_id_from_session(session_id: str) -> Optional[str]:
        """
        Retrieve the user ID from a session ID in Redis or return None if not found.

        Args:
            session_id (str): The session ID to retrieve the user ID from.

        Returns:
            Optional[str]: The user ID associated with the session ID, or None if not found.
        """
        try:
            if not session_id:
                return None
            return await redis_client.hget(f"session:{session_id}", "user_id")
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return None
    
    @staticmethod
    async def validate_session(session_id: str) -> bool:
        """
        Check if a session ID exists in Redis.

        Args:
            session_id (int): The session ID to check.

        Returns:
            bool: True if the session ID exists, False otherwise.
        """
        try:
            if not session_id:
                return False
            sessions = await redis_client.exists(f"session:{session_id}")
            return bool(sessions)
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return False
    
    @staticmethod
    async def delete_session(session_id: str) -> bool:
        """
        Delete a session ID from Redis.

        Args:
            session_id (int): The session ID to delete.

        Returns:
            bool: True if the session ID was deleted, False otherwise.
        """
        try:
            if not session_id:
                return False
            
            user_id = await redis_client.hget(f"session:{session_id}", "user_id")
            if user_id:
                await redis_client.srem(f"user_sessions:{user_id}", session_id)
            
            await redis_client.delete(f"session:{session_id}")
            return True
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return False
    
    @staticmethod
    async def create_session(user_id: str, session_id: str, user_agent: str, expire_time: int = 3600) -> bool:
        """
        Create a new session in Redis.

        Args:
            user_id (int): The user ID associated with the session.
            session_id (int): The session ID to create.
            user_agent (str): The user agent associated with the session.

        Returns:
            bool: True if the session was created, False otherwise.
        """
        try:
            if not user_id or not session_id:
                return False
            

            await redis_client.sadd(f"user_sessions:{user_id}", session_id)
            await redis_client.hset(f"session:{session_id}", mapping={
                "user_id": user_id,
                "user_agent": user_agent,
                "created_at": int(datetime.now().timestamp())
            })
            

            await redis_client.expire(f"session:{session_id}", expire_time)
            await redis_client.expire(f"user_sessions:{user_id}", expire_time)
            return True
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return False
    
    @staticmethod
    async def refresh_session(session_id: str, expire_time: int = 3600) -> bool:
        """
        Refresh the expiration time of a session in Redis.

        Args:
            session_id (int): The session ID to refresh.
            expire_time (int): The new expiration time in seconds.

        Returns:
            bool: True if the session was refreshed, False otherwise.
        """
        try:
            if not session_id:
                return False
            user_id = await redis_client.hget(f"session:{session_id}", "user_id")
            if not user_id:
                return False
            
            await redis_client.expire(f"session:{session_id}", expire_time)
            await redis_client.expire(f"user_sessions:{user_id}", expire_time)
            return True
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return False
    
    @staticmethod
    async def get_all_user_sessions(user_id: str) -> list[str]:
        """
        Get all session IDs associated with a user ID from Redis.

        Args:
            user_id (int): The user ID to retrieve the sessions for.

        Returns:
            list[str]: A list of session IDs associated with the user ID.
        """
        try:
            if not user_id:
                return []
            return list(await redis_client.smembers(f"user_sessions:{user_id}"))
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return []
    
    @staticmethod
    async def delete_all_user_sessions_except_current(user_id: str, except_session_id: str) -> int:
        """
        Delete all sessions associated with a user ID except the current session.

        Args:
            user_id (int): The user ID to delete the sessions for.
            except_session_id (int): The session ID to keep.

        Returns:
            int: The number of sessions deleted.
        """
        try:
            if not user_id:
                return 0
            
            sessions = redis_client.smembers(f"user_sessions:{user_id}")
            count = 0
            
            for session_id in sessions:
                if session_id != except_session_id:
                    redis_client.delete(f"session:{session_id}")
                    count += 1
            
            redis_client.delete(f"user_sessions:{user_id}")
            if except_session_id:
                redis_client.sadd(f"user_sessions:{user_id}", except_session_id)
            
            return count
        except RedisError as e:
            logger.error(f"Redis error: {e}")
            return 0
