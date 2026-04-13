const jwt = require('jsonwebtoken');
const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');


module.exports = async(req,res,next)=>{

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

    const refreshToken = authHeader.split(' ')[1];

    try{
    //*if it doesn't throw an exception so it means that the validation is valid
    const currentUser = jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY);
    const userId = currentUser.id;

    let dbRefreshToken = await sql.query`
    SELECT refresh_token 
    FROM USERS 
    WHERE id = ${userId}
    `;
 

    if (!dbRefreshToken.recordset.length) {
    return res.status(utils.HTTP_STATUS.NOT_FOUND).json({
        status: utils.STATUS_TEXT.FAIL,
        message: utils.MESSAGES.USER_NOT_FOUND,
        code: utils.HTTP_STATUS.NOT_FOUND
            });
        }


    dbRefreshToken = dbRefreshToken.recordset[0].refresh_token;

    if (!dbRefreshToken || refreshToken !== dbRefreshToken) {
            return res.status(utils.HTTP_STATUS.UNAUTHORIZED)
            .json({
                status: utils.STATUS_TEXT.FAIL,
                message: utils.MESSAGES.INVALID_REFRESH_TOKEN,
                code: utils.HTTP_STATUS.UNAUTHORIZED
            });
        }

        req.currentUser = currentUser ;
        next();

    }catch(err){
        return  res.status(utils.HTTP_STATUS.UNAUTHORIZED)
            .json({
                    status : utils.STATUS_TEXT.FAIL,
                    data :  {
                        accessToken : null
                    },
                    message : err.message,
                    code :  utils.HTTP_STATUS.UNAUTHORIZED
            })
    }

}