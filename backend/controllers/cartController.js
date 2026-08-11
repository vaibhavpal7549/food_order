const Cart = require("../models/cartModel");
const FoodItem = require("../models/foodItem");
const Restaurant = require("../models/restaurant");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

const addItemToCart = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { foodItemId, restaurantId, quantity } = req.body;

  if (!foodItemId || !restaurantId) {
    return next(new ErrorHandler("foodItemId and restaurantId are required", 400));
  }

  const numericQty = Number(quantity);
  if (!Number.isInteger(numericQty) || numericQty < 1) {
    return next(new ErrorHandler("quantity must be a positive integer", 400));
  }

  const foodItem = await FoodItem.findById(foodItemId);
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found", 404));
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    if (cart.restaurant.toString() !== restaurantId) {
      await Cart.deleteOne({ _id: cart._id });
      cart = new Cart({
        user: userId,
        restaurant: restaurantId,
        items: [{ foodItem: foodItemId, quantity: numericQty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.foodItem.toString() === foodItemId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += numericQty;
      } else {
        cart.items.push({ foodItem: foodItemId, quantity: numericQty });
      }
    }
  } else {
    cart = new Cart({
      user: userId,
      restaurant: restaurantId,
      items: [{ foodItem: foodItemId, quantity: numericQty }],
    });
  }

  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.foodItem",
      select: "name price images stock",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  res.status(200).json({ message: "Cart updated", cart: updatedCart });
});

// Update Cart
const updateCartItemQuantity = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { foodItemId, quantity } = req.body;

  const numericQty = Number(quantity);
  if (!foodItemId || !Number.isInteger(numericQty) || numericQty < 1) {
    return next(new ErrorHandler("foodItemId and a positive integer quantity are required", 400));
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.foodItem.toString() === foodItemId
  );
  if (itemIndex === -1) {
    return next(new ErrorHandler("Food item not found in cart", 404));
  }

  cart.items[itemIndex].quantity = numericQty;
  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.foodItem",
      select: "name price images stock",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  res.status(200).json({ message: "Cart item quantity updated", cart: updatedCart });
});

// Delete cart item
const deleteCartItem = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { foodItemId } = req.body;

  if (!foodItemId) {
    return next(new ErrorHandler("foodItemId is required", 400));
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.foodItem.toString() === foodItemId
  );
  if (itemIndex === -1) {
    return next(new ErrorHandler("Food item not found in cart", 404));
  }

  cart.items.splice(itemIndex, 1);

  if (cart.items.length === 0) {
    await Cart.deleteOne({ _id: cart._id });
    return res.status(200).json({ message: "Cart deleted" });
  } else {
    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.foodItem",
        select: "name price images stock",
      })
      .populate({
        path: "restaurant",
        select: "name",
      });

    res.status(200).json({ message: "Cart item deleted", cart: updatedCart });
  }
});

// Fetch cart Item
const getCartItem = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.foodItem",
      select: "name price images stock",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  if (!cart) {
    return next(new ErrorHandler("No cart found", 404));
  } else {
    return res.status(200).json({ status: "success", data: cart });
  }
});

module.exports = {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItem,
};
