from fastapi import APIRouter,HTTPException, Cookie
from app.core.logger import logger
from app.core.session import SessionManager as redis_manager
from app.schemas.other import LikePayload
from app.core.likes import LikeManager

router = APIRouter()


@router.post('/toggleLike')
async def toggle_like_route(
    payload: LikePayload,
    session_id: str = Cookie(default=None)
):
    """
    Переключает состояние лайка пользователя для контента
    
    Args:
        payload: Данные о лайке (content_id, content_type)
        session_id: ID сессии пользователя
    
    Returns:
        dict: Информация о новом состоянии лайка
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await redis_manager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    
    try:
        # Используем LikeManager для работы с лайками
        result = await LikeManager.toggle_like(
            int(user_id),
            payload.content_id,
            payload.content_type
        )
        
        return result
    except Exception as e:
        logger.error(f"Error toggling like: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")