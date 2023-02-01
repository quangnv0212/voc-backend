const Album = require("../models/Album.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sharp = require("sharp");
const multer = require("multer");
const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/albums");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `artist-${req.body.artist}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiler,
});
const uploadAlbum = upload.single("image");
const resizeAlbumImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `album-${req.body.artist}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/albums/${req.file.filename}`);
  next();
});
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const createAlbum = createOne(Album);
const updateAlbum = updateOne(Album);
const deleteAlbum = deleteOne(Album);
const getAlbumDetail = getOne(Album, { path: "reviews" });
const getAlbum = getAll(Album);
module.exports = {
  getAlbum,
  getAlbumDetail,
  updateAlbum,
  createAlbum,
  deleteAlbum,
  uploadAlbum,
  resizeAlbumImage,
};
