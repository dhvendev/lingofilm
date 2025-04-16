from fastapi import APIRouter, Response, Request, HTTPException, Depends, Cookie, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio  
import redis
import uuid
from app.core.db import get_db
from app.crud.movies import get_movie, get_movies, get_movies_for_search, get_movies_by_filter
from typing import Optional

router = APIRouter()

class SearchPayload(BaseModel):
    query: str

class MoviePayload(BaseModel):
    slug: str

class FilterPayload(BaseModel):
    genre: Optional[str] = None
    actor: Optional[str] = None
    year: Optional[int] = None
    difficulty: Optional[str] = None
    country: Optional[str] = None
    sort: Optional[str] = None

@router.post('/getMovie')
async def get_movie_route(movie: MoviePayload, session: AsyncSession = Depends(get_db)):
    data = await get_movie(movie.slug, session)
    return data

@router.post('/getMovies')
async def get_movies_route(session: AsyncSession = Depends(get_db)):
    data = await get_movies(session)
    return data

@router.post('/getMoviesByFilter')
async def get_movies_for_filter_route(payload: FilterPayload, session: AsyncSession = Depends(get_db)):
    movies = await get_movies_by_filter(session, payload.genre, payload.actor, payload.year, payload.difficulty, payload.country, payload.sort)
    print(movies)
    return movies


@router.post('/searchMovies')
async def search_movies_route(payload: SearchPayload, session: AsyncSession = Depends(get_db)):
    movies = await get_movies_for_search(session, payload.query)
    return movies