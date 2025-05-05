# backend/app/routers/content.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.crud.content import (
    get_featured_content,
    get_popular_content,
    get_recent_content,
    get_content_by_type
)
from typing import Optional, List, Dict, Any, Literal

router = APIRouter()

@router.post('/getFeaturedContent')
async def featured_content_endpoint(
    limit: int = 5,
    session: AsyncSession = Depends(get_db)
):
    """
    Получение избранного контента для главного слайдера
    
    Args:
        limit: Количество элементов (по умолчанию 5)
    """
    content = await get_featured_content(session, limit)
    if not content:
        return []
    return content

@router.post('/getTopContent')
async def top_content_endpoint(
    period: Literal["week", "month"] = "week",
    content_type: Literal["all", "movie", "series"] = "all",
    limit: int = 10,
    session: AsyncSession = Depends(get_db)
):
    """
    Получение самого популярного контента за период
    
    Args:
        period: "week" или "month" (по умолчанию "week")
        content_type: "all", "movie" или "series" (по умолчанию "all")
        limit: Количество элементов (по умолчанию 10)
    """
    content = await get_popular_content(session, period, content_type, limit)
    if not content:
        return []
    return content

@router.post('/getRecentContent')
async def recent_content_endpoint(
    content_type: Literal["all", "movie", "series"] = "all",
    limit: int = 10,
    session: AsyncSession = Depends(get_db)
):
    """
    Получение недавно добавленного контента
    
    Args:
        content_type: "all", "movie" или "series" (по умолчанию "all")
        limit: Количество элементов (по умолчанию 10)
    """
    content = await get_recent_content(session, content_type, limit)
    if not content:
        return []
    return content

@router.post('/getMovies')
async def get_movies_endpoint(
    limit: int = 10,
    session: AsyncSession = Depends(get_db)
):
    """
    Получение популярных фильмов
    
    Args:
        limit: Количество элементов (по умолчанию 10)
    """
    movies = await get_content_by_type(session, "movie", limit)
    if not movies:
        return []
    return movies

@router.post('/getSeries')
async def get_series_endpoint(limit: int = 10, session: AsyncSession = Depends(get_db)):
    """
    Получение популярных сериалов
    
    Args:
        limit: Количество элементов (по умолчанию 10)
    """
    series = await get_content_by_type(session, "series", limit)
    if not series:
        return []
    return series