const express = require('express');
const router = express.Router();
const {refreshTokenHandler,login,registration,validateOTP} = require('../controller/auth.controller'); 
const verifyRefreshToken = require('../middleware/verifyRefreshToken');

router.post('/refresh-token', verifyRefreshToken,refreshTokenHandler);

router.route('/login')
        .post(login);

router.route('/registration')
        .post(registration);

router.route('/otpValidatation')
        .post(validateOTP);

module.exports = router ;