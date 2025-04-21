from fastapi import Cookie, HTTPException, status
from session import SessionManager

async def get_current_user_id(session_id: str = Cookie(default=None)) -> str:
    """
    Get the current user ID based on the provided session ID.

    Args:
        session_id (str): The session ID to validate.

    Returns:
        str: The user ID associated with the session ID.

    Raises:
        HTTPException: If the session ID is invalid or expired.
    """
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не авторизован"
        )

    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия истекла или недействительна"
        )

    await SessionManager.refresh_session(session_id)
    return user_id
