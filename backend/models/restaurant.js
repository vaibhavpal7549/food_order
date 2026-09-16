const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the restaurant name"],
    trim: true,
    maxLength: [100, "Restaurant name cannot exceed 100 characters"],
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Please enter the restaurant address"],
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [82.68, 25.75],
    },
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  //images are array of an object and each object contains two things, 1. id of that img and 2. url of that img.
  images: [
    {
      public_id: {
        type: String,
        default: "default",
      },
      url: {
        type: String,
        default: "/images/images.png",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ address: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
