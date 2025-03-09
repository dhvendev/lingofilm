from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=True, pool_size=20, max_overflow=10)

async def get_db():
    async with engine.begin() as conn:
        yield conn