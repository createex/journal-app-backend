const mongoose = require("mongoose");

const elevatesSchema = new mongoose.Schema(
  {
    title: {
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

const elevatesModel = mongoose.model("elevates", elevatesSchema);
module.exports = elevatesModel;
