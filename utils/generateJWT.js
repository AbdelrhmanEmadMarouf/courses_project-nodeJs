const jwt = require('jsonwebtoken');

module.exports = async(payload)=>{

    //* generate JWT Token

    return await jwt.sign(
        payload
        , process.env.SECRET_KEY,
        { expiresIn: '5m' });

        

}

