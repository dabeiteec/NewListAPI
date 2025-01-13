const db = require('../db/db');
const bcrypt = require('bcrypt');
const { registrationValidate, checkUser } = require('../utils/password.utils');
const { generateAccessToken } = require('../utils/jwt.utils');

class UserServices {
    async createUser(name, password) {
        try {
            const validationError = await registrationValidate(name, password, db);

            if (validationError) {
                throw { status: validationError.status, message: validationError.message };
            }

            const hashPassword = bcrypt.hashSync(password, 6);
            const newUser = await db.query(
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
            const user = await checkUser(name, password, db);
            if (user) {
                throw { status: user.status, message: user.message };
            }

            const result = await db.query(
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

    async getOneUser(id) {
        try {
            const user = await db.query(
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

            const result = await db.query(
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

            const result = await db.query(
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
            const users = await db.query('SELECT id,name,role FROM users');
            res.json(users.rows);
        }
        
        async setUserRole(req, res) {
            try {
                const userId = req.params.id;
                const { role } = req.body; 
                const adminRole = req.user.role; 
        
                if (adminRole !== 'admin') {
                    return res.status(403).json({ message: 'У вас нет прав для изменения ролей.' });
                }
        
                if (!userId) {
                    return res.status(400).json({ message: 'Необходимо указать userId.' });
                }
        
                const validRoles = ['admin', 'moderator', 'default_user'];
                if (!validRoles.includes(role)) {
                    return res.status(400).json({ message: 'Недопустимая роль.' });
                }
        
                const result = await db.query(
                    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, role',
                    [role, userId]
                );
        
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Пользователь с указанным ID не найден.' });
                }
        
                res.status(200).json({
                    message: 'Роль успешно обновлена.',
                    user: result.rows[0],
                });
            } catch (error) {
                console.error('Ошибка при назначении роли:', error);
                res.status(500).json({ message: 'Ошибка сервера.', error });
            }
    } 
}

module.exports = {
    UserServices: new UserServices(),
    AdminServices: new AdminServices(),
}