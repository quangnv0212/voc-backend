const express = require("express");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require("../controllers/review.controller");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");
const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.post(
  "/",
  protect,
  restrictTo("user"),
  setTourUserIds,
  createReview
);
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getReview);
reviewRouter.patch("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);

module.exports = {
  reviewRouter,
};
