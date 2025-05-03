from sqlalchemy import Column, DateTime, ForeignKey, Integer, String,  Date, Boolean, UniqueConstraint
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
    username = Column(String(100), unique=True, nullable=False)
    gender = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False, default=func.now())
    image = Column(String(500), nullable=True)

    subscriptions = relationship("Subscription", secondary="user_subscriptions", back_populates="users")
    likes = relationship("UserLike", back_populates="user")
    vocabulary = relationship("UserVocabulary", back_populates="user")

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


class UserLike(Base):
    """Таблица для хранения информации о лайках пользователей"""
    __tablename__ = "user_likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, nullable=False)  # ID фильма или сериала
    content_type = Column(String(10), nullable=False)  # "movie" или "series"
    created_at = Column(DateTime, nullable=False, default=func.now())
    
    __table_args__ = (
        UniqueConstraint('user_id', 'content_id', 'content_type', name='unique_user_content_like'),
    )

    user = relationship("User", back_populates="likes")


class UserVocabulary(Base):
    """Личный словарь пользователя"""
    __tablename__ = "user_vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    english_word = Column(String(200), nullable=False)
    russian_translation = Column(String(200), nullable=False)
    is_learned = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    learned_at = Column(DateTime(timezone=True), nullable=True)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'english_word', 'russian_translation', name='unique_user_word'),
    )
    
    user = relationship("User", back_populates="vocabulary")
    
    def __repr__(self):
        return f"UserVocabulary(user_id={self.user_id}, word={self.english_word}, status={'learned' if self.is_learned else 'learning'})"