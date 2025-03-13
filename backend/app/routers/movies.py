from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import redis
import uuid
from app.core.db import get_db
from app.crud.movies import get_movie, get_movies

router = APIRouter()


@router.post('/getMovie')
async def get_movie_route(session: AsyncSession = Depends(get_db)):
    movie = await get_movie(1, session)
    return movie

@router.get('/getMovies')
async def get_movies_route(genre:list[str] = Query([]), actor: str=None, start_date: int=None, end_date: int=None, session: AsyncSession = Depends(get_db)):
    movies = await get_movies(session, genre, actor, start_date, end_date)
    return movies