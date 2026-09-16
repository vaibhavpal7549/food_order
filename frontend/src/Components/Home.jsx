import React, { useEffect, useState } from "react";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";

import { createRestaurant, updateRestaurant, getRestaurants } from "../redux/actions/restaurantActions";
import Restaurant from "../Components/Restaurant";
import Loader from "../Components/layout/Loader";
import Message from "../Components/Message";
import { useDispatch, useSelector } from "react-redux";
import CountRestaurant from "./CountRestaurant";
import { useParams } from "react-router-dom";

import api from "../utils/api";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    showVegOnly,
    creating,
    createError,
    updating,
    updateError,
  } = useSelector((state) => state.restaurants);

  const {
    isAuthenticated,
    user,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getRestaurants(keyword));
  }, [dispatch, keyword]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  // admin controls
  const initialRestaurantState = {
    name: "",
    address: "",
    description: "",
    isVeg: false,
    location: { type: "Point", coordinates: [] },
    imageUrl: "",
  };

  const [showCreate, setShowCreate] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState(initialRestaurantState);
  const [coordsInput, setCoordsInput] = React.useState("");

  // edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editRestaurantId, setEditRestaurantId] = useState("");
  const [generatingEditAI, setGeneratingEditAI] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState(initialRestaurantState);
  const [editCoordsInput, setEditCoordsInput] = useState("");

  const handleOpenCreate = () => {
    setNewRestaurant(initialRestaurantState);
    setCoordsInput("");
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    setNewRestaurant(initialRestaurantState);
    setCoordsInput("");
  };

  const handleOpenEdit = (restaurant) => {
    setEditRestaurantId(restaurant._id);
    setEditRestaurant({
      name: restaurant.name || "",
      address: restaurant.address || "",
      description: restaurant.description || "",
      isVeg: restaurant.isVeg || false,
      location: restaurant.location || { type: "Point", coordinates: [] },
      imageUrl: restaurant.images?.[0]?.url || "",
    });
    setEditCoordsInput(restaurant.location?.coordinates?.join(",") || "82.68,25.75");
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditRestaurantId("");
    setEditRestaurant(initialRestaurantState);
    setEditCoordsInput("");
  };

  const handleGenerateAIDescription = async () => {
    if (!newRestaurant.name) {
      alert("Please enter a restaurant name first!");
      return;
    }

    try {
      setGeneratingAI(true);
      const res = await api.post("/v1/ai/generate-restaurant-ai", {
        name: newRestaurant.name,
        address: newRestaurant.address,
        isVeg: newRestaurant.isVeg,
      });

      if (res.data?.data?.description) {
        setNewRestaurant((prev) => ({
          ...prev,
          description: res.data.data.description.slice(0, 200),
        }));
      }
    } catch (err) {
      console.error("Failed to generate AI description:", err);
      alert("Could not generate AI description. You can type it manually!");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleGenerateEditAIDescription = async () => {
    if (!editRestaurant.name) {
      alert("Please enter a restaurant name first!");
      return;
    }

    try {
      setGeneratingEditAI(true);
      const res = await api.post("/v1/ai/generate-restaurant-ai", {
        name: editRestaurant.name,
        address: editRestaurant.address,
        isVeg: editRestaurant.isVeg,
      });

      if (res.data?.data?.description) {
        setEditRestaurant((prev) => ({
          ...prev,
          description: res.data.data.description.slice(0, 200),
        }));
      }
    } catch (err) {
      console.error("Failed to generate AI description:", err);
      alert("Could not generate AI description. You can type it manually!");
    } finally {
      setGeneratingEditAI(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "isVeg") {
      setNewRestaurant({ ...newRestaurant, isVeg: checked });
    } else if (name === "coordinates") {
      setCoordsInput(value);

      const parts = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const coords = parts.map((v) => parseFloat(v)).filter((n) => !isNaN(n));

      setNewRestaurant({
        ...newRestaurant,
        location: { ...newRestaurant.location, coordinates: coords },
      });
    } else if (name === "imageUrl") {
      setNewRestaurant({ ...newRestaurant, imageUrl: value });
    } else if (name === "description") {
      setNewRestaurant({ ...newRestaurant, description: value.slice(0, 200) });
    } else {
      setNewRestaurant({ ...newRestaurant, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "isVeg") {
      setEditRestaurant({ ...editRestaurant, isVeg: checked });
    } else if (name === "coordinates") {
      setEditCoordsInput(value);

      const parts = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const coords = parts.map((v) => parseFloat(v)).filter((n) => !isNaN(n));

      setEditRestaurant({
        ...editRestaurant,
        location: { ...editRestaurant.location, coordinates: coords },
      });
    } else if (name === "imageUrl") {
      setEditRestaurant({ ...editRestaurant, imageUrl: value });
    } else if (name === "description") {
      setEditRestaurant({ ...editRestaurant, description: value.slice(0, 200) });
    } else {
      setEditRestaurant({ ...editRestaurant, [name]: value });
    }
  };

  const submitCreate = async (e) => {
    e.preventDefault();

    const coords =
      newRestaurant.location?.coordinates?.length === 2
        ? newRestaurant.location.coordinates
        : [82.68, 25.75];

    const payload = {
      name: newRestaurant.name,
      address: newRestaurant.address,
      description: newRestaurant.description,
      isVeg: newRestaurant.isVeg,
      location: {
        type: "Point",
        coordinates: coords,
      },
      images: [
        {
          public_id: "default",
          url: newRestaurant.imageUrl || "/images/images.png",
        },
      ],
    };

    const result = await dispatch(createRestaurant(payload));

    // ✅ close only if success
    if (createRestaurant.fulfilled.match(result)) {
      handleCloseCreate();
      setCoordsInput("");
      dispatch(getRestaurants());
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    const parts = editCoordsInput
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");
    const coords = parts.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
    const finalCoords = coords.length === 2 ? coords : [82.68, 25.75];

    const payload = {
      name: editRestaurant.name,
      address: editRestaurant.address,
      description: editRestaurant.description,
      isVeg: editRestaurant.isVeg,
      location: {
        type: "Point",
        coordinates: finalCoords,
      },
      images: [
        {
          public_id: "default",
          url: editRestaurant.imageUrl || "/images/images.png",
        },
      ],
    };

    const result = await dispatch(
      updateRestaurant({ id: editRestaurantId, restaurantData: payload })
    );

    if (updateRestaurant.fulfilled.match(result)) {
      handleCloseEdit();
      dispatch(getRestaurants());
    }
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  return (
    <>
      <CountRestaurant />
      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger"> {restaurantsError}</Message>
      ) : (
        <>
          <section>
            <div className="sort">
              <button className="sort_veg p-3" onClick={handleToggleVegOnly}>
                {showVegOnly ? "Show All" : "Pure Veg"}
              </button>

              <button className="sort_rev p-3" onClick={handleSortByReviews}>
                Sort By Reviews
              </button>

              <button className="sort_rate p-3" onClick={handleSortByRatings}>
                Sort By ratings
              </button>
            </div>

            <div className="row mt-4">
              {/* ✅ FIXED HERE */}
              {restaurants && restaurants.length > 0 ? (
                restaurants.map((restaurant) =>
                  !showVegOnly || restaurant.isVeg ? (
                    <Restaurant
                      key={restaurant._id}
                      restaurant={restaurant}
                      onEdit={handleOpenEdit}
                    />
                  ) : null
                )
              ) : (
                <Message variant="info"> No restaurants Found. </Message>
              )}

              {/* admin add restaurant button */}
              {isAuthenticated && user && user.role === "admin" && (
                <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                  <div
                    className="card p-3 rounded text-center d-flex align-items-center justify-content-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleOpenCreate}
                  >
                    <h1 className="m-0">+</h1>
                    <p className="mb-0">Add Restaurant</p>
                  </div>
                </div>
              )}
            </div>

            {/* create form modal */}
            {showCreate && (
              <div className="create-modal">
                <div className="create-content">
                  <h3>Create Restaurant</h3>

                  <form onSubmit={submitCreate}>
                    {createError && (
                      <Message variant="danger">{createError}</Message>
                    )}

                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newRestaurant.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={newRestaurant.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <div className="d-flex align-items-center">
                          <label className="mb-0 mr-2">Description</label>
                          <small className={200 - (newRestaurant.description?.length || 0) <= 20 ? "text-danger fw-bold" : "text-muted"} style={{ fontSize: "12px" }}>
                            ({200 - (newRestaurant.description?.length || 0)} left)
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          style={{ fontSize: "12px", padding: "2px 8px" }}
                          onClick={handleGenerateAIDescription}
                          disabled={generatingAI}
                        >
                          {generatingAI ? "Generating..." : "✨ Generate with AI"}
                        </button>
                      </div>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={newRestaurant.description}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="Enter description (max 200 chars) or click ✨ Generate with AI"
                      />
                    </div>

                    <div className="form-group">
                      <label>Pure Veg</label>
                      <input
                        type="checkbox"
                        name="isVeg"
                        checked={newRestaurant.isVeg}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Coordinates (lat,lng)</label>
                      <input
                        type="text"
                        name="coordinates"
                        value={coordsInput}
                        onChange={handleChange}
                        placeholder="e.g. 40.77,-73.97"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={newRestaurant.imageUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={creating}
                    >
                      {creating ? "Creating..." : "Create"}
                    </button>

                    <button
                      className="btn btn-secondary ml-2"
                      type="button"
                      onClick={handleCloseCreate}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* edit form modal */}
            {showEdit && (
              <div className="create-modal">
                <div className="create-content">
                  <h3>Edit Restaurant</h3>

                  <form onSubmit={submitEdit}>
                    {updateError && (
                      <Message variant="danger">{updateError}</Message>
                    )}

                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editRestaurant.name}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editRestaurant.address}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <div className="d-flex align-items-center">
                          <label className="mb-0 mr-2">Description</label>
                          <small className={200 - (editRestaurant.description?.length || 0) <= 20 ? "text-danger fw-bold" : "text-muted"} style={{ fontSize: "12px" }}>
                            ({200 - (editRestaurant.description?.length || 0)} left)
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          style={{ fontSize: "12px", padding: "2px 8px" }}
                          onClick={handleGenerateEditAIDescription}
                          disabled={generatingEditAI}
                        >
                          {generatingEditAI ? "Generating..." : "✨ Generate with AI"}
                        </button>
                      </div>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={editRestaurant.description}
                        onChange={handleEditChange}
                        maxLength={200}
                        placeholder="Enter description (max 200 chars) or click ✨ Generate with AI"
                      />
                    </div>

                    <div className="form-group">
                      <label>Pure Veg</label>
                      <input
                        type="checkbox"
                        name="isVeg"
                        checked={editRestaurant.isVeg}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Coordinates (lat,lng)</label>
                      <input
                        type="text"
                        name="coordinates"
                        value={editCoordsInput}
                        onChange={handleEditChange}
                        placeholder="e.g. 40.77,-73.97"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={editRestaurant.imageUrl}
                        onChange={handleEditChange}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>

                    <button
                      className="btn btn-secondary ml-2"
                      type="button"
                      onClick={handleCloseEdit}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default Home;
