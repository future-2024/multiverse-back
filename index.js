require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userRouter = require("./api/users/user.router");
const eowlRouter = require("./api/eowl/eowl.router");

const fileRouter = require("./api/file/file.router");

const clusters = require("cluster");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
); // include before other routes
//app.use(express.static(path.join(__dirname, "./client/out")))

app.use("/api/users", userRouter);

app.use("/api/eowl", eowlRouter);

app.use("/api/files", fileRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Metaverse API");
});

// 404 route.
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// error handler
const errorHandler = require("./api/error/handleError");
app.use(errorHandler);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
clusters.on("death", function (worker) {
  app.listen(3000);
});
