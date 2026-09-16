const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getFoodItem,
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
} = require("../controllers/foodItemController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
router.route("/item").post(protect, authorizeRoles("admin", "restaurant-owner"), createFoodItem);

router.route("/items/:storeId").get(getAllFoodItems);
router
  .route("/item/:foodId")
  .get(getFoodItem)
  .patch(protect, authorizeRoles("admin", "restaurant-owner"), updateFoodItem)
  .delete(protect, authorizeRoles("admin", "restaurant-owner"), deleteFoodItem);

module.exports = router;
