from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.movies import *
from typing import Optional
from sqlalchemy.orm import joinedload, selectinload

def generate_movie_data(movie: Movie) -> dict:
    return {
        'id': movie.id,
        'title': movie.title,
        'year': movie.year,
        'description': movie.description,
        'duration': movie.duration,
        'genres': [{'id': genre.id, 'name': genre.name} for genre in movie.genres],
        'actors': [{'id': actor.id, 'name': actor.name, 'birth_date': actor.birth_date} for actor in movie.actors],
        'media': [{'id': media.id, 'type': media.type, 'url': media.url} for media in movie.media],
        'statistics': {'views': movie.statistics.views, 'likes': movie.statistics.likes} if movie.statistics else None
    }

async def get_movie(movie_id: int, session: AsyncSession) -> Optional[dict]:
    stmt = (
        select(Movie)
        .where(Movie.id == movie_id)
        .options(
            joinedload(Movie.genres),
            joinedload(Movie.actors),
            joinedload(Movie.media),
            joinedload(Movie.statistics)
        )
    )

    res = await session.execute(stmt)
    movie = res.scalars().first()

    if not movie:
        return None
    
    data = generate_movie_data(movie)
    return data

async def get_movies(session: AsyncSession, genre:list[str] = [], actor: str=None, start_date: int=None, end_date: int=None) -> Optional[dict]:
    stmt = select(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.actors),
        joinedload(Movie.media),
        joinedload(Movie.statistics)
    )

    if start_date and end_date:
        stmt = stmt.where(Movie.year.between(start_date, end_date))
    
    if actor:
        stmt = stmt.where(Movie.actors.any(Actor.name.ilike(f"%{actor}%")))

    if genre:
        stmt = stmt.where(Movie.genres.any(Genre.name.in_(genre)))

    res = await session.execute(stmt)
    movies = res.unique().scalars().all()

    if not movies:
        return None

    data = [generate_movie_data(movie) for movie in movies]
    return data
