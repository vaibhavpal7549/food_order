import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  updateCartItemQuantityAction,
  removeFromCartItem,
} from "../redux/actions/cartActions";
import api from "../utils/api";
import { getMenus } from "../redux/actions/menuActions";

const Fooditem = ({ fooditem, restaurant }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //state (Redux Toolkit user slice)
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;

  //cart from slice
  const { cartItems } = useSelector((state) => state.cart);

  // Edit food item state
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [editFood, setEditFood] = useState({
    name: fooditem.name || "",
    price: fooditem.price || 0,
    description: fooditem.description || "",
    stock: fooditem.stock || 0,
    imageUrl: fooditem.images?.[0]?.url || "",
  });

  // Derive quantity and showButtons from cart state instead of using an effect
  const cartItem = cartItems.find((item) => item.foodItem._id === fooditem._id);
  const quantity = cartItem ? cartItem.quantity : 1;
  const showButtons = !!cartItem;

  // ➖ decrease
  const decreaseQty = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(updateCartItemQuantityAction(fooditem._id, newQuantity));
    } else {
      dispatch(removeFromCartItem(fooditem._id));
    }
  };

  // ➕ increase
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      const newQuantity = quantity + 1;
      dispatch(updateCartItemQuantityAction(fooditem._id, newQuantity));
    } else {
      alert("Exceeded stock limit");
    }
  };

  //add to cart
  const addToCartHandler = () => {
    if (!isAuthenticated) {
      return navigate("/users/login");
    }
    dispatch(addItemToCart(fooditem._id, restaurant, quantity));
  };

  const handleOpenEdit = () => {
    setEditFood({
      name: fooditem.name || "",
      price: fooditem.price || 0,
      description: fooditem.description || "",
      stock: fooditem.stock || 0,
      imageUrl: fooditem.images?.[0]?.url || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = {
        name: editFood.name,
        price: parseFloat(editFood.price) || 0,
        description: editFood.description,
        stock: parseInt(editFood.stock) || 0,
        images: [
          {
            public_id: "default",
            url: editFood.imageUrl || "/images/placeholder.png",
          },
        ],
      };

      await api.patch(`/v1/eats/item/${fooditem._id}`, payload);
      setShowEditModal(false);
      if (restaurant) {
        dispatch(getMenus(restaurant));
      }
    } catch (err) {
      console.error("Failed to update item:", err);
      alert(err.response?.data?.message || "Could not update food item");
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateAIDesc = async () => {
    if (!editFood.name || !editFood.name.trim()) return alert("Please enter dish name first!");
    try {
      setGeneratingAI(true);
      const { data } = await api.post("/v1/ai/generate-food-ai", {
        name: editFood.name,
        category: "General",
        spiceLevel: "Medium",
        price: parseFloat(editFood.price) || 0,
      });

      if (data?.data?.description) {
        setEditFood((prev) => ({
          ...prev,
          description: data.data.description.slice(0, 150),
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Could not generate AI description. You can type it manually!");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {!showButtons ? (
          
            (!isAuthenticated || user?.role !== "admin") && (
              <button
              id="cart_btn"
              className="btn btn-primary ml-4"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
            )
          ) : (
            <div className="stockCounter d-inline">
              <span className="btn btn-danger minus" onClick={decreaseQty}>
                -
              </span>

              <input
                type="number"
                className="form-control count d-inline"
                value={quantity}
                readOnly
              />

              <span className="btn btn-primary plus" onClick={increaseQty}>
                +
              </span>
            </div>
          )}

          <hr />

          <p>
            Status:
            <span
              className={
                fooditem.stock > 0 ? "greenColor" : "redColor"
              }
            >
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          {/* ADMIN CONTROLS (EDIT & DELETE) */}
          {isAuthenticated && user?.role === "admin" && (
            <div className="d-flex mt-2" style={{ gap: "6px" }}>
              <button
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={handleOpenEdit}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger btn-sm flex-fill"
                onClick={async () => {
                  if (!window.confirm("Delete this food item?")) return;

                  try {
                    await api.delete(`/v1/eats/item/${fooditem._id}`);
                    if (restaurant) {
                      dispatch(getMenus(restaurant));
                    }
                  } catch (err) {
                    console.error(err);
                    alert(
                      err.response?.data?.message || "Unable to delete item"
                    );
                  }
                }}
              >
                Delete
              </button>
            </div>
          )} 
        </div>
      </div>

      {/* EDIT FOOD ITEM MODAL */}
      {showEditModal && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Edit Food Item</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group mb-2">
                <label className="small mb-1 font-weight-bold">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFood.name}
                  onChange={(e) => setEditFood({ ...editFood, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="small mb-1 font-weight-bold">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={editFood.price}
                  onChange={(e) => setEditFood({ ...editFood, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-2">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <small className={150 - (editFood.description?.length || 0) <= 15 ? "text-danger fw-bold" : "text-muted"} style={{ fontSize: "12px" }}>
                    Description ({150 - (editFood.description?.length || 0)} left)
                  </small>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    style={{ fontSize: "12px", padding: "2px 8px" }}
                    onClick={handleGenerateAIDesc}
                    disabled={generatingAI}
                  >
                    {generatingAI ? "Generating..." : "✨ Generate AI"}
                  </button>
                </div>
                <textarea
                  className="form-control"
                  rows="2"
                  value={editFood.description}
                  maxLength={150}
                  onChange={(e) => setEditFood({ ...editFood, description: e.target.value.slice(0, 150) })}
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="small mb-1 font-weight-bold">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={editFood.stock}
                  onChange={(e) => setEditFood({ ...editFood, stock: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="small mb-1 font-weight-bold">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFood.imageUrl}
                  onChange={(e) => setEditFood({ ...editFood, imageUrl: e.target.value })}
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </button>
              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fooditem;

