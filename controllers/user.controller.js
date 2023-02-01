const multer = require("multer");
const User = require("../models/User.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");
const filterObj = require("../utils/filterObj");
const getUser = getOne(User);
const getAllUser = getAll(User);
const updateUser = updateOne(User);
const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiler,
});
const uploadUserPhoto = upload.single("photo");

const deleteUser = deleteOne(User);
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please sign up",
  });
};
const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
module.exports = {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  createUser,
  uploadUserPhoto,
};
