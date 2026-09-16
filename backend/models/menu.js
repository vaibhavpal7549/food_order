const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    menu: [
      {
        category: { type: String },
        items: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodItem",
          },
        ],
      },
    ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID is required for a menu"],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
