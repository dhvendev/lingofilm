from fastapi import APIRouter, HTTPException, Depends, Cookie, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.session import SessionManager
from app.crud.vocabulary import (
    add_word_to_vocabulary,
    get_user_vocabulary,
    update_word_learned_status,
    delete_word_from_vocabulary,
    edit_vocabulary_word
)
from app.schemas.user import AddToVocabulary, VocabularyWord, UpdateWordStatus, AddToVocabularyManually, EditWord
from app.services.translate_api import translate_word
from typing import List, Optional

router = APIRouter()

@router.post('/addWord', response_model=VocabularyWord)
async def add_word(
    payload: AddToVocabulary,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Добавить слово в личный словарь"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Переводим слово
    translation = await translate_word(payload.word)
    if not translation:
        raise HTTPException(status_code=500, detail="Translation failed")
    
    # Добавляем в словарь
    word = await add_word_to_vocabulary(
        session,
        int(user_id),
        payload.word,
        translation
    )
    
    if not word:
        raise HTTPException(status_code=500, detail="Failed to add word")
    
    return word

@router.post('/addWordManually', response_model=VocabularyWord)
async def add_word(
    payload: AddToVocabularyManually,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Добавить слово в личный словарь со своим переводом"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")

    # Добавляем в словарь
    word = await add_word_to_vocabulary(
        session,
        int(user_id),
        payload.word,
        payload.translation
    )
    
    if not word:
        raise HTTPException(status_code=500, detail="Failed to add word")
    
    return word

@router.post('/editWord', response_model=VocabularyWord)
async def add_word(
    payload: EditWord,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Изменить перевод слова на свое"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")

    # Добавляем в словарь
    word = await edit_vocabulary_word(session, int(user_id), payload.word_id, payload.translation)
    
    if not word:
        raise HTTPException(status_code=500, detail="Failed to edit word")
    
    return word

@router.get('/getVocabulary', response_model=List[VocabularyWord])
async def get_vocabulary(
    is_learned: Optional[bool] = None,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Получить словарь пользователя"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    
    vocabulary = await get_user_vocabulary(session, int(user_id), is_learned)
    return vocabulary

@router.put('/updateWordStatus', response_model=VocabularyWord)
async def update_word_status(
    payload: UpdateWordStatus,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Обновить статус изучения слова"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    
    word = await update_word_learned_status(
        session,
        int(user_id),
        payload.word_id,
        payload.is_learned
    )
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    return word

@router.delete('/deleteWord/{word_id}')
async def delete_word(
    word_id: int,
    session: AsyncSession = Depends(get_db),
    session_id: str = Cookie(default=None)
):
    """Удалить слово из словаря"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = await SessionManager.get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    
    success = await delete_word_from_vocabulary(session, int(user_id), word_id)
    if not success:
        raise HTTPException(status_code=404, detail="Word not found")
    
    return {"detail": "Word deleted successfully"}