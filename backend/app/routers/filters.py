from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import redis
import uuid
from app.core.db import get_db
from app.crud.filters import get_genres, get_countries

router = APIRouter()


@router.post('/getGenres')
async def get_movie_route(session: AsyncSession = Depends(get_db)):
    data = await get_genres(session)
    return data

@router.post('/getCountries')
async def get_movie_route(session: AsyncSession = Depends(get_db)):
    data = await get_countries(session)
    return data