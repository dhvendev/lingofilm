from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import redis
import uuid
from app.core.db import get_db
from app.crud.movies import get_movie, get_movies, get_movies_for_search

router = APIRouter()

class SearchPayload(BaseModel):
    query: str

class MoviePayload(BaseModel):
    slug: str

@router.post('/getMovie')
async def get_movie_route(movie: MoviePayload, session: AsyncSession = Depends(get_db)):
    data = await get_movie(movie.slug, session)
    return data

@router.get('/getMovies')
async def get_movies_route(genre:list[str] = Query([]), actor: str=None, start_date: int=None, end_date: int=None, session: AsyncSession = Depends(get_db)):
    movies = await get_movies(session, genre, actor, start_date, end_date)
    return movies


@router.post('/searchMovies')
async def search_movies_route(payload: SearchPayload, session: AsyncSession = Depends(get_db)):
    movies = await get_movies_for_search(session, payload.query)
    return movies