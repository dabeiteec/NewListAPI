
// Получение пользователя из базы
const getUserByName = async (name, db) => {
    const result = await db.query(
        'SELECT * FROM users WHERE name = $1',
        [name]
    );
    return result.rows[0]; // Возвращаем объект пользователя, если он существует
};

// Проверка существования пользователя
const doesUserExist = async (name, db) => {
    const user = await getUserByName(name, db);
    return !!user; // Возвращаем true, если пользователь существует, иначе false
};

module.exports = { getUserByName, doesUserExist };
