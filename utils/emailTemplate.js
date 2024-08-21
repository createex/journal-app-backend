const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "journal.app12@gmail.com",
    pass: "rxcw lwdh cdds oprt",
  },
});

const sendEmail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};

const otpEmail = (name, otp, title) => {
  return `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
            <tr>
                <td bgcolor="black" align="center" style="padding: 10px 0;">
                    <h1 style="color: #ffffff;">My Journal</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p>Hello ${name},</p>
                    <p style="padding-bottom: 20px;">Your have requested to ${title}.</p>
                    <h3>Your OTP is </h3>
                    <h4 style="color:green">${otp}</h4>
                    <p style="padding-bottom: 20px;">Please use this OTP to verify.</p>
                    <p>Thank you for choosing My Journal!</p>
                </td>
            </tr>
            <tr>
                <td bgcolor="black" align="center" style="padding: 20px 0;">
                    <p style="color: #ffffff; font-size: 15px;">© 2024 My Journal. All rights reserved.</p>
                </td>
            </tr>
        </table>
        </body>`;
};

module.exports = {
  sendEmail,
  otpEmail,
};
