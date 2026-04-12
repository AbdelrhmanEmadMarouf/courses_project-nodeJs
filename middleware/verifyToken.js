const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

const verifyToken = async(req,res,next)=>{

    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeader){
    return  res.status(utils.HTTP_STATUS.UNAUTHORIZED)
        .json({
                status : utils.STATUS_TEXT.FAIL,
                data :  {
                    accessToken : null
                },
                message : utils.MESSAGES.REQUIRED_TOKEN,
                code :  utils.HTTP_STATUS.UNAUTHORIZED
        })
    }

    const token = authHeader.split(' ')[1];

    try{
        //*if it doesn't throw an exception so it means that the validation is valid
    await jwt.verify(token,process.env.SECRET_KEY);
    next();

    }catch{
        return  res.status(utils.HTTP_STATUS.UNAUTHORIZED)
            .json({
                    status : utils.STATUS_TEXT.FAIL,
                    data :  {
                        accessToken : null
                    },
                    message : utils.MESSAGES.INVALID_TOKEN,
                    code :  utils.HTTP_STATUS.UNAUTHORIZED
            })
    }



}

module.exports = {
    verifyToken
}