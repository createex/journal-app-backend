const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    mood: {
      type: mongoose.Types.ObjectId,
      ref: "moods",
    },
    activities: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "activities",
        },
      ],
      default: [],
    },
    feelings: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "feelings",
        },
      ],
      default: [],
    },
    goalAchieve: {
      type: Boolean,
      default: false,
    },
    note: {
      type: mongoose.Types.ObjectId,
      ref: "note",
    },
    dayDescription: {
      type: String,
      default: "NA",
    },
    tomorrowDescription: {
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

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
