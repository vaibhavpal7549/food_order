

const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllMenus,
  createMenu,
  deleteMenu,
  addItemToMenu,
} = require("../controllers/menuController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

router
  .route("/")
  .get(getAllMenus)
  .post(protect, authorizeRoles("admin", "restaurant-owner"), createMenu);

// add food item to a specific menu (more specific, must come before /:menuId)
router
  .route("/:menuId/addItem")
  .patch(protect, authorizeRoles("admin", "restaurant-owner"), addItemToMenu);

router.route("/:menuId").delete(protect, authorizeRoles("admin", "restaurant-owner"), deleteMenu);

module.exports = router;
