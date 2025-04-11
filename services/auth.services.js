const { pool } = require('../db/initDb');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/jwt.utils');

class AuthServices {
    async createUser(name, password) {
        try {
            const hashPassword = bcrypt.hashSync(password, 6);
            const newUser = await pool.query(
                'INSERT INTO users(name, password) VALUES ($1, $2) RETURNING id',
                [name, hashPassword]
            );

            return {
                message: 'Пользователь был успешно зарегистрирован!',
                user: newUser.rows[0],
            };
        } catch (error) {
            console.error(error);
            throw { status: 500, message: 'Ошибка при создании пользователя.' };
        }
    }

    async createToken(name, password) {
        try {
            const result = await pool.query(
                'SELECT id, role FROM users WHERE name = $1',
                [name]
            );

            if (result.rows.length === 0) {
                throw { status: 404, message: 'Пользователь не найден.' };
            }

            const { id, role } = result.rows[0];
            const token = generateAccessToken(id, role);

            return { token };
        } catch (error) {
            console.error(error);
            throw { status: 500, message: 'Ошибка при создании токена.' };
        }
    }

}



module.exports = {
    AuthServices: new AuthServices(),
}