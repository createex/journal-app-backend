const { elevatesCluster } = require("../models");
const { titleSchema } = require("../utils/schema");

const create = async (req, res) => {
  try {
    let body = await titleSchema.validate(req.body);
    let data = await elevatesCluster.create(body);
    return res.send({
      message: "Successfully Create",
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
    let data = await elevatesCluster.find();
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

const getById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await elevatesCluster.findOne({ _id: id });
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
    let data = await elevatesCluster.findByIdAndDelete(id);
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

const update = async (req, res) => {
  try {
    let id = req.params.id;
    let title = req.body.title;

    let json = {};

    if (title != null) {
      json["title"] = title;
    }

    let data = await elevatesCluster.findOneAndUpdate(
      { _id: id },
      {
        $set: json,
      },
      { returnOriginal: false }
    );

    return res.send({
      message: "Successfully Update",
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
  getById,
  deleteById,
  update,
};
