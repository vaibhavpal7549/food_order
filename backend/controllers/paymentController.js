const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const FoodItem = require("../models/foodItem");

// Stripe is configured via process.env loaded in server.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
  if (!rawItems.length) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  const line_items = [];
  for (const item of rawItems) {
    const foodItemId = item?.foodItem?._id || item?.foodItem;
    const quantity = Number(item?.quantity);

    if (!foodItemId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid cart item payload" });
    }

    const dbFoodItem = await FoodItem.findById(foodItemId).select("name price images stock");
    if (!dbFoodItem) {
      return res.status(404).json({ message: `Food item not found: ${foodItemId}` });
    }

    if (dbFoodItem.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${dbFoodItem.name}` });
    }

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: dbFoodItem.name,
          images: dbFoodItem.images?.[0]?.url ? [dbFoodItem.images[0].url] : [],
        },
        unit_amount: Math.round(Number(dbFoodItem.price) * 100),
      },
      quantity,
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: {
            amount: 5500, // Amount in paise (e.g., 5500 = 55 INR)
            currency: "inr",
          },
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 3,
            },
          },
        },
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });
  res.status(200).json({ url: session.url });
});



// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
