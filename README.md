# Проект "Название проекта"

## Описание

Краткое описание проекта.

## Технологии

Проект разработан с использованием следующих технологий и инструментов:

- **Node.js**: серверная среда выполнения JavaScript.
- **Express.js**: веб-фреймворк для Node.js.
- **PostgreSQL**: реляционная база данных.
- **SQL**: язык структурированных запросов для работы с базой данных.
- **TypeScript**: язык программирования, добавляющий статическую типизацию к JavaScript.
- **npm**: менеджер пакетов для Node.js.
- **Git**: система контроля версий для управления исходным кодом.

## Структура базы данных

Описание структуры базы данных и SQL-скрипты для создания базы данных:

1. **Таблица `holidays`**: хранит информацию о праздничных днях.

    ```sql
    CREATE TABLE holidays (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL
    );
    ```

2. **Таблица `working_hours`**: хранит информацию о рабочих часах.

    ```sql
    CREATE TABLE working_hours (
        id SERIAL PRIMARY KEY,
        year INT NOT NULL,
        month INT NOT NULL,
        hours INT NOT NULL
    );
    ```

3. **Таблица `working_weekend`**: хранит информацию о перенесенных рабочих днях.

    ```sql
    CREATE TABLE working_weekend (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL
    );
    ```

## Установка и запуск

1. Клонировать репозиторий:

    ```
    git clone https://github.com/your-username/your-project.git
    ```

2. Установить зависимости:

    ```
    cd your-project
    npm install
    ```

3. Запустить сервер:

    ```
    npm start
    ```

