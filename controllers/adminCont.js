const { adminCluster } = require("../models");

const getAll = async (req, res) => {
  try {
    let admins = await adminCluster.find();
    if (admins.length === 0) {
      return res.send({
        message: "No Admin Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully, Find  Admins",
      result: true,
      data: admins,
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
    let admin = await adminCluster.findOne({ _id: id });
    if (admin == null) {
      return res.send({
        message: "No Admin Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Find  Admin",
      result: true,
      data: admin,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const updateById = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let admin = await adminCluster.findOneAndUpdate(
      { _id: id },
      {
        $set: body,
      },
      { returnOriginal: false }
    );

    if (admin == null) {
      return res.send({
        message: "No Admin Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Update Admin",
      result: true,
      data: admin,
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
  getAll,
  getById,
  updateById,
};
