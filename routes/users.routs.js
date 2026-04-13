const express = require('express');
const router = express.Router();
const userController = require('../controller/userse.controller');
const {verifyToken} = require('../middleware/verifyToken');


router.route('/')
        .get(
        verifyToken,
        userController.getAllusers)

module.exports = router ;