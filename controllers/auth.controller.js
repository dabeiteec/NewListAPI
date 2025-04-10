const { AuthServices } = require('../services/auth.services');

class AuthController {
    async createUser(req, res) {
        try {
            const { name, password } = req.body;
            const result = await AuthServices.createUser(name, password);
            res.status(201).json(result);
        } catch (error) {
            console.error('Ошибка в createUser:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }

    async createToken(req, res) {
        try {
            const { name, password } = req.body;
            const result = await AuthServices.createToken(name, password);
            res.status(200).json(result);
        } catch (error) {
            console.error('Ошибка в createToken:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }

}


module.exports = {
    AuthController: new AuthController()
};
