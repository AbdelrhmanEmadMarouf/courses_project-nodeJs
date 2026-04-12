const express = require('express');
const router = express.Router();
const validationSchema = require('../middleware/validationScema.js');
let coursesController = require('../controller/courses.controler.js');
const {verifyToken} = require('../middleware/verifyToken');

router.route('/')
        .get(verifyToken,coursesController.getAllCourses)   
        .post(verifyToken,
            validationSchema.validationSchema()
        ,
    coursesController.createCourse);

router.route('/:courseId')  
        .get(verifyToken,coursesController.getCourse)
        .patch(verifyToken,coursesController.editCourse)
        .delete(verifyToken,coursesController.deleteCourse)

module.exports = router ;