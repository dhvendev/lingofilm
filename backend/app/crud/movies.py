from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.movies import *
from typing import Optional
from sqlalchemy.orm import joinedload

def generate_movie_data(movie: Movie) -> dict:
    return {
        'id': movie.id,
        'title': movie.title,
        'slug': movie.slug,
        'year': movie.year,
        'description': movie.description,
        'duration': movie.duration,
        'cover_url': ("https://s3.lingofilm.ru" + movie.cover_url) if movie.cover_url else None,
        'thumbnail_url': ("https://s3.lingofilm.ru" + movie.thumbnail_url) if movie.thumbnail_url else None,
        'genres': [genre.name for genre in movie.genres],
        'countries': [country.name for country in movie.countries],
        'actors': [actor.name for actor in movie.actors],
        'media': [{'quality': media.quality, 'url': "https://s3.lingofilm.ru" + media.url} for media in movie.media],
        'subtitles': [{'language': subtitle.language, 'url': "https://s3.lingofilm.ru" + subtitle.url} for subtitle in movie.subtitles],
        'statistics': {'views': movie.statistics.views, 'likes': movie.statistics.likes} if movie.statistics else None
    }

async def get_movie(movie_slug: str, session: AsyncSession) -> Optional[dict]:
    stmt = (
        select(Movie)
        .where(Movie.slug == movie_slug)
        .options(
            joinedload(Movie.genres),
            joinedload(Movie.actors),
            joinedload(Movie.media),
            joinedload(Movie.statistics),
            joinedload(Movie.subtitles),
            joinedload(Movie.countries)
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
        joinedload(Movie.statistics),
        joinedload(Movie.subtitles),
        joinedload(Movie.countries)
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


async def get_movies_for_search(session: AsyncSession, query: str) -> Optional[dict]:
    query = query.lower()
    stmt = select(Movie).where(Movie.title.ilike(f"%{query}%")).options(
        joinedload(Movie.genres),
        joinedload(Movie.actors),
        joinedload(Movie.media),
        joinedload(Movie.statistics),
        joinedload(Movie.subtitles),
        joinedload(Movie.countries)
    )

    res = await session.execute(stmt)
    movies = res.unique().scalars().all()

    if not movies:
        return None

    data = [generate_movie_data(movie) for movie in movies]
    return data
