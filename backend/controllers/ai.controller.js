const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const aiService = require("../services/ai.service");
const { analyzeReviewsWithAI } = require("../services/aiReviewAnalyzer");
const FoodItem = require("../models/foodItem");
const Restaurant = require("../models/restaurant");

exports.generateFoodAI = catchAsyncErrors(async (req, res, next) => {
  const { name, category, spiceLevel, price } = req.body;

  if (!name || !category || !spiceLevel || price === undefined) {
    return next(
      new ErrorHandler("name, category, spiceLevel and price are required", 400)
    );
  }

  const aiData = await aiService.generateDishDescription({
    name,
    category,
    spiceLevel,
    price,
  });

  return res.status(200).json({
    success: true,
    data: aiData,
  });
});

exports.generateAndSaveFoodAI = catchAsyncErrors(async (req, res, next) => {
  const { foodId } = req.params;

  const food = await FoodItem.findById(foodId);

  if (!food) {
    return next(new ErrorHandler("Food item not found", 404));
  }

  const aiData = await aiService.generateDishDescription({
    name: food.name,
    category: food.category || "Veg",
    spiceLevel: food.spiceLevel || "Medium",
    price: food.price,
  });

  food.aiDescription = aiData.description;
  food.aiTags = aiData.tags;
  food.aiAllergens = aiData.allergens;

  await food.save();

  return res.status(200).json({
    success: true,
    data: food,
  });
});

exports.analyzeFoodReviewsAI = catchAsyncErrors(async (req, res, next) => {
  const { foodId } = req.params;

  const food = await FoodItem.findById(foodId).select("name reviews");

  if (!food) {
    return next(new ErrorHandler("Food item not found", 404));
  }

  const analysis = await analyzeReviewsWithAI(food.reviews || []);

  return res.status(200).json({
    success: true,
    data: {
      itemType: "food",
      itemId: food._id,
      itemName: food.name,
      totalReviews: Array.isArray(food.reviews) ? food.reviews.length : 0,
      analysis,
    },
  });
});

exports.analyzeRestaurantReviewsAI = catchAsyncErrors(
  async (req, res, next) => {
    const { storeId } = req.params;

    const restaurant = await Restaurant.findById(storeId).select("name reviews");

    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }

    const analysis = await analyzeReviewsWithAI(restaurant.reviews || []);

    return res.status(200).json({
      success: true,
      data: {
        itemType: "restaurant",
        itemId: restaurant._id,
        itemName: restaurant.name,
        totalReviews: Array.isArray(restaurant.reviews)
          ? restaurant.reviews.length
          : 0,
        analysis,
      },
    });
  }
);

exports.analyzeReviewsFromBodyAI = catchAsyncErrors(async (req, res, next) => {
  const { reviews } = req.body;

  if (!Array.isArray(reviews)) {
    return next(new ErrorHandler("reviews must be an array", 400));
  }

  const analysis = await analyzeReviewsWithAI(reviews);

  return res.status(200).json({
    success: true,
    data: analysis,
  });
});
