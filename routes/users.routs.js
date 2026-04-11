const express = require('express');
const router = express.Router();
const userController = require('../controller/userse.controller');




router.route('/')
        .post(userController.createUser);

router.route('/validate')
        .post(userController.validateOTP);


module.exports = router ;