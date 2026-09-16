const Menu = require("../models/menu");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");

// GET ALL MENUS
exports.getAllMenus = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId;
  const filter = storeId ? { restaurant: storeId } : {};

  const menus = await Menu.find(filter).populate("menu.items");

  // If fetching for a specific restaurant and multiple Menu docs exist, auto-merge them into one
  if (storeId && menus.length > 0) {
    const primary = menus[0];
    let hasChanges = false;

    for (let i = 1; i < menus.length; i++) {
      const extraDoc = menus[i];
      if (extraDoc.menu && Array.isArray(extraDoc.menu)) {
        for (const group of extraDoc.menu) {
          const existingCat = primary.menu.find((c) => c.category === group.category);
          if (existingCat) {
            for (const item of group.items || []) {
              const itemId = item._id ? item._id.toString() : item.toString();
              if (!existingCat.items.some((it) => (it._id ? it._id.toString() : it.toString()) === itemId)) {
                existingCat.items.push(item);
                hasChanges = true;
              }
            }
          } else {
            primary.menu.push(group);
            hasChanges = true;
          }
        }
      }
      // Delete extra duplicate document
      await Menu.findByIdAndDelete(extraDoc._id);
    }

    if (hasChanges) {
      await primary.save();
      await primary.populate("menu.items");
    }

    return res.status(200).json({
      status: "success",
      count: 1,
      data: [primary],
    });
  }

  res.status(200).json({
    status: "success",
    count: menus.length,
    data: menus,
  });
});

// CREATE MENU (Adds new category to restaurant menu or creates menu document)
exports.createMenu = catchAsync(async (req, res, next) => {
  const storeId = req.params.storeId || req.body.restaurant;
  const newMenuGroups = req.body.menu || [];

  if (!storeId) {
    return next(new ErrorHandler("Restaurant ID is required", 400));
  }

  // Check if a Menu document already exists for this restaurant
  let existingMenu = await Menu.findOne({ restaurant: storeId });

  if (existingMenu) {
    if (Array.isArray(newMenuGroups)) {
      for (const group of newMenuGroups) {
        const catExists = existingMenu.menu.some((c) => c.category === group.category);
        if (!catExists) {
          existingMenu.menu.push({ category: group.category, items: group.items || [] });
        }
      }
    }
    await existingMenu.save();
    await existingMenu.populate("menu.items");

    return res.status(200).json({
      status: "success",
      data: existingMenu,
    });
  }

  // Create new Menu document if none exists yet
  const menu = await Menu.create({
    restaurant: storeId,
    menu: newMenuGroups,
  });
  await menu.populate("menu.items");

  res.status(201).json({
    status: "success",
    data: menu,
  });
});

// DELETE MENU (Or delete specific category if query param 'category' is passed)
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const { category } = req.query;
  const menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }

  if (category) {
    menu.menu = menu.menu.filter((c) => c.category !== category);
    await menu.save();
    await menu.populate("menu.items");
    return res.status(200).json({
      status: "success",
      data: menu,
    });
  }

  await Menu.findByIdAndDelete(req.params.menuId);

  res.status(204).json({
    status: "success",
  });
});

// ADD ITEM TO MENU
exports.addItemToMenu = catchAsync(async (req, res, next) => {
  const { category, foodItemId } = req.body;
  const menuId = req.params.menuId;

  if (!menuId) {
    return next(new ErrorHandler("Menu ID is required", 400));
  }

  const menu = await Menu.findById(menuId);

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404));
  }

  // find category
  let cat = menu.menu.find((c) => c.category === category);

  // if not found, create new
  if (!cat) {
    cat = { category, items: [] };
    menu.menu.push(cat);
  }

  // add item
  cat.items.push(foodItemId);

  await menu.save();
  await menu.populate("menu.items");

  res.status(200).json({
    status: "success",
    data: menu,
  });
});