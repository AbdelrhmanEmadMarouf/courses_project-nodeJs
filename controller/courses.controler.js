const {validationResult } = require('express-validator');
const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');



const getAllCourses = asyncWrapper(async (req,res)=>{


    const queryParameters = req.query;

    const limit = parseInt(queryParameters.limit) || 10;
    const page =  parseInt(queryParameters.page) || 1 ;

    const offset = limit * (page - 1);

    
        const result = await sql.query`
        SELECT *
        FROM COURSES 
        ORDER BY PRICE
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;`;

        res.status(utils.HTTP_STATUS.OK)
        .json({
            status : utils.STATUS_TEXT.SUCCESS,
            data : result.recordset,
            code : utils.HTTP_STATUS.OK
        });
    
})

const getCourse = asyncWrapper(async (req,res,next)=>{

        const courseId =  req.params.courseId;


        const result = await sql.query`
        SELECT * 
        FROM COURSES 
        WHERE COURSES.ID = ${courseId}`;

        // course not found
        if(result.recordset.length === 0){

            const error=  appError.create(
                utils.MESSAGES.COURSE_NOT_FOUND,
                utils.STATUS_TEXT.FAIL,
                utils.HTTP_STATUS.NOT_FOUND
            )

            return next(error);

        }
            res.status(utils.HTTP_STATUS.OK)
            .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data : result.recordset[0],
                code : utils.HTTP_STATUS.OK
            });  
});

const createCourse = asyncWrapper(async (req,res,next)=>{


        // validation error
        if(!validationResult(req).isEmpty()){

                const error=  appError.create(
                utils.MESSAGES = validationResult(req),
                utils.STATUS_TEXT.FAIL,
                utils.HTTP_STATUS.BAD_REQUEST
                )
            return next(error);

        }

    const newCourse = req.body;
    const courseTitle = newCourse.title;
    const coursePrice = newCourse.price;

        await sql.query`
                    INSERT INTO COURSES (TITLE,PRICE)
                    VALUES(${courseTitle},${coursePrice})
        `;

        

        res.status(utils.HTTP_STATUS.CREATED)
        .json({
                status :utils.STATUS_TEXT.SUCCESS,
                data : {
                    TITLE : courseTitle ,
                    PRICE : coursePrice
                },
                code : utils.HTTP_STATUS.CREATED
        });

})

const editCourse = asyncWrapper(async(req,res,next)=>{

    const courseId = req.params.courseId;
    const requestBody =   req.body;

        let course = await sql.query`
            SELECT *
            FROM COURSES
            WHERE COURSES.ID = ${courseId}`;

            // course not found
            if(course.recordset.length ===0){

            const error=  appError.create(
            utils.MESSAGES.COURSE_NOT_FOUND,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.NOT_FOUND
            )
            return next(error);

            }
            course = {...course.recordset[0],...requestBody};

            await sql.query`
                UPDATE COURSES 
                SET 
                COURSES.TITLE =${course.TITLE},
                COURSES.PRICE = ${course.PRICE}
                WHERE COURSES.ID = ${courseId}
                `;

            res.status(utils.HTTP_STATUS.OK)
            .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data : course,
                code : utils.HTTP_STATUS.OK
            });

    
})

const deleteCourse = asyncWrapper(async(req,res,next)=>{

    const courseId = req.params.courseId;

    
        const course =  await sql.query`
        SELECT TITLE , PRICE FROM COURSES
        WHERE ID = ${courseId};
        `;

        // course not found
        if(course.recordset.length ===0){

            const error=  appError.create(
            utils.MESSAGES.COURSE_NOT_FOUND,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.NOT_FOUND
            )

            return next(error);


        }

        await sql.query`
        DELETE FROM COURSES
        WHERE ID = ${courseId};
        `;

        res.status(utils.HTTP_STATUS.OK)
        .json({
            status : utils.STATUS_TEXT.SUCCESS,
            data : null,
            code : utils.HTTP_STATUS.OK
        });

})

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    editCourse,
    deleteCourse
}   