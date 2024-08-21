const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
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

noteSchema.virtual("path").get(function () {
  return `${process.env.BASE_IMAGE}${this.note}`;
});

const noteModel = mongoose.model("note", noteSchema);
module.exports = noteModel;
