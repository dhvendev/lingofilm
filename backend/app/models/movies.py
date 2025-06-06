from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Date, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

movie_genre_association = Table(
    "movie_genre", Base.metadata,
    Column("movie_id", Integer, ForeignKey("movies.id"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id"), primary_key=True)
)

series_genre_association = Table(
    "series_genre", Base.metadata,
    Column("series_id", Integer, ForeignKey("series.id"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id"), primary_key=True)
)

movie_country_association = Table(
    "movie_country", Base.metadata,
    Column("movie_id", Integer, ForeignKey("movies.id"), primary_key=True),
    Column("country_id", Integer, ForeignKey("countries.id"), primary_key=True)
)

series_country_association = Table(
    "series_country", Base.metadata,
    Column("series_id", Integer, ForeignKey("series.id"), primary_key=True),
    Column("country_id", Integer, ForeignKey("countries.id"), primary_key=True)
)

movie_actor_association = Table(
    "movie_actor", Base.metadata,
    Column("movie_id", Integer, ForeignKey("movies.id"), primary_key=True),
    Column("actor_id", Integer, ForeignKey("actors.id"), primary_key=True)
)

series_actor_association = Table(
    "series_actor", Base.metadata,
    Column("series_id", Integer, ForeignKey("series.id"), primary_key=True),
    Column("actor_id", Integer, ForeignKey("actors.id"), primary_key=True)
)

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"Genre(id={self.id}, name={self.name})"
    
class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"Country(id={self.id}, name={self.name})"

class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    eng_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"Actor(id={self.id}, name={self.name})"

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=True)
    episode_id = Column(Integer, ForeignKey("episodes.id"), nullable=True)
    quality = Column(String(50), nullable=False)
    url = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"Media(id={self.id}, type={self.type}, url={self.url})"

class Subtitle(Base):
    __tablename__ = "subtitles"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=True)
    episode_id = Column(Integer, ForeignKey("episodes.id"), nullable=True)
    language = Column(String(50), nullable=False)
    url = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"Subtitle(id={self.id}, language={self.language}, url={self.url})"

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    year = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    duration = Column(Integer, nullable=False)  # В минутах
    slug = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    cover_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    difficulty = Column(String(50), nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    likes_count = Column(Integer, default=0, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    genres = relationship("Genre", secondary=movie_genre_association, backref="movies")
    countries = relationship("Country", secondary=movie_country_association, backref="movies")
    actors = relationship("Actor", secondary=movie_actor_association, backref="movies")
    media = relationship("Media", backref="movie")
    subtitles = relationship("Subtitle", backref="movie")

    def __repr__(self):
        return f"Movie(id={self.id}, title={self.title}, year={self.year}, duration={self.duration})"

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    year = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    cover_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    difficulty = Column(String(50), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    likes_count = Column(Integer, default=0, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    genres = relationship("Genre", secondary=series_genre_association, backref="series")
    countries = relationship("Country", secondary=series_country_association, backref="series")
    actors = relationship("Actor", secondary=series_actor_association, backref="series")
    seasons = relationship("Season", back_populates="series")
    
    def __repr__(self):
        return f"Series(id={self.id}, title={self.title}, year={self.year})"

class Season(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("series.id"), nullable=False)
    season_number = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    series = relationship("Series", back_populates="seasons")
    episodes = relationship("Episode", back_populates="season")
    
    def __repr__(self):
        return f"Season(id={self.id}, series_id={self.series_id}, season_number={self.season_number})"

class Episode(Base):
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True, index=True)
    season_id = Column(Integer, ForeignKey("seasons.id"), nullable=False)
    title = Column(String(255), nullable=False)
    episode_number = Column(Integer, nullable=False)
    duration = Column(Integer, nullable=False)  # В минутах
    release_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    media = relationship("Media", backref="episode")
    subtitles = relationship("Subtitle", backref="episode")
    season = relationship("Season", back_populates="episodes")
    
    def __repr__(self):
        return f"Episode(id={self.id}, season_id={self.season_id}, title={self.title}, episode_number={self.episode_number}, duration={self.duration})"


class ContentPopularityMetrics(Base):
    __tablename__ = "content_popularity_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, nullable=False)
    content_type = Column(String(10), nullable=False)  # "movie" или "series"
    
    # Период, за который собрана статистика
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Метрики
    views_count = Column(Integer, default=0, nullable=False)
    likes_count = Column(Integer, default=0, nullable=False)
    
    # Индексы для быстрого поиска
    __table_args__ = (
        Index('ix_content_metrics_type_period', content_type, period_start, period_end),
    )