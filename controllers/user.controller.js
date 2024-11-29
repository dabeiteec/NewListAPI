const db = require('../db')

class UserController{
    async createUser(req,res){
        const {name,password} = req.body;
        const newUser = await db.query(
            'INSERT INTO users(name,password) values ($1, $2) RETURNING *',
            [name,password]
        );
        res.json(newUser.rows[0]);
    }
    async getAllUsers(req,res){
        const users = await db.query('SELECT * FROM users');
        res.json(users.rows);
    }
    async getOneUser(req,res){
        const id = req.params.id
        const user = await db.query(
            'SELECT * FROM users where id = $1',
            [id])
        res.json(user.rows[0]);
    }
    async updateUser(req,res){
        const {id,name,password} = req.body
        const user = await db.query(
            'UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *',
            [name,password,id]
        )
        res.json(user.rows[0]);
    }
    async deleteUser(req,res){
        const id = req.params.id
        const user = await db.query(
            'DELETE FROM users where id = $1',
            [id])
        res.json(user.rows[0]);
    }
}
module.exports = new UserController()