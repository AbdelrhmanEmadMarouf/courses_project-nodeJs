const jwt = require('jsonwebtoken');

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );
};

module.exports = {generateRefreshToken}