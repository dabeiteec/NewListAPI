require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});


const ensureDatabaseExists = async () => {
    const checkQuery = `SELECT 1 FROM pg_database WHERE datname='${process.env.DB_NAME}'`;
    const createQuery = `CREATE DATABASE "${process.env.DB_NAME}"`;

    try {
        const result = await pool.query(checkQuery);
        if (result.rowCount === 0) {
            await pool.query(createQuery);
        }
    } catch (error) {
        console.error('❌ Ошибка при проверке/создании базы данных:', error);
        throw error;
    }
};

const initializeSchema = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        pool.options.database = process.env.DB_NAME;
        await pool.query(schema);
    } catch (error) {
        console.error('❌ Ошибка при применении схемы:', error);
        throw error;
    }
};

const initDB = async () => {
    try {
        await ensureDatabaseExists();
        await initializeSchema();
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error);
        throw error;
    }
};

module.exports = { initDB, pool};
