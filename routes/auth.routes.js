const express = require('express');
const router = express.Router();
const {refreshTokenHandler} = require('../controller/auth.controller'); 
const verifyRefreshToken = require('../middleware/verifyRefreshToken');

router.post('/refresh-token', verifyRefreshToken,refreshTokenHandler);


module.exports = router ;