const { headingsCluster } = require("../models");

const create = async (req, res) => {
  try {
    let json = req.body;

    let allList = await headingsCluster.find();
    if (allList.length != 0) {
      return res.send({
        message: "The document is already created. Only access it to update.",
        result: false,
        data: allList[0],
      });
    }

    let data = await headingsCluster.create(json);
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

const updateByValue = async (req, res) => {
  try {
    let body = req.body;

    let allList = await headingsCluster.find();
    if (allList.length == 0) {
      return res.send({
        message: "No Document Found",
        result: false,
        data: {},
      });
    }

    let doc = allList[0];

    let data = await headingsCluster.findOneAndUpdate(
      { _id: doc._id },
      {
        $set: body,
      },
      { returnOriginal: false }
    );

    return res.send({
      message: "Successfully, Update Headings",
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

const getValue = async (req, res) => {
  try {
    let allList = await headingsCluster.find();
    if (allList.length == 0) {
      return res.send({
        message: "No Document Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully, Found Document",
      result: true,
      data: allList[0],
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
  updateByValue,
  getValue,
};
