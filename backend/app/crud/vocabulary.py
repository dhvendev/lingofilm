from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.users import UserVocabulary
from app.models.movies import Movie
from typing import List, Optional
from datetime import datetime

async def add_word_to_vocabulary(
    session: AsyncSession,
    user_id: int,
    english_word: str,
    russian_translation: str
) -> Optional[UserVocabulary]:
    """Добавить слово в словарь пользователя"""
    try:
        # Проверяем, нет ли уже этого слова у пользователя
        existing_word = await get_vocabulary_word(session, user_id, english_word, russian_translation)
        if existing_word:
            return existing_word
        
        new_word = UserVocabulary(
            user_id=user_id,
            english_word=english_word.lower(),
            russian_translation=russian_translation
        )
        session.add(new_word)
        await session.commit()
        await session.refresh(new_word)
        return new_word
    except Exception as e:
        await session.rollback()
        return None

async def get_vocabulary_word(
    session: AsyncSession,
    user_id: int,
    english_word: str,
    russian_translation: str
) -> Optional[UserVocabulary]:
    """Получить конкретное слово из словаря"""
    stmt = select(UserVocabulary).where(
        UserVocabulary.user_id == user_id,
        UserVocabulary.english_word == english_word.lower(),
        UserVocabulary.russian_translation == russian_translation
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def get_user_vocabulary(
    session: AsyncSession,
    user_id: int,
    is_learned: Optional[bool] = None
) -> List[UserVocabulary]:
    """Получить весь словарь пользователя"""
    stmt = select(UserVocabulary).where(UserVocabulary.user_id == user_id)
    if is_learned is not None:
        stmt = stmt.where(UserVocabulary.is_learned == is_learned)
    stmt = stmt.order_by(UserVocabulary.created_at.desc())
    result = await session.execute(stmt)
    return result.scalars().all()

async def update_word_learned_status(
    session: AsyncSession,
    user_id: int,
    word_id: int,
    is_learned: bool
) -> Optional[UserVocabulary]:
    """Обновить статус изучения слова"""
    stmt = select(UserVocabulary).where(
        UserVocabulary.id == word_id,
        UserVocabulary.user_id == user_id
    )
    result = await session.execute(stmt)
    word = result.scalar_one_or_none()
    
    if word:
        word.is_learned = is_learned
        if is_learned:
            word.learned_at = datetime.now()
        else:
            word.learned_at = None
        await session.commit()
        await session.refresh(word)
    
    return word

async def delete_word_from_vocabulary(
    session: AsyncSession,
    user_id: int,
    word_id: int
) -> bool:
    """Удалить слово из словаря"""
    stmt = select(UserVocabulary).where(
        UserVocabulary.id == word_id,
        UserVocabulary.user_id == user_id
    )
    result = await session.execute(stmt)
    word = result.scalar_one_or_none()
    
    if word:
        await session.delete(word)
        await session.commit()
        return True
    return False