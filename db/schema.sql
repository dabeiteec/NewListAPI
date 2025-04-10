-- Таблица статусов новостей
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_status') THEN
        CREATE TYPE news_status AS ENUM ('approved', 'unapproved', 'rejected');
    END IF;
END $$;

-- Таблица ролей
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('admin', 'moderator', 'default_user');
    END IF;
END $$;

-----------------------------------------------------------------------------------

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_enum NOT NULL DEFAULT 'default_user'
);

-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(2000),
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    image VARCHAR(2083),
    status news_status NOT NULL DEFAULT 'unapproved'
);

-- Таблица тем
CREATE TABLE IF NOT EXISTS theme (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'NOT ASSIGNED'
);

-- Таблица связи новостей и тем
CREATE TABLE IF NOT EXISTS news_theme (
    id SERIAL PRIMARY KEY,
    news_id INT REFERENCES news(id) ON DELETE CASCADE NOT NULL,
    theme_id INT REFERENCES theme(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(news_id, theme_id)
);
