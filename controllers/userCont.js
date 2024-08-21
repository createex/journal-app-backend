const { userCluster, postCluster, noteCluster } = require("../models");

const getAll = async (req, res) => {
  try {
    let users = await userCluster
      .find()
      .populate("goals")
      .populate("elevates")
      .populate("motivations");

    if (users.length === 0) {
      return res.send({
        message: "No User Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully, Find  Users",
      result: true,
      data: users,
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
    let user = await userCluster
      .findOne({ _id: id })
      .populate("goals")
      .populate("elevates")
      .populate("motivations");
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Find  User",
      result: true,
      data: user,
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
    let user = await userCluster.findOneAndUpdate(
      { _id: id },
      {
        $set: body,
      },
      { returnOriginal: false }
    );

    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Update User",
      result: true,
      data: user,
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

    await postCluster.deleteMany({ userId: id });
    await noteCluster.deleteMany({ userId: id });

    let user = await userCluster.findByIdAndDelete(id);

    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Delete User",
      result: true,
      data: user,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const checkById = async (req, res) => {
  try {
    let id = req.params.id;
    let user = await userCluster.findOne({ _id: id });

    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    if (user.verified == false) {
      return res.send({
        message: "User Is Not Verified",
        result: false,
        data: user,
      });
    }

    if (user.block) {
      return res.send({
        message: "User Is Blocked",
        result: false,
        data: user,
      });
    }

    return res.send({
      message: "Successfully, Find User",
      result: true,
      data: user,
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
  deleteById,
  checkById,
};
