const {validationResult } = require('express-validator');

const {sql,config} = require('../confiq/DB'); 


const getAllCourses = async (req,res)=>{


    try {
        await sql.connect(config);  
        const result = await sql.query`
        SELECT TITLE , PRICE
        FROM COURSES`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
    }

    
}

const getCourse = async (req,res)=>{

        const courseId =  parseInt(req.params.courseId);

        try {
        await sql.connect(config);  
        const result = await sql.query`
        SELECT TITLE , PRICE 
        FROM COURSES 
        WHERE COURSES.ID = ${courseId}`;

        if(result.recordset.length === 0){
            res.status(404)
            .json({
                msg : "course not found"
            })
        }else{
            res.json(result.recordset);
        }

    } catch (err) {
        console.error(err);
    }
}

const createCourse = async (req,res)=>{

        
        if(!validationResult(req).isEmpty()){
            res.status(400)
                .json({erros : validationResult(req)
                });
        
                return;
        }

    const newCourse = req.body;
    const courseTitle = newCourse.title;
    const coursePrice = newCourse.price;

    try {
        await sql.connect(config); 
        
        const result = await sql.query`
                    INSERT INTO COURSES (TITLE,PRICE)
                    VALUES(${courseTitle},${coursePrice})
        `;

        // status 201 : mean the request is handled successfully and the new item has been created

        res.status(201)
        .json({
                msg : "course added successfully",
        });
    } catch (err) {
        console.error(err);
    }

}

const editCourse = async(req,res)=>{

    const courseId = parseInt(req.params.courseId);
    const requestBody =   req.body;

    try {

        await sql.connect(config);  
        let course = await sql.query`
            SELECT COURSES.TITLE , COURSES.PRICE 
            FROM COURSES
            WHERE COURSES.ID = ${courseId}`;

            if(course.recordset.length ===0){
                res.json({
                    msg : "Id Not Found"
                })
            }

            
            course = {...course.recordset[0],...requestBody};
            
            const courseTitle = course.TITLE;
            const coursePRICE = course.PRICE;
            
            await sql.query`
                UPDATE COURSES 
                SET 
                COURSES.TITLE =${courseTitle},
                COURSES.PRICE = ${coursePRICE}
                WHERE COURSES.ID = ${courseId}
                `;

            res.status(200)
            .json({msg : "successfull"
            });

    } catch (err) {
        console.error(err);
    }
}

const deleteCourse = async(req,res)=>{

    const courseId = parseInt(req.params.courseId);

    try {
        await sql.connect(config);  
        await sql.query`
        DELETE FROM COURSES
        WHERE ID = ${courseId};
`;
        res.status(200)
        .json({
            msg : "Course Deleted Successfully"
        });
    } catch (err) {
        console.error(err);
    }

}

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    editCourse,
    deleteCourse
}