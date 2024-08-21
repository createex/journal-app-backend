const argon = require("argon2");
const { otp } = require("../utils/otpGenrator");
const { sendEmail, otpEmail } = require("../utils/emailTemplate");
const { userCluster, adminCluster } = require("../models");
const {
  usersignupSchema,
  userloginSchema,
  changePassSchema,
  newPassSchema,
  emailSchema,
  otpSchema,
} = require("../utils/schema");

const register = async (req, res) => {
  try {
    let user = await usersignupSchema.validate(req.body);

    let checkUser = await userCluster.findOne({ email: user.email });
    if (checkUser !== null) {
      return res.send({
        message: "User already registered against this email.",
        result: false,
        data: {},
      });
    }

    let checkAdmin = await adminCluster.findOne({ email: user.email });
    if (checkAdmin !== null) {
      return res.send({
        message: "User already registered against this email.",
        result: false,
        data: {},
      });
    }

    let data = await userCluster.create(user);
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
    let user = await userloginSchema.validate(req.body);

    let userData = await userCluster.findOne({ email: user.email });
    if (userData == null) {
      return res.send({
        message: "Incorrect Email",
        result: false,
        data: {},
      });
    }

    let checkPass = await userData.comparePassword(user.password);
    if (!checkPass) {
      return res.send({
        message: "Incorrect Password",
        result: false,
        data: {},
      });
    }

    if (userData.verified == false) {
      return res.send({
        message: "Email is not verified",
        result: false,
        data: userData,
      });
    }

    return res.send({
      message: "Successfully Login",
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

const changePassword = async (req, res) => {
  try {
    let id = req.params.id;

    let body = await changePassSchema.validate(req.body);

    let user = await userCluster.findOne({ _id: id });
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let checkPass = await user.comparePassword(body.currentPassword);
    if (!checkPass) {
      return res.send({
        message: "Incorrect Current Password",
        result: false,
        data: {},
      });
    }

    const passwordHash = await argon.hash(body.newPassword);

    let userData = await userCluster.findOneAndUpdate(
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

const forgetPassword = async (req, res) => {
  try {
    let body = await emailSchema.validate(req.body);

    let otpVal = otp();

    let userData = await userCluster.findOneAndUpdate(
      { email: body.email },
      {
        $set: {
          passOtp: otpVal,
        },
      },
      { returnOriginal: false }
    );

    if (userData == null) {
      return res.send({
        message: "Incorrect Email",
        result: false,
        data: {},
      });
    }

    let verifyTitle = "reset your account password";

    let emailBody = otpEmail(userData.name, otpVal, verifyTitle);

    let mailOptions = {
      from: `My Journal App <${process.env.MAIL_USERNAME}>`,
      to: userData.email,
      subject: "Forget Password - My Journal App",
      html: emailBody,
    };

    await sendEmail(mailOptions);

    return res.send({
      message: "Successfully Send Email",
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

const newPassword = async (req, res) => {
  try {
    let id = req.params.id;
    let body = await newPassSchema.validate(req.body);

    let user = await userCluster.findOne({ _id: id });
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let checkOtp = user.passOtp == Number(body.otp);
    if (!checkOtp) {
      return res.send({
        message: "Incorrect OTP",
        result: false,
        data: {},
      });
    }

    const passwordHash = await argon.hash(body.newPassword);

    let userData = await userCluster.findOneAndUpdate(
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

const verifyEmail = async (req, res) => {
  try {
    let body = await emailSchema.validate(req.body);

    let otpVal = otp();

    let userData = await userCluster.findOneAndUpdate(
      { email: body.email },
      {
        $set: {
          emailOtp: otpVal,
        },
      },
      { returnOriginal: false }
    );

    if (userData == null) {
      return res.send({
        message: "Incorrect Email",
        result: false,
        data: {},
      });
    }

    let verifyTitle = "verify your email";
    let emailBody = otpEmail(userData.name, otpVal, verifyTitle);

    let mailOptions = {
      from: `My Journal App <${process.env.MAIL_USERNAME}>`,
      to: userData.email,
      subject: "Email Verify - My Journal App",
      html: emailBody,
    };

    await sendEmail(mailOptions);

    return res.send({
      message: "Successfully Send Email",
      result: true,
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    let body = await otpSchema.validate(req.body);

    let user = await userCluster.findOne({ _id: body.id });
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let checkOtp = user.emailOtp == Number(body.otp);
    if (!checkOtp) {
      return res.send({
        message: "Incorrect Otp",
        result: false,
        data: {},
      });
    }

    let userData = await userCluster.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          verified: true,
        },
      },
      { returnOriginal: false }
    );

    return res.send({
      message: "Successfully Verify Otp",
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

    let user = await userCluster.findOne({ _id: body.id });
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let checkOtp = user.passOtp == Number(body.otp);
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
      data: user,
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
  login,
  register,
  changePassword,
  forgetPassword,
  newPassword,
  verifyEmail,
  verifyEmailOtp,
  verifyPasswordOtp,
};
