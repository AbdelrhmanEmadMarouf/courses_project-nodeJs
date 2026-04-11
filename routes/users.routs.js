const express = require('express');
const router = express.Router();
const userController = require('../controller/userse.controller');




router.route('/')
        .get(userController.getAllusers)

router.route('/registration')
        .post(userController.registration);

router.route('/login')
        .post(userController.login);

router.route('/otpValidatation')
        .post(userController.validateOTP);


module.exports = router ;