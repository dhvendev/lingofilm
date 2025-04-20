FROM python:3.11-slim

WORKDIR /app

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \
    gcc \
    python3-dev

# Создание и активация виртуального окружения
RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Обновление pip
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Установка зависимостей в виртуальное окружение
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY ./backend /app

# Экспозиция порта
EXPOSE 8000

# Команда запуска
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]