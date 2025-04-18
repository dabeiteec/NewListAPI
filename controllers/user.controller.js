const { UserServices, AdminServices } = require('../services/user.services');

class UserController {
    async getOneUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserServices.getOneUser(id);
            res.status(200).json(user);
        } catch (error) {
            console.error('Ошибка в getOneUser:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }

    async updateUser(req, res) {
        try {
            const userIdFromToken = req.user.id;
            const { id } = req.params;
            const { name, password } = req.body;
            const updatedUser = await UserServices.updateUser(userIdFromToken, id, name, password, req.user.role);
            res.status(200).json({ message: 'Пользователь успешно обновлен.', user: updatedUser });
        } catch (error) {
            console.error('Ошибка в updateUser:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }

    async deleteUser(req, res) {
        try {
            const userIdFromToken = req.user.id;
            const { id } = req.params;
            const deletedUser = await UserServices.deleteUser(userIdFromToken, id, req.user.role);
            res.status(200).json({ message: 'Пользователь успешно удален.', user: deletedUser });
        } catch (error) {
            console.error('Ошибка в deleteUser:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }
}

class AdminController {
    async getAllUsers(req, res) {
        try {
            const users = await AdminServices.getAllUsers(req, res);
            res.status(200).json(users);
        } catch (error) {
            console.error('Ошибка в getAllUsers:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }

    async setUserRole(req, res) {
        try {
            const userId = req.params.id; 
            const { role } = req.body; 

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ message: 'Необходимо указать корректный userId.' });
            }

            const validRoles = ['admin', 'moderator', 'default_user'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Недопустимая роль.' });
            }

            await AdminServices.setUserRole(userId, role); 

            res.status(200).json({ message: 'Роль успешно обновлена.' });
        } catch (error) {
            console.error('Ошибка в setUserRole:', error);
            res.status(error.status || 500).json({ message: error.message || 'Ошибка сервера.' });
        }
    }
}


module.exports = {
    UserController: new UserController(),
    AdminController: new AdminController(),
};
