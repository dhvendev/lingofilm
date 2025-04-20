#!/bin/bash
# Скрипт для создания самоподписанных SSL сертификатов для локальной разработки

# Создаем директорию для сертификатов, если ее нет
mkdir -p .ssl

# Переходим в директорию
cd .ssl

# Генерируем приватный ключ
openssl genrsa -out key.pem 2048

# Генерируем CSR (Certificate Signing Request)
openssl req -new -key key.pem -out csr.pem -subj "/C=RU/ST=Moscow/L=Moscow/O=LingoFilms/OU=Development/CN=localhost"

# Генерируем самоподписанный сертификат
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

# Удаляем CSR, он больше не нужен
rm csr.pem

echo "SSL сертификаты успешно созданы в директории .ssl/"
echo "cert.pem - сертификат"
echo "key.pem - приватный ключ"

# Возвращаемся в исходную директорию
cd ..

# Создаем .env файл для бэкенда если его не существует
if [ ! -f .env ]; then
    echo "Создаем .env файл для бэкенда"
    echo "SSL_KEYFILE=.ssl/key.pem" > .env
    echo "SSL_CERTFILE=.ssl/cert.pem" >> .env
fi

echo "Готово! Теперь вы можете запустить сервер с HTTPS."