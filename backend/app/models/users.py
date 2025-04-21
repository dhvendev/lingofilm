from sqlalchemy import Column, ForeignKey, Integer, String,  Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
from enum import Enum as PyEnum


print(Base, Base.metadata)
class Gender(str, PyEnum):
    MALE = "male"
    FEMALE = "female"

class SubscriptionType(str, PyEnum):
    PREMIUM = "premium"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    username = Column(String(100), unique=False, nullable=False)
    gender = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False, default=func.now())

    subscriptions = relationship("Subscription", secondary="user_subscriptions", back_populates="users")

    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, username={self.username}, gender={self.gender}, date_of_birth={self.date_of_birth}, created_at={self.created_at})"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    subscription_type = Column(String, nullable=False)
    created_at = Column(Date, nullable=False, default=func.now())

    users = relationship("User", secondary="user_subscriptions", back_populates="subscriptions")

    def __repr__(self):
        return f"Subscription(id={self.id}, subscription_type={self.subscription_type}, created_at={self.created_at})"

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), primary_key=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False,default=True)

    def __repr__(self):
        return f"UserSubscription(user_id={self.user_id}, subscription_id={self.subscription_id}, start_date={self.start_date}, end_date={self.end_date}, is_active={self.is_active})"

