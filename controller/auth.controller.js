const asyncWrapper = require('../middleware/asyncWrapper');
const generateAccessToken = require('../utils/generateJWT');
const utils = require('../utils/utils');


const refreshTokenHandler = asyncWrapper(async(req,res,next)=>{

    const userData = {
        email: req.currentUser.email,
        first_name: req.currentUser.first_name,
        last_name: req.currentUser.last_name,
        password:req.currentUser.password,
        role: req.currentUser.role,
        id: req.currentUser.id
    }


    const newAccessToken = generateAccessToken(userData);


    return  res.status(utils.HTTP_STATUS.OK)
    .json({
            status : utils.STATUS_TEXT.SUCCESS,
            data :  {
                accessToken : newAccessToken,
            },
            code :  utils.HTTP_STATUS.OK
    })


    })


module.exports = {
    refreshTokenHandler
}