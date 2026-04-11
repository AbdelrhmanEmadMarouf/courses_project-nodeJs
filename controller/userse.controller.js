const {sql} = require('../confiq/DB'); 
const utils = require('../utils/utils');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');
const  validator = require('validator');
const nodemailer = require("nodemailer");

const createUser = asyncWrapper(async(req,res,next)=>{

    const newUser = req.body;

    if(!validator.isEmail(newUser.email)){

                    const error=  appError.create(
                        utils.MESSAGES.WRONG_EMAIL_FORMAT,
                        utils.STATUS_TEXT.FAIL,
                        utils.HTTP_STATUS.BAD_REQUEST
                    )
                    return next(error);
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
});

const otp = Math.floor(100000 + Math.random() * 900000);



await transporter.sendMail({
    from: `"Courses Platform" <${process.env.SMTP_USER}>`,
    to: newUser.email,
    subject: "Verify Your Email - Courses Platform",
    text: `
Hello ${newUser.first_name || ''},

Welcome to our Courses Platform 🎓

We're excited to have you! To complete your registration, please verify your email using the OTP below:

Your OTP: ${otp}

This code will expire in 5 minutes.

If you didn’t request this, please ignore this email.

Best regards,
Courses Platform Team
    `,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
            
            <h2 style="color: #333;">Welcome to Courses Platform 🎓</h2>
            
            <p style="color: #555; font-size: 15px;">
                Hi ${newUser.first_name || 'there'}, <br><br>
                We're excited to have you join our platform! 🚀<br>
                To complete your registration, please verify your email address.
            </p>

            <p style="margin-top: 20px; color: #777;">
                Use the OTP below:
            </p>

            <div style="
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #2c7be5;
                background: #eef4ff;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                display: inline-block;
            ">
                ${otp}
            </div>

            <p style="color: #999; font-size: 13px;">
                This code will expire in 5 minutes.
            </p>

            <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

            <p style="color: #aaa; font-size: 12px;">
                If you did not request this email, you can safely ignore it.
            </p>

        </div>
    </div>
    `
});



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

    const id = req.body.id; 
    const otp = req.body.otp; 

    const result = await sql.query`
        SELECT * FROM OTP
        WHERE id = ${id} AND OTP = ${otp}
    `;


    if(result.recordset.length === 0){

        const error=  appError.create(
            utils.MESSAGES.WROG_OTP_VALIDATION,
            utils.STATUS_TEXT.FAIL,
            utils.HTTP_STATUS.NOT_FOUND
        )

        return next(error);

    }

await sql.query`
    INSERT INTO USERS(email, first_name, last_name, password)
    VALUES (
        ${req.body.email},
        ${req.body.first_name},
        ${req.body.last_name},
        ${req.body.password}
    )
`;


//* delte the otp to garante that is won't use after this process
await sql.query`
        DELETE FROM OTP 
        WHERE ID = ${id}
`;
    

    const userData = {
        email : req.body.email ,
        first_name :req.body.first_name ,
        last_name : req.body.last_name,
        password :req.body.password
    };

    res.json({
        status : utils.STATUS_TEXT.SUCCESS,
        data :  userData,
        code :  utils.HTTP_STATUS.CREATED  
    })

})



module.exports = {
    createUser,
    validateOTP
}