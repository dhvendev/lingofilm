from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.movies import *
from typing import Optional

async def get_genres(session: AsyncSession) -> Optional[dict]:
    """
    Get all genres from database

    Args:
        session (AsyncSession): Database session

    Returns:
        Optional[dict]: List of genres
    """
    stmt = select(Genre)
    res = await session.execute(stmt)
    genres = res.unique().scalars().all()
    if not genres:
        return None
    return [genre.name for genre in genres]

async def get_countries(session: AsyncSession) -> Optional[dict]:
    """
    Get all countries from database
    
    Args:
        session (AsyncSession): Database session

    Returns:
        Optional[dict]: List of countries
    """
    stmt = select(Country)
    res = await session.execute(stmt)
    countries = res.unique().scalars().all()
    if not countries:
        return None
    return [country.name for country in countries]