from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import User, Subscription,  UserSubscription
from typing import Optional

def generate_user_data(user: User, user_subscription: UserSubscription=None, subscription: Subscription=None):
    data = {
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'gender': user.gender,
        'date_of_birth': user.date_of_birth,
        'created_at': user.created_at,
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


async def get_user_with_pass(email: str, password: str, session: AsyncSession) -> Optional[dict]:
    stmt = select(User, UserSubscription, Subscription).outerjoin(UserSubscription, User.id == UserSubscription.user_id).outerjoin(Subscription, UserSubscription.subscription_id == Subscription.id).where(User.email == email, User.hashed_password == password)
    res = await session.execute(stmt)
    data = res.first()
    if not data:
        return None
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