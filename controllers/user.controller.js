const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');
const {registrationValidate,checkUser} = require('../utils/password.utils');

const generateAccessToken=(id,role)=>{
    const jwtSecret = process.env.JWT_SECRET|| 'your_secret_key';
    console.log(jwtSecret)
    const payload={
        id,role
    }
    return jwt.sign(payload,jwtSecret,{ expiresIn: '24h' })
}
//рефреш токен
class UserController{
    // РАБОТАЕТ
    async createUser(req,res){
        try{
            const {name,password} = req.body;
            const validationError = await registrationValidate(name, password, db);

            if (validationError) {
                return res.status(validationError.status).json({ message: validationError.message });
            }
            const hashPassword = bycrypt.hashSync(password,6)

            const newUser = await db.query(
                'INSERT INTO users(name,password) values ($1, $2) RETURNING id',
                [name,hashPassword]
            );
            // логать все на русском
            res.status(201).json({
                message: 'Пользователь был успешно зарегистрирован!',
                user: newUser.rows[0],
            });

        }catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Ошибка регистрации', error });
        }    
    }
    // РАБОТАЕТ
    async createToken(req,res){
        
         try{
            const { name, password } = req.body;
            const user = await checkUser(name, password, db);
            if (user) {
                return res.status(user.status).json({ message: user.message });
            }

            const result = await db.query(
                'SELECT id, role FROM users WHERE name = $1',
                [name]
            );

            const { id, role } = result.rows[0];

            const token = generateAccessToken(id, role);

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error: 'Login error' });
        }
       
    }
    // РАБОТАЕТ
    async getOneUser(req,res){      
        const id = req.params.id
        try{
            const user = await db.query(
                'SELECT id, name, role FROM users where id = $1',
                [id])
            res.json(user.rows[0]).name;
        }catch (error) {
            console.error(error);
            res.status(400).send({ error: 'Login error' });
        }
    }
    // непроверено
    async updateUser(req, res) {
        try {
            const userIdFromToken = req.user.id; 
            const { id } = req.params; 
            const { name, password } = req.body;

            if (parseInt(id) !== userIdFromToken && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'У вас нет доступа к обновлению этого пользователя.' });
            }

            let hashedPassword = null;
            if (password) {
                hashedPassword = bcrypt.hashSync(password, 6);
            }

            const result = await db.query(
                'UPDATE users SET name = $1, password = COALESCE($2, password) WHERE id = $3 RETURNING id, name, role',
                [name, hashedPassword, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            res.status(200).json({
                message: 'Пользователь успешно обновлен.',
                user: result.rows[0],
            });
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера.', error });
        }
    }
    // РАБОТАЕТ
    async deleteUser(req, res) {
        try {
            const userIdFromToken = req.user.id;
            const { id } = req.params;
    
            if (parseInt(id) !== userIdFromToken && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'У вас нет доступа к удалению этого пользователя.' });
            }
    
            const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, name, role', [id]);
    
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }
    
            res.status(200).json({
                message: 'Пользователь успешно удален.',
                user: result.rows[0],
            });
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера.', error });
        }
    }
    
}
class AdminController {
    // РАБОТАЕТ
    async getAllUsers(req,res){
        const users = await db.query('SELECT id,name,role FROM users');
        res.json(users.rows);
    }
    // РАБОТАЕТ
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
    UserController: new UserController(),
    AdminController: new AdminController(),
};