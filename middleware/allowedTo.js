const utils = require('../utils/utils');

const allowedTo = (...roles)=>{
    return (req,res,next) =>{

        if(roles.includes(req.currentUser.role)){
        return next();
        }
        res.status(utils.HTTP_STATUS.FORBIDDEN)
            .json({
                    status : utils.STATUS_TEXT.FAIL,
                    data :  {
                        accessToken : null
                    },
                    message : utils.MESSAGES.YOU_ARE_NOT_ALLOW,
                    code :  utils.HTTP_STATUS.FORBIDDEN
            })
        
    };
}


module.exports = {
    allowedTo
}






