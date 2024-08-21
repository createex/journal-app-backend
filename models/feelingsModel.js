const mongoose = require("mongoose");

const feelingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
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

feelingsSchema.virtual("path").get(function () {
  return `${process.env.BASE_IMAGE}${this.image}`;
});

const feelingsModel = mongoose.model("feelings", feelingsSchema);
module.exports = feelingsModel;
