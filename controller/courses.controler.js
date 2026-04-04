let {courses} = require('../data/courses');
const {body,validationResult } = require('express-validator');

const getAllCourses = (req,res)=>{
    res.json(courses);
}

const getCourse = (req,res)=>{

    console.log(req.params);
    const courseId =  parseInt(req.params.courseId);
    const course = courses.find((course)=>{
        return   course.id === courseId;
    })
    if(!course){
        res.status(404)
            .json({
                msg : "course not found"
            })
    }
    res.json(course);
}

const createCourse = (req,res)=>{

        
        if(!validationResult(req).isEmpty()){
            res.status(400)
                .json({erros : validationResult(req)
                });
        
                return;
        }

    const newCourse = req.body;
    const newId = courses.length+1;
    courses.push({id : newId,...newCourse});


    //* status 201 : mean the request is handled successfully and the new item has been created
    res.status(201)
        .json({
        msg : "course added successfully",
        course : newCourse
    });
}

const editCourse = (req,res)=>{
    const courseId = parseInt(req.params.courseId);

    let course = courses.find((course)=>{
        return course.id === courseId ;
    })

    course = {...course,...req.body};

    res.status(200)
    .json({msg : "successfull"
    });
}

const deleteCourse = (req,res)=>{

    const courseId = parseInt(req.params.courseId);
    
    courses = courses.filter((crs)=>{return crs.id !== courseId});

    res.status(200)
        .json({
            courses : courses
        })

}

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    editCourse,
    deleteCourse
}