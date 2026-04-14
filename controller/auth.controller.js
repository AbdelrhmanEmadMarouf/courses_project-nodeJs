const asyncWrapper = require('../middleware/asyncWrapper');
const generateAccessToken = require('../utils/generateJWT');
const utils = require('../utils/utils');
const {sql} = require('../confiq/DB'); 
const appError = require('../utils/appError');
const  bcrypt = require("bcryptjs");
const generateJWT = require('../utils/generateJWT');
const {generateRefreshToken} = require('../utils/generateRefreshToken');
const  validator = require('validator');
const sendOPT = require('../utils/senOTP');
const fs = require('fs');


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
//const hashedPassword = await bcrypt.hash(req.body.password, 10);


    const dbResult = await sql.query`
        SELECT * 
        FROM USERS
        WHERE email = ${email}
    `;



    if(!dbResult.recordset[0]){
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

    const user = {
            email : req.body.email ,
            first_name :dbResult.recordset[0].first_name ,
            last_name : dbResult.recordset[0].last_name,
            role : dbResult.recordset[0].role,
            id : dbResult.recordset[0].id
        };


    if(loginStatus){

        const accessToken =  generateJWT(user);
        const refreshToken = generateRefreshToken(user);

        await sql.query`
        UPDATE USERS
        SET refresh_token = ${refreshToken}
        WHERE ID = ${user.id}
        `

        return  res.status(utils.HTTP_STATUS.OK)
        .json({
                status : utils.STATUS_TEXT.SUCCESS,
                data :  {
                    accessToken : accessToken,
                    refreshToken : refreshToken
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

const refreshTokenHandler = asyncWrapper(async(req,res,next)=>{

    const userData = {
        email: req.currentUser.email,
        first_name: req.currentUser.first_name,
        last_name: req.currentUser.last_name,
        password:req.currentUser.password,
        role: req.currentUser.role,
        id: req.currentUser.id
    }


    const newAccessToken = generateAccessToken(userData);


    return  res.status(utils.HTTP_STATUS.OK)
    .json({
            status : utils.STATUS_TEXT.SUCCESS,
            data :  {
                accessToken : newAccessToken,
            },
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

delete newUser.password;

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

    /*
    1- the file is already uploaded into the server 
    2- here the validation of the otp is faild so we deleted this file from the 
        server 
    */
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

        return next(error);

    }

//* hashing password before storing in DB
const hashedPassword = await bcrypt.hash(req.body.password, 10);


let avatarPath = null;


if (req.file) {
    avatarPath = `/uploads/${req.file.filename}`;
}else{
    avatarPath = `/uploads/personal image.jpeg`;
}

try{
await sql.query`
    INSERT INTO USERS(email, first_name, last_name, password,role,Avatar)
    VALUES (
        ${req.body.email},
        ${req.body.first_name},
        ${req.body.last_name},
        ${hashedPassword},
        ${req.body.role},
        ${avatarPath}
    )
`;
}catch(err){

        const error=  appError.create(
            err.message,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.INTERNAL_SERVER_ERROR
        )

    /*
    1- the file is already uploaded into the server 
    2- here the validation of the otp is faild so we deleted this file from the 
        server 
    */
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

        return next(error);
}





let userId = await sql.query`
    SELECT id 
    FROM USERS 
    WHERE email = ${req.body.email}
`;

const payload = { 
    email : req.body.email,
    first_name :req.body.first_name ,
    last_name : req.body.last_name,
    role : req.body.role,
    id : userId.recordset[0].id,
};

const accessToken =  generateJWT(payload);
const refreshToken = generateRefreshToken(payload);


await sql.query`
UPDATE USERS
SET refresh_token = ${refreshToken}
WHERE ID = ${userId.recordset[0].id}`;



//* delte the otp to garante that is won't use after this process
await sql.query`
        DELETE FROM OTP 
        WHERE ID = ${otpId}
`;

    res.json({
        status : utils.STATUS_TEXT.SUCCESS,
        data  :  {
            ...payload ,
            avatar : avatarPath
        },
        code  :  utils.HTTP_STATUS.CREATED  ,
        accessToken : accessToken ,
        refreshToken : refreshToken,
    })

})



module.exports = {
    refreshTokenHandler,
    login,
    registration,
    validateOTP
}