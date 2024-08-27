const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  authUserRoute,
  authAdminRoute,
  userRoute,
  adminRoute,
  goalsRoute,
  motivationsRoute,
  activitiesRoute,
  feelingsRoute,
  moodsRoute,
  postRoute,
  noteRoute,
  elevatesRoute,
  headingsRoute,
  statRoute,
} = require("./routes");

dotenv.config();

require("./configs/mongoConfig");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use("/api/user/auth/", authUserRoute);
app.use("/api/user/", userRoute);
app.use("/api/admin/auth/", authAdminRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/goals/", goalsRoute);
app.use("/api/motivations/", motivationsRoute);
app.use("/api/activities/", activitiesRoute);
app.use("/api/feelings/", feelingsRoute);
app.use("/api/moods/", moodsRoute);
app.use("/api/post/", postRoute);
app.use("/api/note/", noteRoute);
app.use("/api/elevates/", elevatesRoute);
app.use("/api/headings/", headingsRoute);
app.use("/api/stats/", statRoute);

app.get("/", (req, res) => {
  res.json("Welcome to My Journal Server");
});

app.get("/api", (req, res) => {
  res.json("My Journal Api Version : 1.0.0");
});

app.listen(PORT, function () {
  console.log("Server On Port " + PORT);
});
