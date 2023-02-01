const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error.controller");

const app = express();

app.use(cors());
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use("/public", express.static(path.join(__dirname, "./public")));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Set security HTTP headers
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

const { rootRouter } = require("./routes");

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
//Connect mongodb
mongoose.connection.syncIndexes();
mongoose.connect(process.env.MONGODB_URL, () => {
  try {
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
});

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Use Router
app.use("/api/v1", rootRouter);
// app.use(app.router);
// rootRouter.initialize(app);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

// Listen
app.listen(3100, () => {
  console.log("Server is running");
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
