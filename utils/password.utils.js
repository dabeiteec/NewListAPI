const bcrypt = require('bcrypt');
const validator = require('./validate.utils');
const { pool } = require('../db/initDb');


// Проверка наличия пользователя
const checkUser = async (name,password) => {
    const user = await validator.getUserByName(name);
    if (!user) {
        return { status: 400, message: 'Пользователя с таким именем не существует' };
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
        return { status: 400, message: 'Неверный пароль' };
    }
    return null;
};
module.exports = { checkUser };
