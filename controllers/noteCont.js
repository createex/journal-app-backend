const { uploadNote } = require("../utils/azureBlobNote");
const { noteSchema } = require("../utils/schema");
const { noteCluster } = require("../models");

const create = async (req, res) => {
  try {
    let noteFile = req.file;
    let bodyData = await noteSchema.validate(req.body);

    if (noteFile == null) {
      return res.send({
        message: "No Voice Note Found",
        result: false,
        data: bodyData,
      });
    }

    let path = await uploadNote(noteFile.path, noteFile.filename);

    if (path == "") {
      return res.send({
        message: "Unable to upload Voice Note, Please try again",
        result: false,
        data: "",
      });
    }

    let json = {
      note: path,
      userId: bodyData.userId,
    };

    let noteData = await noteCluster.create(json);

    return res.send({
      result: true,
      message: "Successfully Create",
      data: noteData,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: "",
    });
  }
};

const getAll = async (req, res) => {
  try {
    let data = await noteCluster.find().populate("userId");
    if (data.length === 0) {
      return res.send({
        message: "Not Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: [],
    });
  }
};

const getByUserId = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await noteCluster.find({ userId: id }).populate("userId");

    if (data.length == null) {
      return res.send({
        message: "Not Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: [],
    });
  }
};

const getById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await noteCluster.findOne({ _id: id }).populate("userId");

    if (data == null) {
      return res.send({
        message: "Not Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
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

const deleteById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await noteCluster.findByIdAndDelete(id);
    if (data == null) {
      return res.send({
        message: "Not Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Delete",
      result: true,
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

module.exports = {
  create,
  getAll,
  getByUserId,
  getById,
  deleteById,
};
