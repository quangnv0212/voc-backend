const express = require("express");
const {
  getAlbum,
  getAlbumDetail,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadAlbum,
  resizeAlbumImage,
} = require("../controllers/album.controller");
const { reviewRouter } = require("./review.routers");
const albumRouter = express.Router();
albumRouter.use("/:albumId/reviews", reviewRouter);
albumRouter.post(
  "/",
  uploadAlbum,
  resizeAlbumImage,
  (req, res, next) => {
    if (req.file) {
      req.body.image = `http://localhost:3100/public/img/albums/${req.file.filename}`;
    }
    next();
  },
  createAlbum
);
albumRouter.get("/", getAlbum);
albumRouter.get("/:id", getAlbumDetail);
albumRouter.put("/:id", updateAlbum);
albumRouter.delete("/:id", deleteAlbum);

module.exports = {
  albumRouter,
};
