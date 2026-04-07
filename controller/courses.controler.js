const {validationResult } = require('express-validator');
const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');




const getAllCourses = async (req,res)=>{


    const queryParameters = req.query;

    const limit = parseInt(queryParameters.limit) || 10;
    const page =  parseInt(queryParameters.page) || 1 ;

    const offset = limit * (page - 1);

    try {
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
    } catch (err) {
        res.status(utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message :err.message,
            code : utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
    }
}

const getCourse = async (req,res)=>{

        const courseId =  req.params.courseId;

        try {
        const result = await sql.query`
        SELECT * 
        FROM COURSES 
        WHERE COURSES.ID = ${courseId}`;

        if(result.recordset.length === 0){
        return res.status(utils.HTTP_STATUS.NOT_FOUND)
            .json({
                status : utils.STATUS_TEXT.FAIL,
                message : utils.MESSAGES.COURSE_NOT_FOUND,
                code : utils.HTTP_STATUS.NOT_FOUND
            })
        }
            res.status(utils.HTTP_STATUS.OK)
            .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data : result.recordset[0],
                code : utils.HTTP_STATUS.OK
            });  

    } catch (err) {
            res.status(utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({
                status : utils.STATUS_TEXT.ERROR,
                message : err.message,
                code : utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
            })
    }
}

const createCourse = async (req,res)=>{

        
        if(!validationResult(req).isEmpty()){
            res.status(utils.HTTP_STATUS.BAD_REQUEST)
                .json({
                    status : utils.STATUS_TEXT.FAIL,
                    message : validationResult(req),
                    code : utils.HTTP_STATUS.BAD_REQUEST
                });
        
                return;
        }

    const newCourse = req.body;
    const courseTitle = newCourse.title;
    const coursePrice = newCourse.price;

    try { 
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
    } catch (err) {
        res.status(utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message : err.message,
            code : utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
    }

}

const editCourse = async(req,res)=>{

    const courseId = req.params.courseId;
    const requestBody =   req.body;

    try {
        let course = await sql.query`
            SELECT *
            FROM COURSES
            WHERE COURSES.ID = ${courseId}`;

            if(course.recordset.length ===0){
                return res.status(utils.HTTP_STATUS.NOT_FOUND)
                    .json({
                        status : utils.STATUS_TEXT.FAIL,
                        message : utils.MESSAGES.COURSE_NOT_FOUND,
                        code : utils.HTTP_STATUS.NOT_FOUND
                    })
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

    } catch (err) {
        res.status(utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
            status : utils.STATUS_TEXT.ERROR,
            message : err.message,
            code : utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
    }
}

const deleteCourse = async(req,res)=>{

    const courseId = req.params.courseId;

    try {
        const course =  await sql.query`
        SELECT TITLE , PRICE FROM COURSES
        WHERE ID = ${courseId};
        `;

        if(course.recordset.length ===0){
            return  res.status(utils.HTTP_STATUS.NOT_FOUND)
                .json({
                    status : utils.STATUS_TEXT.FAIL,
                    message : utils.MESSAGES.COURSE_NOT_FOUND,
                    code : utils.HTTP_STATUS.NOT_FOUND
                })
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
    } catch (err) {
        res.status(utils.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
            status :utils.STATUS_TEXT.ERROR,
            message : err.message,
            code : utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        });
    }

}

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    editCourse,
    deleteCourse
}   