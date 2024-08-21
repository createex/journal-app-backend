const { moodsCluster } = require("../models");
const { uploadImage } = require("../utils/azureBlobStorage");
const { titleSchema } = require("../utils/schema");

const create = async (req, res) => {
  try {
    let body = await titleSchema.validate(req.body);
    let image = req.file;

    if (image == null) {
      return res.send({
        message: "No Image Found",
        result: true,
        data: {},
      });
    }

    let path = await uploadImage(image.path, image.filename);

    if (path == "") {
      return res.send({
        message: "Unable to upload image, Please try again",
        result: true,
        data: {},
      });
    }

    let json = {
      title: body.title,
      image: path,
    };

    let data = await moodsCluster.create(json);
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
    let data = await moodsCluster.find();
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
    let data = await moodsCluster.findOne({ _id: id });
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
    let data = await moodsCluster.findByIdAndDelete(id);
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
    let image = req.file;

    let json = {};

    if (image != null) {
      let path = await uploadImage(image.path, image.filename);
      if (path != "") {
        json["image"] = path;
      }
    }

    if (title != null) {
      json["title"] = title;
    }

    let data = await moodsCluster.findOneAndUpdate(
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
