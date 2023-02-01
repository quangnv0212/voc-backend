const express = require("express");
const {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  createUser,
  uploadUserPhoto,
} = require("../controllers/user.controller");

const env = require("dotenv");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logOut,
  updatePassword,
} = require("../controllers/auth.controller");
const { createReview } = require("../controllers/review.controller");
const protect = require("../middlewares/protect");
const getMe = require("../middlewares/getMe");
const restrictTo = require("../middlewares/restrictTo");
const multer = require("multer");
const upload = multer({ dest: "public/img/users" });

env.config();
const userRouter = express.Router();
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/logout", logOut);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this middleware
userRouter.use(protect);
userRouter.patch("/updateMyPassword", updatePassword);
userRouter.get("/me", getMe, getUser);
userRouter.patch("/updateMe", uploadUserPhoto, updateMe);
userRouter.delete("/deleteMe", deleteMe);

userRouter.use(restrictTo("admin"));

userRouter.get("/", getAllUser);
userRouter.post("/", createUser);

// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = {
  userRouter,
};
