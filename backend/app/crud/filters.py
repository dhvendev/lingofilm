from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.movies import *
from typing import Optional

async def get_genres(session: AsyncSession) -> Optional[dict]:
    stmt = select(Genre)
    res = await session.execute(stmt)
    genres = res.unique().scalars().all()
    if not genres:
        return None
    return [genre.name for genre in genres]

async def get_countries(session: AsyncSession) -> Optional[dict]:
    stmt = select(Country)
    res = await session.execute(stmt)
    countries = res.unique().scalars().all()
    if not countries:
        return None
    return [country.name for country in countries]