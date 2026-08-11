const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

router.route("/new").post(authController.protect, newOrder);

// IMPORTANT: /me/myOrders must come BEFORE /:id to prevent Express
// matching "me" as a dynamic :id parameter (which causes CastError).
router.route("/me/myOrders").get(authController.protect, myOrders);
router.route("/admin/orders").get(authController.protect, authorizeRoles("admin"), allOrders);
router.route("/:id").get(authController.protect, getSingleOrder);

module.exports = router;

