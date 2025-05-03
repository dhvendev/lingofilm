import json
from datetime import datetime
from sqlalchemy import select, delete, update as updateSql, insert, or_
from app.core.db import AsyncSessionLocal
from app.core.redis_connections import redis_client
from app.core.logger import logger
from app.models.users import UserLike
from app.models.movies import Movie, Series
                     
async def sync_likes_to_database():
    """
    Фоновая задача для синхронизации данных о лайках из Redis в базу данных
    Запускается периодически или в период низкой нагрузки
    """
    pending_updates_key = "pending_likes_updates"
    logger.info('Start update likes')
    
    # Создаем новую сессию базы данных для этой операции
    async with AsyncSessionLocal() as session:
        async with session.begin():
            try:
                batch_size = 1000
                offset = 0
                all_processed = False

                while not all_processed:
                    # Получаем пакет элементов
                    updates = await redis_client.zrange(
                        pending_updates_key, 
                        offset, offset + batch_size - 1,
                        withscores=True
                    )
                    
                    # Если получено меньше элементов, чем размер пакета, значит это последний пакет
                    if len(updates) < batch_size:
                        all_processed = True
                    
                    # Обрабатываем текущий пакет
                    if updates:
                        # Группируем операции по типу (add/remove) для оптимизации
                        adds = []
                        removes = []
                        content_updates = {}  # Для обновления счетчиков в моделях Movie/Series
                        processed_keys = set()  # Для дедупликации
                        
                        for update_json, score in updates:
                            update = json.loads(update_json)
                            
                            # Проверка на дубликаты
                            update_key = f"{update['user_id']}:{update['content_type']}:{update['content_id']}"
                            if update_key in processed_keys:
                                continue  # Пропускаем дублирующиеся записи
                            processed_keys.add(update_key)
                            
                            # Ключ для группировки обновлений счетчиков
                            content_key = f"{update['content_type']}:{update['content_id']}"
                            
                            if update["action"] == "add":
                                adds.append({
                                    "user_id": update["user_id"],
                                    "content_id": update["content_id"],
                                    "content_type": update["content_type"],
                                    "created_at": datetime.fromtimestamp(update["timestamp"])
                                })
                                
                                # Инкрементируем счетчик лайков для контента
                                if content_key not in content_updates:
                                    content_updates[content_key] = 0
                                content_updates[content_key] += 1
                                
                            elif update["action"] == "remove":
                                removes.append((
                                    update["user_id"],
                                    update["content_id"],
                                    update["content_type"]
                                ))
                                
                                # Декрементируем счетчик лайков для контента
                                if content_key not in content_updates:
                                    content_updates[content_key] = 0
                                content_updates[content_key] -= 1
                        
                        # Выполняем удаления лайков одним запросом
                        if removes:
                            conditions = []
                            for user_id, content_id, content_type in removes:
                                conditions.append(
                                    (UserLike.user_id == user_id) & 
                                    (UserLike.content_id == content_id) & 
                                    (UserLike.content_type == content_type)
                                )
                            
                            if conditions:
                                await session.execute(
                                    delete(UserLike).where(or_(*conditions))
                                )
                        
                        # Выполняем добавления лайков (используем bulk insert)
                        if adds:
                            await session.execute(insert(UserLike).values(adds))
                        
                        # Обновляем счетчики лайков в моделях Movie/Series
                        for content_key, delta in content_updates.items():
                            content_type, content_id = content_key.split(":")
                            
                            if delta == 0:
                                continue
                                
                            if content_type == "movie":
                                # Получаем текущее значение счетчика
                                movie_result = await session.execute(
                                    select(Movie.likes_count).where(Movie.id == int(content_id))
                                )
                                current_count = movie_result.scalar_one_or_none() or 0
                                
                                # Обновляем счетчик, гарантируя, что он не станет отрицательным
                                new_count = max(0, current_count + delta)
                                await session.execute(
                                    updateSql(Movie)
                                    .where(Movie.id == int(content_id))
                                    .values(likes_count=new_count)
                                )
                            
                            elif content_type == "series":
                                # Аналогично для сериалов
                                series_result = await session.execute(
                                    select(Series.likes_count).where(Series.id == int(content_id))
                                )
                                current_count = series_result.scalar_one_or_none() or 0
                                
                                new_count = max(0, current_count + delta)
                                await session.execute(
                                    updateSql(Series)
                                    .where(Series.id == int(content_id))
                                    .values(likes_count=new_count)
                                )
                        
                        # Удаляем обработанные обновления из Redis
                        update_ids = [u[0] for u in updates]
                        if update_ids:
                            await redis_client.zrem(pending_updates_key, *update_ids)
                        
                        logger.info(f"Processed {len(updates)} likes updates")
                    
                    # Увеличиваем смещение для следующего пакета
                    offset += batch_size
                    
                    # Если получено 0 элементов, завершаем цикл
                    if not updates:
                        break
                
                # Явно делаем commit транзакции
                await session.commit()
                
            except Exception as e:
                logger.error(f"Error syncing likes to database: {e}")
                # Откатываем транзакцию в случае ошибки
                await session.rollback()
                raise
    logger.info('Finish update likes')