from sqlalchemy import select
import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import User, Subscription,  UserSubscription
from typing import Optional
from app.core.security import verify_password
from app.core.logger import logger
from app.schemas.user import CreateUserModel
from app.core.security import get_password_hash

def generate_user_data(user: User, user_subscription: UserSubscription=None, subscription: Subscription=None):
    data = {
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'gender': user.gender,
        'date_of_birth': user.date_of_birth,
        'created_at': user.created_at,
        'image': user.image,
        'subscription': {
                'sub_type' : subscription.subscription_type,
                'expire' : user_subscription.end_date,
                'is_active' : user_subscription.is_active
            } if user_subscription and subscription else {}
    }
    return data

async def get_user(user_id: int, session: AsyncSession) -> Optional[dict]:
    stmt = select(User, UserSubscription, Subscription).outerjoin(UserSubscription, User.id == UserSubscription.user_id).outerjoin(Subscription, UserSubscription.subscription_id == Subscription.id).where(User.id == user_id)
    res = await session.execute(stmt)
    data = res.first()
    if not data:
        return None
    data = generate_user_data(*data)
    return data

async def get_user_by_email(email: str, session: AsyncSession) -> Optional[User]:
    """Получение полной модели пользователя по email"""
    stmt = select(User).where(User.email == email)
    res = await session.execute(stmt)
    user = res.scalars().first()
    return user

async def get_user_with_pass(email: str, password: str, session: AsyncSession) -> Optional[dict]:
    user = await get_user_by_email(email, session)
    
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    stmt = select(User, UserSubscription, Subscription).outerjoin(
        UserSubscription, User.id == UserSubscription.user_id
    ).outerjoin(
        Subscription, UserSubscription.subscription_id == Subscription.id
    ).where(User.id == user.id)
    
    res = await session.execute(stmt)
    data = res.first()
    
    if not data:
        return generate_user_data(user)
    
    data = generate_user_data(*data)
    return data


async def check_subscription(user_id: int, session: AsyncSession) -> Optional[dict]:
    stmt = select(UserSubscription, Subscription).outerjoin(Subscription, UserSubscription.subscription_id == Subscription.id).where(UserSubscription.user_id == user_id)
    res = await session.execute(stmt)
    data = res.first()
    if not data:
        return None
    user_subscription, subscription = data
    data = {
        'subscription': {
            'sub_type' : subscription.subscription_type,
            'expire' : user_subscription.end_date,
            'is_active' : user_subscription.is_active
        } if data else {}
    }
    return data


async def create_user(user: CreateUserModel, session: AsyncSession) -> User:
    try:
        db_user = User(email=user.email, hashed_password=get_password_hash(user.password), username=user.username, gender=user.gender, date_of_birth=user.date_of_birth)
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user
    except sqlalchemy.exc.IntegrityError as e:
        logger.error(f"Error creating user: {e}")
        return None

async def update_image(user_id: int, image: str, session: AsyncSession) -> User:
    """
    Update the image of a user in the database.

    Args:
        user_id (int): The ID of the user to update.
        image (str): The new image URL.

    Returns:
        User: The updated user object.
    """
    stmt = select(User).where(User.id == int(user_id))
    res = await session.execute(stmt)
    user = res.scalars().first()
    user.image = image
    await session.commit()
    await session.refresh(user)
    return user