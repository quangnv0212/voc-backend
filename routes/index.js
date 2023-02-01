const express = require("express");
const { albumRouter } = require("./album.routers");
const { reviewRouter } = require("./review.routers");
const { userRouter } = require("./user.routers");
const rootRouter = express.Router();

rootRouter.use("/album", albumRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/review", reviewRouter);
module.exports = {
  rootRouter,
};
