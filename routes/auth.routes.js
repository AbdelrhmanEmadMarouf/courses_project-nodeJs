const express = require('express');
const router = express.Router();
const {refreshTokenHandler,login,registration,validateOTP} = require('../controller/auth.controller'); 
const verifyRefreshToken = require('../middleware/verifyRefreshToken');
const path = require('path');
const multer  = require('multer')
const appError = require('../utils/appError');
const utils = require('../utils/utils');

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
        },
        filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+`.${ext}`;
        cb(null, file.fieldname + '-' + uniqueSuffix)
        }
})


const fileFilter = (req, file, cb)=>{

        const fileType = file.mimetype.split('/')[0];
        
        if(fileType == 'image'){
                return  cb(null, true)
        }else{
                const error=  appError.create(
                        utils.MESSAGES.WRONG_FILE_TYPE,
                        utils.STATUS_TEXT.FAIL,
                        utils.HTTP_STATUS.BAD_REQUEST
                ) 
        
        return cb(error, false)
        }
}


const upload = multer({ storage: storage ,fileFilter})


router.post('/refresh-token', verifyRefreshToken,refreshTokenHandler);

router.route('/login')
        .post(login);

router.route('/registration')
        .post(registration);

router.route('/otpValidatation')
        .post(upload.single('avatar'),validateOTP);

module.exports = router ;