const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (roles) {
    return function (req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Отсутствует токен' });
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'У вас нет доступа' });
            }

            next();
        } catch (error) {
            console.error('Ошибка проверки роли:', error);
            return res.status(403).json({ message: 'Ошибка прав доступа' });
        }
    };
};
