from logging.config import fileConfig
from sqlalchemy import create_engine
from alembic import context
from app.core.db import Base
from app.core.config import settings
from app.models.users import User, Subscription,UserSubscription
from app.models.movies import *


config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_online() -> None:
    url = settings.DATABASE_URL
    url = url.replace("asyncpg", "psycopg2")
    connectable = create_engine(url)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


print(Base.metadata.tables)
run_migrations_online()
