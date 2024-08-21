const argon = require("argon2");
const { otp } = require("../utils/otpGenrator");
const { sendEmail, otpEmail } = require("../utils/emailTemplate");
const { userCluster, adminCluster } = require("../models");
const {
  usersignupSchema,
  userloginSchema,
  changePassSchema,
  emailSchema,
  otpSchema,
  newPassSchema,
} = require("../utils/schema");

const register = async (req, res) => {
  try {
    let body = await usersignupSchema.validate(req.body);

    let checkUser = await userCluster.findOne({ email: body.email });
    if (checkUser !== null) {
      return res.send({
        message: "Already registered against this email.",
        result: false,
        data: {},
      });
    }

    let checkAdmin = await adminCluster.findOne({ email: body.email });
    if (checkAdmin !== null) {
      return res.send({
        message: "Already registered against this email.",
        result: false,
        data: {},
      });
    }

    let data = await adminCluster.create(body);
    return res.send({
      result: true,
      message: "Successfully, Register your account.",
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const login = async (req, res) => {
  try {
    let body = await userloginSchema.validate(req.body);

    let adminData = await adminCluster.findOne({ email: body.email });
    if (adminData == null) {
      return res.send({
        message: "Incorrect Email",
        result: false,
        data: {},
      });
    }

    let checkPass = await adminData.comparePassword(body.password);
    if (!checkPass) {
      return res.send({
        message: "Incorrect Password",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Login",
      result: true,
      data: adminData,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const changePassword = async (req, res) => {
  try {
    let id = req.params.id;

    let body = await changePassSchema.validate(req.body);

    let admin = await adminCluster.findOne({ _id: id });
    if (admin == null) {
      return res.send({
        message: "No Admin Found",
        result: false,
        data: {},
      });
    }

    let checkPass = await admin.comparePassword(body.currentPassword);
    if (!checkPass) {
      return res.send({
        message: "Incorrect Current Password",
        result: false,
        data: {},
      });
    }

    const passwordHash = await argon.hash(body.newPassword);

    let adminData = await adminCluster.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: passwordHash,
        },
      },
      { returnOriginal: false }
    );

    return res.send({
      message: "Successfully Update Password",
      result: true,
      data: adminData,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    let body = await emailSchema.validate(req.body);

    let otpVal = otp();

    let admin = await adminCluster.findOneAndUpdate(
      { email: body.email },
      {
        $set: {
          passOtp: otpVal,
        },
      },
      { returnOriginal: false }
    );

    if (admin == null) {
      return res.send({
        message: "Incorrect Email",
        result: false,
        data: {},
      });
    }

    let emailBody = otpEmail(admin.name, otpVal);

    let mailOptions = {
      from: `My Journal App <${process.env.MAIL_USERNAME}>`,
      to: admin.email,
      subject: "Forget Password - My Journal App",
      html: emailBody,
    };

    await sendEmail(mailOptions);

    return res.send({
      message: "Successfully Send Email",
      result: true,
      data: admin,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const newPassword = async (req, res) => {
  try {
    let id = req.params.id;
    let body = await newPassSchema.validate(req.body);

    let admin = await adminCluster.findOne({ _id: id });
    if (admin == null) {
      return res.send({
        message: "No Admin Found",
        result: false,
        data: {},
      });
    }

    let checkOtp = admin.passOtp == Number(body.otp);
    if (!checkOtp) {
      return res.send({
        message: "Incorrect OTP",
        result: false,
        data: {},
      });
    }

    const passwordHash = await argon.hash(body.newPassword);
    let userData = await adminCluster.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: passwordHash,
        },
      },
      { returnOriginal: false }
    );

    return res.send({
      message: "Successfully Create New Password",
      result: true,
      data: userData,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    let body = await otpSchema.validate(req.body);

    let admin = await adminCluster.findOne({ _id: body.id });
    if (admin == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let checkOtp = admin.passOtp == Number(body.otp);
    if (!checkOtp) {
      return res.send({
        message: "Incorrect Otp",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Verify Otp",
      result: true,
      data: admin,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forgetPassword,
  newPassword,
  verifyPasswordOtp,
};
