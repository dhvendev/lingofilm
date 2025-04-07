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
        'difficulty': movie.difficulty,
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

async def get_movies(session: AsyncSession) -> Optional[dict]:
    stmt = (
        select(Movie)
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
    movies = res.unique().scalars().all()

    if not movies:
        return None

    data = [generate_movie_data(movie) for movie in movies]
    return data


async def get_movies_by_filter(session: AsyncSession, genre:str=None, actor: str=None, year: int=None, difficulty: str=None, country: str=None, sort: str="-year") -> Optional[dict]:
    print(difficulty)
    stmt = select(Movie).options(
        joinedload(Movie.genres),
        joinedload(Movie.actors),
        joinedload(Movie.media),
        joinedload(Movie.statistics),
        joinedload(Movie.subtitles),
        joinedload(Movie.countries)
    )

    if actor:
        stmt = stmt.where(Movie.actors.any(Actor.name.ilike(f"%{actor}%")))

    if genre:
        stmt = stmt.where(Movie.genres.any(Genre.name.ilike(f"%{genre}%")))

    if difficulty:
        stmt = stmt.where(Movie.difficulty == difficulty)

    if year:
        stmt = stmt.where(Movie.year == year)

    if country:
        stmt = stmt.where(Movie.countries.any(Country.name.ilike(f"%{country}%")))

    #rating, -rating, year, -year, lexicographical (difficulty: Высокая, средняя, низкая), -lexicographical(difficulty: Низкая, средняя, Высокая)
    # if sort == 'rating':
    #     stmt = stmt.order_by(Statistics.likes.desc())  # Сортировка по статистике
    # elif sort == '-rating':
    #     stmt = stmt.order_by(Statistics.likes)
    if sort == 'year':
        stmt = stmt.order_by(Movie.year)
    if sort == '-year':
        stmt = stmt.order_by(Movie.year.desc())
    if sort == 'lexicographical':
        stmt = stmt.order_by(Movie.difficulty)
    if sort == '-lexicographical':
        stmt = stmt.order_by(Movie.difficulty.desc())
    
    if not sort:
        stmt = stmt.order_by(Movie.year.desc())

    res = await session.execute(stmt)
    movies = res.unique().scalars().all()

    if not movies:
        return None

    data = [generate_movie_data(movie) for movie in movies]
    print(data)
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
