const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/config.env" });
const connectDB = require("../db");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const FoodItem = require("../models/foodItem");

const sampleRestaurants = [
  {
    name: "Zyka Restaurant",
    isVeg: false,
    address: "123 Main Street, Downtown",
    ratings: 4.8,
    numOfReviews: 124,
    location: { type: "Point", coordinates: [-73.935242, 40.73061] },
    images: [{ public_id: "zyka", url: "https://images.unsplash.com/photo-1504674900769-0c55830f3e30?w=500&h=300" }],
    reviews: [{ name: "Alex M.", rating: 5, Comment: "Amazing food and fast delivery!" }]
  },
  {
    name: "Green Leaf Pure Veg",
    isVeg: true,
    address: "456 Garden Avenue, Midtown",
    ratings: 4.6,
    numOfReviews: 89,
    location: { type: "Point", coordinates: [-73.98513, 40.748817] },
    images: [{ public_id: "greenleaf", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300" }],
    reviews: [{ name: "Sarah K.", rating: 5, Comment: "Best vegetarian options in town!" }]
  },
  {
    name: "Spice Route Indian Kitchen",
    isVeg: false,
    address: "789 Curry Lane, Queens",
    ratings: 4.9,
    numOfReviews: 215,
    location: { type: "Point", coordinates: [-73.88, 40.72] },
    images: [{ public_id: "spiceroute", url: "https://images.unsplash.com/photo-1565456200244-4fbdf305efff?w=500&h=300" }],
    reviews: [{ name: "Rahul S.", rating: 5, Comment: "Authentic flavors and generous portions." }]
  }
];

const sampleFoods = [
  { name: "Butter Chicken", price: 299, description: "Rich creamy tomato gravy with tender grilled chicken.", stock: 50, images: [{ public_id: "bc", url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400" }] },
  { name: "Paneer Butter Masala", price: 249, description: "Fresh cottage cheese cubes in rich spiced gravy.", stock: 40, images: [{ public_id: "pbm", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" }] },
  { name: "Garlic Naan", price: 49, description: "Freshly baked Indian flatbread with garlic butter.", stock: 100, images: [{ public_id: "gn", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }] },
  { name: "Veg Biryani", price: 199, description: "Aromatic basmati rice cooked with fresh vegetables and spices.", stock: 35, images: [{ public_id: "vb", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" }] }
];

const seedData = async () => {
  try {
    await connectDB();

    const existingCount = await Restaurant.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} restaurants.`);
      process.exit(0);
    }

    console.log("Seeding initial restaurants and menu data...");
    
    for (const restData of sampleRestaurants) {
      const rest = await Restaurant.create(restData);
      
      const createdFoods = [];
      for (const foodData of sampleFoods) {
        const food = await FoodItem.create({ ...foodData, restaurant: rest._id });
        createdFoods.push(food._id);
      }

      await Menu.create({
        restaurant: rest._id,
        menu: [
          { category: "Main Course", items: createdFoods.slice(0, 2) },
          { category: "Breads & Rice", items: createdFoods.slice(2, 4) }
        ]
      });
    }

    console.log("✓ Sample data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeder error:", err);
    process.exit(1);
  }
};

seedData();
