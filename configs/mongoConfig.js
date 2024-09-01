const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = process.env.MONGODB_URL;

mongoose
  .connect(dbURI)
  .then((result) => console.log(`DataBase Connected Successfully.`))
  .catch((error) => console.log(`Error: ${error}`));
