const { AuthServices } = require('../services/auth.services');

class AuthController {
    async createUser(req, res) {
        try {
            const errorArray = [] 
            const { name, password } = req.body;
            if(!name ||!password){
                errorArray.push("Поля имя и пароль обязательны к заполнению")
            }
            if (name.length < 3) {
                errorArray.push("Длина имени должна быть больше 3 символов")
            }
        
            if (password.length < 6) {
                errorArray.push("Длина пароля должна быть больше 6 символов")
            }
            if (errorArray.length > 0) {
                return res.status(400).json({ message: errorArray });
            }
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
            if (!name || !password) {
                throw {status: 400,message: 'Поля имя и пароль обязательны к заполнению'};
            }

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
