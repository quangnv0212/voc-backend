const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

let albumSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "An album must have a name"],
      trim: true,
    },
    slug: String,
    artist: String,
    year: Number,
    genre: String,
    price: Number,
    color: String,
    record: String,
    era: String,
    vinylStatus: {
      type: String,
      required: [true, "An album must have status"],
      enum: {
        values: ["ex", "new"],
        message: "Status is either:ex or new",
      },
    },
    caseStatus: {
      type: String,
      required: [true, "An album must have status"],
      enum: {
        values: ["ex", "new"],
        message: "Status is either:ex or new",
      },
    },
    country: String,
    image: String,
    countInStock: Number,
    mood: {
      type: String,
      enum: {
        values: ["Chill", "Ngầu", "Rầu", "Gắt"],
        message: "Status is either:Chii or Ngầu or Rầu or Gắt",
      },
    },
    hot: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// albumSchema.virtual("slug").get(function () {
//   slugify(this.name).toLowerCase();
// });

//document middleware: runs before .save() add .create() but not trigger .insertMany

albumSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "album",
  localField: "_id",
});

// albumSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "artist",
//     select: "-image -__v ",
//   });
//   next();
// });
albumSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
albumSchema.pre("save", function (next) {
  if (this.year && this.year >= 1950 && this.year < 1960) {
    this.era = "50s";
  }
  if (this.year && this.year >= 1960 && this.year < 1970) {
    this.era = "60s";
  }
  if (this.year && this.year >= 1970 && this.year < 1980) {
    this.era = "70s";
  }
  if (this.year && this.year >= 1980 && this.year < 1990) {
    this.era = "80s";
  }
  if (this.year && this.year >= 1990 && this.year < 2000) {
    this.era = "90s";
  }
  if (this.year && this.year >= 2000) {
    this.era = "00s";
  }
  next();
});

// albumSchema.pre("save", function (next) {
//   console.log("Will save document");
//   next();
// });

//post middleware runs after all mdw fnc have completed
// albumSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

// albumSchema.pre(/^find/, function (next) {
//   //this ở đây là query vì đây là query middleware
//   this.find({ hot: { $ne: true } });
//   this.start = Date.now();
//   next();
// });
// albumSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start}`);
//   next();
// });
// AGGREGATION MIDDLEWARE
// albumSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({
//     $match: { hot: { $ne: true } },
//   });
//   next();
// });
module.exports = mongoose.model("Album", albumSchema);
