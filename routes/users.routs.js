const express = require('express');
const router = express.Router();
const userController = require('../controller/userse.controller');
const {verifyToken} = require('../middleware/verifyToken');




router.route('/')
        .get(
        verifyToken,
        userController.getAllusers)

router.route('/registration')
        .post(userController.registration);

router.route('/login')
        .post(userController.login);

router.route('/otpValidatation')
        .post(userController.validateOTP);


module.exports = router ;