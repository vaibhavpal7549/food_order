const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");

router.route("/new").post(authController.protect, newOrder);

// IMPORTANT: /me/myOrders must come BEFORE /:id to prevent Express
// matching "me" as a dynamic :id parameter (which causes CastError).
router.route("/me/myOrders").get(authController.protect, myOrders);
router.route("/:id").get(authController.protect, getSingleOrder);

module.exports = router;
