const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        id: user.id,
        role: user.role, 
    };

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { generateToken };
