from passlib.context import CryptContext
from app.core.redis_connections import redis_rate_limiter

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify hashed password

    Args:
        plain_password (str): Plain password
        hashed_password (str): Hashed password

    Returns:
        bool: True if the password is correct, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Get password hash

    Args:
        password (str): Password

    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)