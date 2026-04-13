const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');
const asyncWrapper = require('../middleware/asyncWrapper');


const getAllusers =  asyncWrapper(async(req,res,next)=>{

    const queryParameters = req.query;

    const limit = parseInt(queryParameters.limit) || 10;
    const page =  parseInt(queryParameters.page) || 1 ;

    const offset = limit * (page - 1);

    const result = await sql.query`
    SELECT id,email,first_name,last_name,role
    FROM USERS 
    ORDER BY ID
    OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;`;

    res.status(utils.HTTP_STATUS.OK)
        .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data :  result.recordset,
                code :  utils.HTTP_STATUS.OK
        })
})


module.exports = {
    getAllusers
}