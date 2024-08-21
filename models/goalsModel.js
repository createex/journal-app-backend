const mongoose = require("mongoose");

const goalsSchema = new mongoose.Schema(
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

goalsSchema.virtual("path").get(function () {
  return `${process.env.BASE_IMAGE}${this.image}`;
});

const goalsModel = mongoose.model("goals", goalsSchema);
module.exports = goalsModel;
