# backend/app/tasks/update_metrics.py

from datetime import datetime, timedelta
from sqlalchemy import select, func
from app.core.db import AsyncSessionLocal
from app.models.movies import Movie, Series, ContentPopularityMetrics
from app.models.users import UserLike
from app.core.logger import logger

async def update_weekly_metrics():
    """Обновление еженедельных метрик популярности контента"""
    logger.info("Начало обновления еженедельных метрик")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    batch_size = 100
    
    try:
        # Обработка фильмов
        async with AsyncSessionLocal() as session:
            async with session.begin():
                # Получаем общее количество фильмов для пагинации
                total_query = await session.execute(select(func.count(Movie.id)))
                total_movies = total_query.scalar_one()
                
                logger.info(f"Всего фильмов для обработки: {total_movies}")
                
                for offset in range(0, total_movies, batch_size):
                    # Получаем batch фильмов
                    movies_query = await session.execute(
                        select(Movie.id).offset(offset).limit(batch_size)
                    )
                    movie_ids = [m[0] for m in movies_query]
                    
                    for movie_id in movie_ids:
                        # Получаем количество просмотров за неделю
                        views_query = await session.execute(
                            # Здесь должна быть логика для подсчета просмотров
                            # Можно использовать отдельную таблицу UserView или просто брать views_count
                            select(func.count()).where(
                                # Условия для выборки просмотров за период
                            )
                        )
                        views_count = views_query.scalar_one_or_none() or 0
                        
                        # Получаем количество лайков за неделю
                        likes_query = await session.execute(
                            select(func.count(UserLike.id)).where(
                                UserLike.content_id == movie_id,
                                UserLike.content_type == "movie",
                                UserLike.created_at.between(start_date, end_date)
                            )
                        )
                        likes_count = likes_query.scalar_one_or_none() or 0
                        
                        # Создаем или обновляем запись метрик
                        new_metric = ContentPopularityMetrics(
                            content_id=movie_id,
                            content_type='movie',
                            period_start=start_date,
                            period_end=end_date,
                            views_count=views_count,
                            likes_count=likes_count
                        )
                        session.add(new_metric)
                    
                    await session.commit()
                    logger.info(f"Обработано {min(offset + batch_size, total_movies)} фильмов из {total_movies}")
        
        # Аналогичная обработка для сериалов
        async with AsyncSessionLocal() as session:
            async with session.begin():
                # Получаем общее количество сериалов
                total_query = await session.execute(select(func.count(Series.id)))
                total_series = total_query.scalar_one()
                
                logger.info(f"Всего сериалов для обработки: {total_series}")
                
                # Аналогичный код для обработки сериалов...
                
        logger.info("Обновление еженедельных метрик завершено успешно")
        
    except Exception as e:
        logger.error(f"Ошибка при обновлении еженедельных метрик: {e}")

async def update_monthly_metrics():
    """Обновление ежемесячных метрик популярности контента"""
    logger.info("Начало обновления ежемесячных метрик")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Аналогичная логика, как в update_weekly_metrics, но для периода в месяц
    # ...
    
    logger.info("Обновление ежемесячных метрик завершено успешно")