from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from app.core.config import settings

from alembic import context
from app.core.db import metadata

engine = create_async_engine(settings.DATABASE_URL, echo=True)

def run_migrations_online():
    connectable = engine

    async def do_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(metadata.create_all)
            context.configure(connection=connection)

            with context.begin_transaction():
                context.run_migrations()

    import asyncio
    asyncio.run(do_migrations())


run_migrations_online()
