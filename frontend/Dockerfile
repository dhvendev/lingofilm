FROM node:20-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/.next ./.next
COPY frontend/public ./public

# Устанавливаем только production зависимости
RUN npm ci --only=production

EXPOSE 3000

# Запускаем собранное приложение
CMD ["npm", "start"]