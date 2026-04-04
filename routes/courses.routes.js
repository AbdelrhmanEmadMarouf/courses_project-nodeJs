const express = require('express');
const router = express.Router();
const validationSchema = require('../middleware/validationScema.js');

let coursesController = require('../controller/courses.controler.js');

router.route('/')
        .get(coursesController.getAllCourses)   
        .post(
            validationSchema.validationSchema()
        ,
    coursesController.createCourse);

router.route('/:courseId')  
        .get(coursesController.getCourse)
        .patch(coursesController.editCourse)
        .delete(coursesController.deleteCourse)

module.exports = router ;