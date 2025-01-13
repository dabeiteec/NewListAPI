const jwt = require('jsonwebtoken');
const generateAccessToken = (id, role) => {
    const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
    const payload = { id, role };
    return jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
};

module.exports = { generateAccessToken };