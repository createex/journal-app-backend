const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "audio/mpeg",
    "audio/x-aac",
    "application/octet-stream",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadNote = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50000000,
  },
});

module.exports = { uploadNote };
