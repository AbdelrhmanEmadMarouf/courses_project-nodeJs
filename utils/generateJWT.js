const jwt = require('jsonwebtoken');

module.exports = (payload)=>{

    //* generate JWT Token

    return jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: '1m' });
}

