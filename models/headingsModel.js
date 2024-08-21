const mongoose = require("mongoose");

const headingsSchema = new mongoose.Schema(
  {
    goal: {
      type: String,
      default: "NA",
    },
    elevate: {
      type: String,
      default: "NA",
    },
    motivation: {
      type: String,
      default: "NA",
    },
    activity: {
      type: String,
      default: "NA",
    },
    feeling: {
      type: String,
      default: "NA",
    },
    mood: {
      type: String,
      default: "NA",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const headingsModel = mongoose.model("headings", headingsSchema);
module.exports = headingsModel;
