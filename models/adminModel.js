const mongoose = require("mongoose");
const argon = require("argon2");

const adminSchema = new mongoose.Schema(
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
    passOtp: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passOtp;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

adminSchema.pre("save", async function (next) {
  let admin = this;
  if (!admin.isModified("password")) return next();
  try {
    const hash = await argon.hash(admin.password);
    admin.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function (pass) {
  return await argon.verify(this.password, pass);
};

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
