const Review = require("../models/Review.model");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const setTourUserIds = (req, res, next) => {
  if (!req.body.album) {
    req.body.album = req.params.albumId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};
const createReview = createOne(Review);
const getAllReviews = getAll(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);
const getReview = getOne(Review);
module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
};
