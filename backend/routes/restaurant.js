const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
} = require("../controllers/restaurantController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

const menuRoutes = require("./menu");

router
  .route("/")
  .get(getAllRestaurants)
  .post(protect, authorizeRoles("admin", "restaurant-owner"), createRestaurant);

router
  .route("/:storeId")
  .get(getRestaurant)
  .patch(protect, authorizeRoles("admin", "restaurant-owner"), updateRestaurant)
  .delete(protect, authorizeRoles("admin", "restaurant-owner"), deleteRestaurant);

router.route("/:storeId/review").put(protect, createRestaurantReview);

router.use("/:storeId/menus", menuRoutes);

module.exports = router;

