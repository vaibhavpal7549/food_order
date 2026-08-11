const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const {
  generateFoodAI,
  generateAndSaveFoodAI,
  analyzeFoodReviewsAI,
  analyzeRestaurantReviewsAI,
  analyzeReviewsFromBodyAI,
} = require("../controllers/ai.controller");

// POST /api/v1/ai/generate-food-ai
// Used by Menu.jsx to AI-generate a dish description from name/category/price
router.post("/generate-food-ai", protect, generateFoodAI);

// POST /api/v1/ai/food/:foodId/generate-save
// Generate + persist AI description to the food item document
router.post("/food/:foodId/generate-save", protect, authorizeRoles("admin"), generateAndSaveFoodAI);

// GET /api/v1/ai/food/:foodId/analyze
// Analyze reviews for a specific food item
router.get("/food/:foodId/analyze", protect, analyzeFoodReviewsAI);

// PUT /api/v1/ai/admin/restaurants/:storeId/analyze
// Analyze reviews for a restaurant (used by restaurantActions.js)
router.put("/admin/restaurants/:storeId/analyze", protect, authorizeRoles("admin"), analyzeRestaurantReviewsAI);

// POST /api/v1/ai/analyze-reviews
// Analyze raw reviews array sent in request body
router.post("/analyze-reviews", protect, analyzeReviewsFromBodyAI);

module.exports = router;
