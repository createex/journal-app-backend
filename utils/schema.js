const yup = require("yup");

const userloginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const emailSchema = yup.object().shape({
  email: yup.string().required(),
});

const otpSchema = yup.object().shape({
  id: yup.string().required(),
  otp: yup.string().required(),
});

const usersignupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const changePassSchema = yup.object().shape({
  newPassword: yup.string().required(),
  currentPassword: yup.string().required(),
});

const newPassSchema = yup.object().shape({
  newPassword: yup.string().required(),
  otp: yup.string().required(),
});

const goalSchema = yup.object().shape({
  title: yup.string().required(),
  image: yup.string().required(),
});

const titleSchema = yup.object().shape({
  title: yup.string().required(),
});

const postSchema = yup.object().shape({
  userId: yup.string().required(),
  mood: yup.string().required(),
  activities: yup.array().required(),
  feelings: yup.array().required(),
  goalAchieve: yup.boolean().required(),
  dayDescription: yup.string().required(),
  note: yup.string().required(),
  tomorrowDescription: yup.string().required(),
});

const noteSchema = yup.object().shape({
  userId: yup.string().required(),
});

module.exports = {
  userloginSchema,
  usersignupSchema,
  changePassSchema,
  emailSchema,
  otpSchema,
  goalSchema,
  titleSchema,
  postSchema,
  noteSchema,
  newPassSchema,
};
