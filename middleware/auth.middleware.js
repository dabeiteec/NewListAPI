const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Отсутствует токен'});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(error){
        console.log(error);
        return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
}

module.exports = authenticateToken;
