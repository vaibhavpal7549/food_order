const Restaurant = require("../models/restaurant");
const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Restaurant.find(), req.query)
    .search()
    .sort();
  const restaurants = await apiFeatures.query;
  res.status(200).json({
    status: "success",
    count: restaurants.length,
    restaurants: restaurants,
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    status: "success",
    data: restaurant,
  });
});

//Get restaurant by id
exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No Restaurant found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.storeId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(204).json({
    status: "success",
  });
});

// Create or update review for a restaurant (User must have placed an order)
exports.createRestaurantReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const storeId = req.params.storeId;

  if (!rating) {
    return next(new ErrorHandler("Please provide a rating", 400));
  }

  // Check if user has placed an order at this restaurant
  const hasOrdered = await Order.findOne({
    user: req.user._id,
    restaurant: storeId,
  });

  if (!hasOrdered) {
    return next(
      new ErrorHandler(
        "You can only rate and review a restaurant after placing an order from it.",
        403
      )
    );
  }

  const restaurant = await Restaurant.findById(storeId);

  if (!restaurant) {
    return next(new ErrorHandler("No Restaurant found with that ID", 404));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment || "",
  };

  const isReviewed = restaurant.reviews.find(
    (r) => r.user && r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    restaurant.reviews.forEach((r) => {
      if (r.user && r.user.toString() === req.user._id.toString()) {
        r.rating = Number(rating);
        r.comment = comment || "";
      }
    });
  } else {
    restaurant.reviews.push(review);
  }

  restaurant.numOfReviews = restaurant.reviews.length;
  restaurant.ratings =
    restaurant.reviews.reduce((acc, item) => item.rating + acc, 0) /
    restaurant.reviews.length;

  await restaurant.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Review submitted successfully",
    data: restaurant,
  });
});

