from datetime import datetime, timedelta
from sqlalchemy import select, desc, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.models.movies import Movie, Series, ContentPopularityMetrics
from typing import Optional, List, Dict, Any, Literal

def s3_url(path: str | None) -> str | None:
    return f"https://s3.lingofilm.ru{path}" if path else None


def _base_movie_dict(movie: Movie) -> dict:
    return {
        'id': movie.id,
        'title': movie.title,
        'slug': movie.slug,
        'year': movie.year,
        'description': movie.description,
        'difficulty': movie.difficulty,
        'duration': movie.duration,
        'views_count': movie.views_count,
        'likes_count': movie.likes_count,
        'cover_url': s3_url(movie.cover_url),
        'thumbnail_url': s3_url(movie.thumbnail_url)
    }


def generate_movie_data(movie: Movie) -> dict:
    data = _base_movie_dict(movie)
    data.update({
        'genres': [genre.name for genre in movie.genres],
        'countries': [country.name for country in movie.countries],
        'actors': [actor.name for actor in movie.actors],
        'media': [{'quality': m.quality, 'url': f"https://s3.lingofilm.ru{m.url}"} for m in movie.media],
        'subtitles': [{'language': s.language, 'url': f"https://s3.lingofilm.ru{s.url}"} for s in movie.subtitles],
    })
    return data

def generate_movie_simple(movie: Movie) -> dict:
    return _base_movie_dict(movie)

# # Вспомогательные функции для форматирования данных
# def generate_movie_data(movie: Movie) -> dict:
#     """Форматирует данные фильма для API ответа"""
#     return {
#         'id': movie.id,
#         'title': movie.title,
#         'slug': movie.slug,
#         'year': movie.year,
#         'description': movie.description,
#         'difficulty': movie.difficulty,
#         'duration': movie.duration,
#         'views_count': movie.views_count,
#         'likes_count': movie.likes_count,
#         'cover_url': ("https://s3.lingofilm.ru" + movie.cover_url) if movie.cover_url else None,
#         'thumbnail_url': ("https://s3.lingofilm.ru" + movie.thumbnail_url) if movie.thumbnail_url else None,
#         'genres': [genre.name for genre in movie.genres],
#         'countries': [country.name for country in movie.countries],
#         'actors': [actor.name for actor in movie.actors],
#         'media': [{'quality': media.quality, 'url': "https://s3.lingofilm.ru" + media.url} for media in movie.media],
#         'subtitles': [{'language': subtitle.language, 'url': "https://s3.lingofilm.ru" + subtitle.url} for subtitle in movie.subtitles],
#     }

def _base_series_dict(series: Series) -> dict:
    return {
        'id': series.id,
        'title': series.title,
        'slug': series.slug,
        'year': series.year,
        'description': series.description,
        'difficulty': series.difficulty,
        'views_count': series.views_count,
        'likes_count': series.likes_count,
        'cover_url': s3_url(series.cover_url),
        'thumbnail_url': s3_url(series.thumbnail_url)
    }

def generate_series_data(series: Series) -> dict:
    data = _base_series_dict(series)
    data.update({
        'genres': [genre.name for genre in series.genres],
        'countries': [country.name for country in series.countries],
        'actors': [actor.name for actor in series.actors],
        'seasons': len(series.seasons) if series.seasons else 0,
    })
    return data

def generate_series_simple(series: Series) -> dict:
    return _base_series_dict(series)


async def get_featured_content(session: AsyncSession, limit: int = 5) -> Optional[List[Dict[str, Any]]]:
    """
    Получение избранного контента для главного слайдера на странице.
    is_featured в таблице выставляется вручную или в дашборде.
    """
    
    # Получаем избранные фильмы
    movies_stmt = (
        select(Movie)
        .where(Movie.is_featured == True)
        .options(
            joinedload(Movie.genres),
            joinedload(Movie.actors),
            joinedload(Movie.media),
            joinedload(Movie.subtitles),
            joinedload(Movie.countries)
        )
        .order_by(Movie.created_at.desc())
    )
    
    # Получаем избранные сериалы
    series_stmt = (
        select(Series)
        .where(Series.is_featured == True)
        .options(
            joinedload(Series.genres),
            joinedload(Series.actors),
            joinedload(Series.seasons),
            joinedload(Series.countries)
        )
        .order_by(Series.created_at.desc())
    )
    
    movies_res = await session.execute(movies_stmt)
    series_res = await session.execute(series_stmt)
    
    movies = movies_res.unique().scalars().all()
    series = series_res.unique().scalars().all()
    
    # Формируем объединенный список
    result = []
    
    for movie in movies:
        result.append({
            'type': 'movie',
            **generate_movie_data(movie)
        })
    
    for serie in series:
        result.append({
            'type': 'series',
            **generate_series_data(serie)
        })
    
    # Сортируем по дате создания и ограничиваем лимитом
    result.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    if not result:
        return None
    
    return result[:limit]


# 2. Функция для получения топового контента (по просмотрам/лайкам) за период
async def get_popular_content(
    session: AsyncSession, 
    period: Literal["week", "month"] = "week",
    content_type: Literal["all", "movie", "series"] = "all",
    limit: int = 10
) -> Optional[List[Dict[str, Any]]]:
    """Получение популярного контента за период"""
    
    now = datetime.now()
    if period == "week":
        period_start = now - timedelta(days=7)
    else:
        period_start = now - timedelta(days=30)
    
    # Запрос к метрикам популярности
    stmt = (
        select(ContentPopularityMetrics)
        .where(ContentPopularityMetrics.period_end >= period_start)
    )
    
    if content_type != "all":
        stmt = stmt.where(ContentPopularityMetrics.content_type == content_type)
    
    # Сортировка по сумме просмотров и лайков
    stmt = stmt.order_by(
        (ContentPopularityMetrics.views_count + ContentPopularityMetrics.likes_count).desc()
    )
    
    res = await session.execute(stmt)
    metrics = res.scalars().all()
    
    # Получаем ID фильмов и сериалов
    movie_ids = [m.content_id for m in metrics if m.content_type == "movie"]
    series_ids = [m.content_id for m in metrics if m.content_type == "series"]
    
    # Сбор данных фильмов
    movies_data = []
    if movie_ids and (content_type == "all" or content_type == "movie"):
        movies_stmt = (
            select(Movie)
            .where(Movie.id.in_(movie_ids))
            .options(
                joinedload(Movie.genres),
                joinedload(Movie.actors),
                joinedload(Movie.media),
                joinedload(Movie.subtitles),
                joinedload(Movie.countries)
            )
        )
        movies_res = await session.execute(movies_stmt)
        movies = movies_res.unique().scalars().all()
        
        for movie in movies:
            metric = next((m for m in metrics if m.content_id == movie.id and m.content_type == "movie"), None)
            if metric:
                movie_data = generate_movie_data(movie)
                movie_data['popularity_score'] = metric.views_count + metric.likes_count
                movie_data['type'] = 'movie'
                movies_data.append(movie_data)
    
    # Сбор данных сериалов
    series_data = []
    if series_ids and (content_type == "all" or content_type == "series"):
        series_stmt = (
            select(Series)
            .where(Series.id.in_(series_ids))
            .options(
                joinedload(Series.genres),
                joinedload(Series.actors),
                joinedload(Series.seasons),
                joinedload(Series.countries)
            )
        )
        series_res = await session.execute(series_stmt)
        series_list = series_res.unique().scalars().all()
        
        for serie in series_list:
            metric = next((m for m in metrics if m.content_id == serie.id and m.content_type == "series"), None)
            if metric:
                serie_data = generate_series_data(serie)
                serie_data['popularity_score'] = metric.views_count + metric.likes_count
                serie_data['type'] = 'series'
                series_data.append(serie_data)
    
    # Если нет данных по метрикам популярности, используем обычную сортировку
    if not movies_data and not series_data:
        if content_type == "all" or content_type == "movie":
            movies_stmt = (
                select(Movie)
                .options(
                    joinedload(Movie.genres),
                    joinedload(Movie.actors),
                    joinedload(Movie.media),
                    joinedload(Movie.subtitles),
                    joinedload(Movie.countries)
                )
                .order_by(Movie.views_count.desc(), Movie.likes_count.desc())
                .limit(limit)
            )
            movies_res = await session.execute(movies_stmt)
            movies = movies_res.unique().scalars().all()
            
            for movie in movies:
                movie_data = generate_movie_data(movie)
                movie_data['popularity_score'] = movie.views_count + movie.likes_count
                movie_data['type'] = 'movie'
                movies_data.append(movie_data)
        
        if content_type == "all" or content_type == "series":
            series_stmt = (
                select(Series)
                .options(
                    joinedload(Series.genres),
                    joinedload(Series.actors),
                    joinedload(Series.seasons),
                    joinedload(Series.countries)
                )
                .order_by(Series.views_count.desc(), Series.likes_count.desc())
                .limit(limit)
            )
            series_res = await session.execute(series_stmt)
            series_list = series_res.unique().scalars().all()
            
            for serie in series_list:
                serie_data = generate_series_data(serie)
                serie_data['popularity_score'] = serie.views_count + serie.likes_count
                serie_data['type'] = 'series'
                series_data.append(serie_data)
    
    # Объединяем и сортируем результаты
    combined_data = movies_data + series_data
    combined_data.sort(key=lambda x: x.get('popularity_score', 0), reverse=True)
    
    if not combined_data:
        return None
    
    return combined_data[:limit]

# 3. Функция для получения новинок
async def get_recent_content(
    session: AsyncSession, 
    content_type: Literal["all", "movie", "series"] = "all",
    limit: int = 10
) -> Optional[List[Dict[str, Any]]]:
    """Получение недавно добавленного контента"""
    
    result = []
    
    if content_type == "all" or content_type == "movie":
        # Получаем недавно добавленные фильмы
        movies_stmt = (
            select(Movie)
            .options(
                joinedload(Movie.genres),
                joinedload(Movie.actors),
                joinedload(Movie.media),
                joinedload(Movie.subtitles),
                joinedload(Movie.countries)
            )
            .order_by(Movie.created_at.desc())
            .limit(limit)
        )
        
        movies_res = await session.execute(movies_stmt)
        movies = movies_res.unique().scalars().all()
        
        for movie in movies:
            result.append({
                'type': 'movie',
                **generate_movie_data(movie)
            })
    
    if content_type == "all" or content_type == "series":
        # Получаем недавно добавленные сериалы
        series_stmt = (
            select(Series)
            .options(
                joinedload(Series.genres),
                joinedload(Series.actors),
                joinedload(Series.seasons),
                joinedload(Series.countries)
            )
            .order_by(Series.created_at.desc())
            .limit(limit)
        )
        
        series_res = await session.execute(series_stmt)
        series_list = series_res.unique().scalars().all()
        
        for serie in series_list:
            result.append({
                'type': 'series',
                **generate_series_data(serie)
            })
    
    # Сортируем по дате создания
    result.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    if not result:
        return None
    
    return result[:limit]

async def get_content_by_type(session: AsyncSession, content_type: Literal["movie", "series"], limit: int = 10) -> Optional[List[Dict[str, Any]]]:
    """Получение контента определенного типа"""
    
    if content_type == "movie":
        stmt = (
            select(Movie)
            .options(
                joinedload(Movie.genres),
                joinedload(Movie.actors),
                joinedload(Movie.media),
                joinedload(Movie.subtitles),
                joinedload(Movie.countries)
            )
            .order_by(Movie.views_count.desc(), Movie.likes_count.desc())
            .limit(limit)
        )
        
        res = await session.execute(stmt)
        items = res.unique().scalars().all()
        
        if not items:
            return None
        
        return [generate_movie_data(movie) for movie in items]
        
    else:  # series
        stmt = (
            select(Series)
            .options(
                joinedload(Series.genres),
                joinedload(Series.actors),
                joinedload(Series.seasons),
                joinedload(Series.countries)
            )
            .order_by(Series.views_count.desc(), Series.likes_count.desc())
            .limit(limit)
        )
        
        res = await session.execute(stmt)
        items = res.unique().scalars().all()
        
        if not items:
            return None
        
        return [generate_series_data(serie) for serie in items]