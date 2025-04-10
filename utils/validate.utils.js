const { pool } = require('../db//initDb'); 

// Получение пользователя из базы
const getUserByName = async (name) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE name = $1',
        [name]
    );
    return result.rows[0]; // Возвращаем объект пользователя, если он существует
};

// Проверка существования пользователя
const doesUserExist = async (name) => {
    const user = await getUserByName(name);
    return !!user; // Возвращаем true, если пользователь существует, иначе false
};

module.exports = { getUserByName, doesUserExist };
