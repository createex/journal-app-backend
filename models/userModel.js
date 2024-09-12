const mongoose = require("mongoose");
const argon = require("argon2");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: Number,
      default: 0,
    },
    passOtp: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: "NA",
    },
    age: {
      type: String,
      default: "NA",
    },
    goals: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "goals",
        },
      ],
      default: [],
    },
    elevates: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "elevates",
        },
      ],
      default: [],
    },
    motivations: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "motivations",
        },
      ],
      default: [],
    },
    growthTime: {
      type: String,
      default: "NA",
    },
    stayOnTrack: {
      type: Boolean,
      default: false,
    },
    personalGrowth: {
      type: Boolean,
      default: false,
    },
    movingForward: {
      type: Boolean,
      default: false,
    },
    lifeGoals: {
      type: String,
      default: "NA",
    },
    yearGoals: {
      type: String,
      default: "NA",
    },
    plan: {
      type: String,
      default: "NA",
    },
    block: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
  },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passOtp;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  try {
    const hash = await argon.hash(user.password);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (pass) {
  return await argon.verify(this.password, pass);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
