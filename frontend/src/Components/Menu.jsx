import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMenus, addItemToMenu, createMenu } from "../redux/actions/menuActions";
import { getRestaurants, createRestaurantReview } from "../redux/actions/restaurantActions";
import Fooditem from "./Fooditem";
import api from "../utils/api";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // FIX BUG-07: use menuDocumentId (real MongoDB _id) instead of menuId (was undefined)
  const { menus, menuDocumentId, loading, error, addingItem, addError } = useSelector(
    (state) => state.menu
  );

  const { restaurants } = useSelector((state) => state.restaurants);
  const currentRestaurant = restaurants?.find((r) => r._id === id);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [showMenuCreate, setShowMenuCreate] = useState(false);
  const [newMenuCategory, setNewMenuCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatingDishAI, setGeneratingDishAI] = useState(false);
  const [itemToAdd, setItemToAdd] = useState({ category: "", foodItemId: "" });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    dispatch(getMenus(id));
    dispatch(getRestaurants());
  }, [dispatch, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating", { position: "bottom-right" });
      return;
    }
    setSubmittingReview(true);
    try {
      const result = await dispatch(
        createRestaurantReview({ storeId: id, rating, comment })
      );
      if (createRestaurantReview.fulfilled.match(result)) {
        toast.success("Review submitted successfully! ⭐", { position: "bottom-right" });
        setShowReviewModal(false);
        setComment("");
        dispatch(getRestaurants());
      } else {
        toast.error(result.payload || "Failed to submit review", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit review", { position: "bottom-right" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitMenuCreation = async (e) => {
    e.preventDefault();
    if (!newMenuCategory) return;

    const result = await dispatch(
      createMenu({ restaurantId: id, category: newMenuCategory })
    );

    if (createMenu.fulfilled.match(result)) {
      dispatch(getMenus(id));
      setShowMenuCreate(false);
      setNewMenuCategory("");
    }
  };

  const submitNewFood = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newFood,
        price: parseFloat(newFood.price) || 0,
        stock: parseInt(newFood.stock) || 0,
        restaurant: id,
      };

      const { data } = await api.post("/v1/eats/item", payload);

      const created = data.data;

      setItemToAdd({ ...itemToAdd, foodItemId: created._id });

      setNewFood({
        name: "",
        price: "",
        description: "",
        stock: "",
        imageUrl: "",
      });

      return created;
    } catch (err) {
      console.error("unable to create food item", err);
      alert(err.response?.data?.message || err.message);
      return null;
    }
  };

  return (
    <div>
      {currentRestaurant && (
        <div className="restaurant-header mb-4 p-4 border rounded bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="mb-1">{currentRestaurant.name}</h1>
              <p className="text-muted mb-2">📍 {currentRestaurant.address}</p>
              {currentRestaurant.description && (
                <p className="text-secondary mb-2" style={{ fontSize: "1.05rem" }}>
                  {currentRestaurant.description}
                </p>
              )}
              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="badge bg-warning text-dark p-2 fs-6">
                  ⭐ {(currentRestaurant.ratings || 0).toFixed(1)} / 5
                </span>
                <span className="text-muted ms-2">
                  ({currentRestaurant.numOfReviews || 0} reviews)
                </span>
              </div>
            </div>
            {isAuthenticated && (
              <button
                className="btn btn-warning fw-bold shadow-sm"
                onClick={() => setShowReviewModal(true)}
              >
                ⭐ Rate Restaurant
              </button>
            )}
          </div>
        </div>
      )}


      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : menus && menus.length > 0 ? (
        menus.map((menu) => {
          const deleteMenu = async () => {
            if (!window.confirm(`Delete "${menu.category}" category?`)) return;
            try {
              await api.delete(
                `/v1/eats/stores/${id}/menus/${menuDocumentId}?category=${encodeURIComponent(menu.category)}`
              );
              dispatch(getMenus(id));
            } catch (err) {
              console.error(err);
              alert(err.response?.data?.message || "Unable to delete menu category");
            }
          };

          return (
            <div key={menu._id}>
              <div className="d-flex align-items-center">
                <h2 className="mr-2">{menu.category}</h2>

                {isAuthenticated && user && (user.role === "admin" || user.role === "restaurant-owner") && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setItemToAdd({
                          category: menu.category,
                          foodItemId: "",
                        });
                        setShowAddModal(true);
                      }}
                    >
                      + item
                    </button>

                    <button
                      className="btn btn-sm btn-danger ml-2"
                      onClick={deleteMenu}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              <hr />

              {menu.items && menu.items.length > 0 ? (
                <div className="row">
                  {menu.items.map((fooditem) => (
                    <Fooditem
                      key={fooditem._id}
                      fooditem={fooditem}
                      restaurant={id}
                    />
                  ))}
                </div>
              ) : (
                <p>No menus available</p>
              )}
            </div>
          );
        })
      ) : (
        <p> No menus Available</p>
      )}

      {/* add menu button */}
      {isAuthenticated && user && (user.role === "admin" || user.role === "restaurant-owner") && (
        <div className="my-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowMenuCreate(true)}
          >
            + Add Menu
          </button>
        </div>
      )}

      {/* create menu modal */}
      {showMenuCreate && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Create Menu Category</h3>

            <form onSubmit={submitMenuCreation}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newMenuCategory}
                  onChange={(e) => setNewMenuCategory(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Create
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowMenuCreate(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* add item modal */}
      {showAddModal && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Add Food Item</h3>

            {addError && <p className="text-danger">{addError}</p>}

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const created = await submitNewFood(e);

                if (created && created._id) {
                  // FIX BUG-07: use menuDocumentId (real MongoDB _id) instead of
                  // the synthetic `menuId` which was always undefined.
                  dispatch(
                    addItemToMenu({
                      menuId: menuDocumentId,
                      category: itemToAdd.category,
                      foodItemId: created._id,
                      restaurantId: id,
                    })
                  ).then(() => {
                    dispatch(getMenus(id));
                    setShowAddModal(false);
                  });
                }
              }}
            >
              <div className="form-group">
                <label>Menu Category</label>

                <select
                  value={itemToAdd.category}
                  onChange={(e) =>
                    setItemToAdd({
                      ...itemToAdd,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select</option>
                  {menus.map((m) => (
                    <option key={m._id} value={m.category}>
                      {m.category}
                    </option>
                  ))}
                </select>
              </div>

              <h5 className="mt-3">Create New Food Item</h5>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={newFood.name}
                  onChange={(e) =>
                    setNewFood({ ...newFood, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group d-flex align-items-center">
                <input
                  type="number"
                  placeholder="Price"
                  value={newFood.price}
                  onChange={(e) =>
                    setNewFood({ ...newFood, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group mb-2">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <small className={150 - (newFood.description?.length || 0) <= 15 ? "text-danger fw-bold" : "text-muted"} style={{ fontSize: "12px" }}>
                    Description ({150 - (newFood.description?.length || 0)} left)
                  </small>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    style={{ fontSize: "12px", padding: "2px 8px" }}
                    disabled={generatingDishAI}
                    onClick={async () => {
                      if (!newFood.name || !newFood.name.trim()) return alert("Please enter dish name first!");

                      try {
                        setGeneratingDishAI(true);
                        const { data } = await api.post(
                          "/v1/ai/generate-food-ai",
                          {
                            name: newFood.name,
                            category: itemToAdd.category || "General",
                            spiceLevel: "Medium",
                            price: parseFloat(newFood.price) || 0,
                          }
                        );

                        if (data?.data?.description) {
                          setNewFood((prev) => ({
                            ...prev,
                            description: data.data.description.slice(0, 150),
                          }));
                        }
                      } catch (err) {
                        console.error("AI Generation error:", err);
                        alert(err.response?.data?.message || "Could not generate AI description. You can type it manually!");
                      } finally {
                        setGeneratingDishAI(false);
                      }
                    }}
                  >
                    {generatingDishAI ? "Generating..." : "✨ Generate AI"}
                  </button>
                </div>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Enter dish description (max 150 chars)"
                  value={newFood.description}
                  maxLength={150}
                  onChange={(e) =>
                    setNewFood({
                      ...newFood,
                      description: e.target.value.slice(0, 150),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  placeholder="Stock"
                  value={newFood.stock}
                  onChange={(e) =>
                    setNewFood({ ...newFood, stock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newFood.imageUrl}
                  onChange={(e) =>
                    setNewFood({ ...newFood, imageUrl: e.target.value })
                  }
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={addingItem}>
                {addingItem ? "Adding..." : "Add"}
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      {currentRestaurant?.reviews && currentRestaurant.reviews.length > 0 && (
        <div className="reviews-section mt-5 mb-4 p-4 border rounded bg-white shadow-sm">
          <h3 className="mb-3">Customer Reviews & Ratings ({currentRestaurant.numOfReviews})</h3>
          <div className="row">
            {currentRestaurant.reviews.map((rev, index) => (
              <div key={rev._id || index} className="col-md-6 mb-3">
                <div className="p-3 border rounded bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">{rev.name}</strong>
                    <span className="badge bg-warning text-dark">
                      ★ {rev.rating} / 5
                    </span>
                  </div>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                    {rev.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="create-modal">
          <div className="create-content" style={{ maxWidth: "500px" }}>
            <h3 className="mb-3">Rate & Review {currentRestaurant?.name}</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group text-center mb-4">
                <label className="d-block fw-bold mb-2">Select Rating</label>
                <div className="d-flex justify-content-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "2.5rem",
                        cursor: "pointer",
                        color: star <= rating ? "#ffc107" : "#e4e5e9",
                        transition: "color 0.2s",
                        userSelect: "none",
                      }}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <small className="text-muted mt-1 d-block">{rating} out of 5 stars</small>
              </div>

              <div className="form-group mb-3">
                <label className="fw-bold">Your Review / Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share your dining experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
