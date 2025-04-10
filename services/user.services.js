const { pool } = require('../db/initDb');
const bcrypt = require('bcrypt');
class UserServices {
    async getOneUser(id) {
        try {
            const user = await pool.query(
                'SELECT id, name, role FROM users WHERE id = $1',
                [id]
            );

            if (user.rows.length === 0) {
                throw { status: 404, message: 'Пользователь не найден.' };
            }

            return user.rows[0];
        } catch (error) {
            console.error(error);
            throw { status: 500, message: 'Ошибка при получении пользователя.' };
        }
    }
    async updateUser(userIdFromToken, userId, name, password, role) {
        try {
            if (parseInt(userId) !== userIdFromToken && role !== 'admin') {
                throw { status: 403, message: 'У вас нет доступа к обновлению этого пользователя.' };
            }

            const hashedPassword = password ? bcrypt.hashSync(password, 6) : null;

            const result = await pool.query(
                'UPDATE users SET name = $1, password = COALESCE($2, password) WHERE id = $3 RETURNING id, name, role',
                [name, hashedPassword, userId]
            );

            if (result.rows.length === 0) {
                throw { status: 404, message: 'Пользователь не найден.' };
            }

            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw { status: 500, message: 'Ошибка при обновлении пользователя.' };
        }
    }

    async deleteUser(userIdFromToken, userId, role) {
        try {
            if (parseInt(userId) !== userIdFromToken && role !== 'admin') {
                throw { status: 403, message: 'У вас нет доступа к удалению этого пользователя.' };
            }

            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING id, name, role',
                [userId]
            );

            if (result.rows.length === 0) {
                throw { status: 404, message: 'Пользователь не найден.' };
            }

            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw { status: 500, message: 'Ошибка при удалении пользователя.' };
        }
    }
}

class AdminServices {
    async getAllUsers(req,res){
        const users = await pool.query('SELECT id,name,role FROM users');
        res.json(users.rows);
    }
        
    async setUserRole(userId, role) {
        try {
            const result = await pool.query(
                'SELECT id FROM users WHERE id = $1',
                [userId]
            );

            if (result.rows.length === 0) {
                throw { status: 404, message: 'Пользователь с указанным ID не найден.' };
            }

            await pool.query(
                'UPDATE users SET role = $1 WHERE id = $2',
                [role, userId]
            );
        } catch (error) {
            console.error('Ошибка при обновлении роли пользователя:', error);
            throw { status: 500, message: 'Ошибка сервера при обновлении роли.' };
        }
    }
}

module.exports = {
    UserServices: new UserServices(),
    AdminServices: new AdminServices(),
}