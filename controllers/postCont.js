const { postSchema } = require("../utils/schema");
const { postCluster } = require("../models");

const create = async (req, res) => {
  try {
    let body = await postSchema.validate(req.body);
    let data = await postCluster.create(body);
    return res.send({
      message: "Successfully, Create Post",
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

const getAll = async (req, res) => {
  try {
    let data = await postCluster
      .find()
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");
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
    let data = await postCluster
      .find({ userId: id })
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");
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
    let data = await postCluster
      .findOne({ _id: id })
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");
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
    let data = await postCluster.findByIdAndDelete(id);
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
