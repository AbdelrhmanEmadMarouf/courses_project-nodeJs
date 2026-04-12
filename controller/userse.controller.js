const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');
const  validator = require('validator');
const  bcrypt = require("bcryptjs");
const generateJWT = require('../utils/generateJWT');
const sendOPT = require('../utils/senOTP');


const getAllusers =  asyncWrapper(async(req,res,next)=>{


  //  console.log(req.headers.authorization);


    const queryParameters = req.query;

    const limit = parseInt(queryParameters.limit) || 10;
    const page =  parseInt(queryParameters.page) || 1 ;

    const offset = limit * (page - 1);

    const result = await sql.query`
    SELECT id,email,first_name,last_name
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


const registration = asyncWrapper(async(req,res,next)=>{

    const newUser = req.body;

    if(!validator.isEmail(newUser.email)){

                    const error=  appError.create(
                        utils.MESSAGES.WRONG_EMAIL_FORMAT,
                        utils.STATUS_TEXT.FAIL,
                        utils.HTTP_STATUS.BAD_REQUEST
                    )
                    return next(error);
    }

const otp = await sendOPT(newUser);

await sql.query`
    INSERT INTO OTP (OTP)
    VALUES (${otp})
`;

const result =await sql.query`
    SELECT id 
    FROM OTP 
    WHERE OTP = ${otp}
`;


const data = {
    otpId : result.recordset[0].id,
    userData : newUser
}

    res.json({
        status : utils.STATUS_TEXT.SUCCESS,
        data :  data,
        code :  utils.HTTP_STATUS.CREATED
    });

})


const validateOTP = asyncWrapper(async(req,res,next)=>{

const otpId = req.body.otpId; 
const otp = req.body.otp; 

const result = await sql.query`
        SELECT * FROM OTP
        WHERE id = ${otpId} AND OTP = ${otp}
    `;


if(result.recordset.length === 0){

        const error=  appError.create(
            utils.MESSAGES.WROG_OTP_VALIDATION,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.NOT_FOUND
        )

        return next(error);

    }

//* hashing password before storing in DB
const hashedPassword = await bcrypt.hash(req.body.password, 10);


await sql.query`
    INSERT INTO USERS(email, first_name, last_name, password)
    VALUES (
        ${req.body.email},
        ${req.body.first_name},
        ${req.body.last_name},
        ${hashedPassword}
    )
`;

//* delte the otp to garante that is won't use after this process
await sql.query`
        DELETE FROM OTP 
        WHERE ID = ${otpId}
`;


    const userData = {
        email : req.body.email ,
        first_name :req.body.first_name ,
        last_name : req.body.last_name,
        password :req.body.password
    };

    const accessToken = await generateJWT({
        email : req.body.email ,
        first_name :req.body.first_name ,
        last_name : req.body.last_name
        });

    res.json({
        status : utils.STATUS_TEXT.SUCCESS,
        data  :  userData,
        code  :  utils.HTTP_STATUS.CREATED  ,
        accessToken : accessToken
    })

})

const login = asyncWrapper(async(req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        const error=  appError.create(
            utils.MESSAGES.REQUIRED_EMAIL_AND_PASSWORD,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.BAD_REQUEST
        )
        return next(error);
    }

    //* hashing password before storing in DB
  //  const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const dbResult = await sql.query`
        SELECT * 
        FROM USERS
        WHERE email = ${email}
    `;

    if(!dbResult.recordset[0].password){
        const error=  appError.create(
            utils.MESSAGES.USER_NOT_FOUND,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.NOT_FOUND
        )
        return next(error); 
    }


    const dbHashedPassword = dbResult.recordset[0].password;

    
    //login password after hashing to matching it with the password that in DB
    //* if the two password are matched ==> return true else return false
    const loginStatus =  await bcrypt.compare(password, dbHashedPassword);

    if(loginStatus){

        const accessToken = await generateJWT({
            email : req.body.email ,
            first_name :dbResult.recordset[0].first_name ,
            last_name : dbResult.recordset[0].last_name
        });

        return  res.status(utils.HTTP_STATUS.OK)
        .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data :  {
                    accessToken : accessToken
                },
                code :  utils.HTTP_STATUS.OK
        })

        }


    return  res.status(utils.HTTP_STATUS.UNAUTHORIZED)
        .json({
                status : utils.STATUS_TEXT.FAIL,
                data :  {
                    accessToken : null
                },
                message : utils.MESSAGES.WRONG_PASSWORD,
                code :  utils.HTTP_STATUS.UNAUTHORIZED
        })






})


module.exports = {
    registration,
    validateOTP,
    getAllusers,
    login
}