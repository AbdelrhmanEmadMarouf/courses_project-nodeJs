// const nodemailer = require("nodemailer");


// module.exports = async(newUser)=>{


// const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
// });


// const otp = Math.floor(100000 + Math.random() * 900000);


// await transporter.sendMail({
//     from: `"Courses Platform" <${process.env.SMTP_USER}>`,
//     to: newUser.email,
//     subject: "Verify Your Email - Courses Platform",
//     text: `
// Hello ${newUser.first_name || ''},

// Welcome to our Courses Platform 🎓

// We're excited to have you! To complete your registration, please verify your email using the OTP below:

// Your OTP: ${otp}

// This code will expire in 5 minutes.

// If you didn’t request this, please ignore this email.

// Best regards,
// Courses Platform Team
//     `,
//     html: `
//     <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
//         <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
            
//             <h2 style="color: #333;">Welcome to Courses Platform 🎓</h2>
            
//             <p style="color: #555; font-size: 15px;">
//                 Hi ${newUser.first_name || 'there'}, <br><br>
//                 We're excited to have you join our platform! 🚀<br>
//                 To complete your registration, please verify your email address.
//             </p>

//             <p style="margin-top: 20px; color: #777;">
//                 Use the OTP below:
//             </p>

//             <div style="
//                 font-size: 28px;
//                 font-weight: bold;
//                 letter-spacing: 5px;
//                 color: #2c7be5;
//                 background: #eef4ff;
//                 padding: 15px;
//                 border-radius: 8px;
//                 margin: 20px 0;
//                 display: inline-block;
//             ">
//                 ${otp}
//             </div>

//             <p style="color: #999; font-size: 13px;">
//                 This code will expire in 5 minutes.
//             </p>

//             <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

//             <p style="color: #aaa; font-size: 12px;">
//                 If you did not request this email, you can safely ignore it.
//             </p>

//         </div>
//     </div>
//     `
// });


// return otp;

// }
const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

module.exports = async (newUser) => {

  const otp = Math.floor(100000 + Math.random() * 900000);

  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "Courses Platform",
      email: process.env.SMTP_USER, // حط هنا الإيميل بتاعك (مثلاً Gmail)
    },
    to: [
      {
        email: newUser.email,
        name: newUser.first_name || "User",
      }
    ],
    subject: "Verify Your Email - Courses Platform",
    textContent: `
Hello ${newUser.first_name || ''},

Welcome to our Courses Platform 🎓

We're excited to have you! To complete your registration, please verify your email using the OTP below:

Your OTP: ${otp}

This code will expire in 5 minutes.

If you didn’t request this, please ignore this email.

Best regards,
Courses Platform Team
    `,
    htmlContent: `
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

  return otp;
};