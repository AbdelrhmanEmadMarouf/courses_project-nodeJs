const express = require('express');
const router = express.Router();
const validationSchema = require('../middleware/validationScema.js');
let coursesController = require('../controller/courses.controler.js');
const {verifyToken} = require('../middleware/verifyToken');
const {userRoles} = require('../utils/userRoles.js');
const {allowedTo} = require('../middleware/allowedTo.js');

router.route('/')
        .get(verifyToken,allowedTo(userRoles.MANGER,userRoles.ADMIN),coursesController.getAllCourses)   
        .post(verifyToken,allowedTo(userRoles.ADMIN),
            validationSchema.validationSchema()
        ,
    coursesController.createCourse);

router.route('/:courseId')  
        .get(verifyToken,coursesController.getCourse)
        .patch(verifyToken,allowedTo(userRoles.ADMIN),coursesController.editCourse)
        .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),coursesController.deleteCourse)

module.exports = router ;