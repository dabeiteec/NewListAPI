const bcrypt = require('bcrypt');
const validator = require('./validate.utils');
const { pool } = require('../db/initDb');
// Проверка регистрации

const registrationValidate = async (name, password) => {
    if (name.length < 3) {
        return { status: 400, message: 'Имя должно быть длиннее 3 символов.' };
    }

    if (password.length < 6) {
        return { status: 400, message: 'Пароль должен быть длиннее 6 символов.' };
    }

    const userExists = await validator.doesUserExist(name, pool);
    if (userExists) {
        return { status: 400, message: 'Пользователь с таким именем уже существует!' };
    }

    return null;
};

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
module.exports = { checkUser, registrationValidate };
