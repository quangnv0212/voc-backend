const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const document = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const document = await query;
    if (document) {
      res.status(200).json({
        status: "success",
        data: {
          data: document,
        },
      });
    } else {
      return next(new AppError("No document found with that ID", 404));
    }
  });
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (!req.params.albumId) {
      filter = {
        album: req.params.albumId,
      };
    }
    //EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;
    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: document.length,
      data: {
        data: document,
      },
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
