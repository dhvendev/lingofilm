FROM node:20-alpine

WORKDIR /app

# Установка зависимостей
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Копирование кода приложения
COPY frontend/ ./

# Экспозиция порта
EXPOSE 3000

# Команда запуска для разработки
CMD ["npm", "run", "dev"]