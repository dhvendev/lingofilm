@echo off
REM Скрипт для создания самоподписанных SSL сертификатов для локальной разработки

REM Создаем директорию для сертификатов, если ее нет
if not exist .ssl mkdir .ssl

REM Переходим в директорию
cd .ssl

REM Проверяем наличие OpenSSL
where openssl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo OpenSSL не найден. Пожалуйста, установите OpenSSL для Windows и добавьте его в PATH.
    echo Вы можете скачать OpenSSL здесь: https://slproweb.com/products/Win32OpenSSL.html
    cd ..
    exit /b 1
)

REM Генерируем приватный ключ
openssl genrsa -out key.pem 2048

REM Генерируем CSR (Certificate Signing Request)
openssl req -new -key key.pem -out csr.pem -subj "/C=RU/ST=Moscow/L=Moscow/O=LingoFilms/OU=Development/CN=localhost"

REM Генерируем самоподписанный сертификат
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

REM Удаляем CSR, он больше не нужен
del csr.pem

echo SSL сертификаты успешно созданы в директории .ssl/
echo cert.pem - сертификат
echo key.pem - приватный ключ

REM Возвращаемся в исходную директорию
cd ..

REM Создаем .env файл для бэкенда если его не существует
if not exist .env (
    echo Создаем .env файл для бэкенда
    echo SSL_KEYFILE=.ssl/key.pem > .env
    echo SSL_CERTFILE=.ssl/cert.pem >> .env
)

echo Готово! Теперь вы можете запустить сервер с HTTPS.