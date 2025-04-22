from typing import Optional
from app.core.config import settings
from app.core.logger import logger
from app.core.redis_connections import redis_client
import aiohttp
from redis.asyncio.client import RedisError


async def translate_api_request(word: str) -> Optional[str]:
    """
    Translate a word using Yandex API

    Args:
        word (str): word to translate

    Returns:
        Optional[str]: translated word
    """
    try:
        async with aiohttp.ClientSession() as session:
            url = f"https://translate.api.cloud.yandex.net/translate/v2/translate"
            headers = {
                "Authorization": f"Api-Key {settings.YANDEX_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "targetLanguageCode": "ru",
                "texts": [word],
                "folderId": settings.YANDEX_FOLDER_ID,
                "sourceLanguageCode": "en"
            }
            async with session.post(url, headers=headers, json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    result = result["translations"][0]["text"]
                    return result
                logger.error(f"API request failed with status code {response.status}")
                return None
    except Exception as e:
        logger.error(f"API request failed: {e}")
        return None
    

async def translate_word(word: str) -> Optional[str]:
    """
    This function check redis storage to translate a word, if it is not found use Yandex API
    The word is normalized to lowercase before checking/storing in the cache.

    Args:
        word (str): word to translate

    Returns:
        Optional[str]: translated word

    """
    normalized_word = word.lower()
    
    try:
        exists = await redis_client.exists(f"en:ru:{normalized_word}")

        if exists:
            await redis_client.expire(f"en:ru:{normalized_word}", settings.TTL_FOR_WORDS)
            cached_result = await redis_client.get(f"en:ru:{normalized_word}")
            return cached_result if cached_result else None
            
    except RedisError as e:
        logger.error(f"Redis error when checking cache: {e}")
    
    try:
        translation = await translate_api_request(normalized_word)
        if translation is None:
            return None
        try:
            await redis_client.set(f"en:ru:{normalized_word}", translation, settings.TTL_FOR_WORDS)
        except RedisError as e:
            logger.error(f"Redis error when storing translation: {e}")

        return translation
    except Exception as e:
        logger.error(f"Translation process failed: {e}")
        return None