import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant } from "../redux/actions/restaurantActions";

const Restaurant = ({ restaurant, onEdit }) => {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.user || {}
  );

  //DELETE
  const handleDelete = () => {
    if (!window.confirm("Delete this restaurant?")) return;

    dispatch(deleteRestaurant(restaurant._id)).catch(() => {
      alert("Unable to delete");
    });
  };

  const imageUrl = restaurant?.images?.[0]?.url;
  const displayImage = imageError || !imageUrl ? "/images/template.jpeg" : imageUrl;

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <Link to={`/eats/stores/${restaurant._id}/menus`}>
          <img
            className="card-img-top mx-auto"
            src={displayImage}
            onError={() => setImageError(true)}
            alt={restaurant.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-1">{restaurant.name}</h5>
          <p className="rest_address text-muted mb-2">{restaurant.address}</p>
          {restaurant.description && (
            <p
              className="card-text text-secondary mb-3"
              style={{ fontSize: "0.85rem", lineHeight: "1.35" }}
            >
              {restaurant.description}
            </p>
          )}

          {/* Ratings */}
          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(restaurant.ratings / 5) * 100}%`,
                }}
              ></div>
            </div>
            <span>({restaurant.numOfReviews} Reviews)</span>
          </div>

          {/*AI INSIGHTS (ONLY FOR USERS) */}
          {user?.role === "user" &&
            restaurant.reviewSentiment && (
              <div className="mt-2 p-2 border rounded bg-light">
                <strong>AI Insights</strong>

                <p>
                  Sentiment: <b>{restaurant.reviewSentiment}</b>
                </p>

                <ul>
                  {(restaurant.reviewSummaryBullets || []).map(
                    (point, i) => (
                      <li key={i}>{point}</li>
                    )
                  )}
                </ul>

                <small>
                  Top:{" "}
                  {(restaurant.reviewTopMentions || []).join(
                    ", "
                  )}
                </small>
              </div>
            )}

          {/* ADMIN CONTROLS (EDIT & DELETE) */}
          {isAuthenticated && user?.role === "admin" && (
            <div className="d-flex mt-2" style={{ gap: "6px" }}>
              <button
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={() => onEdit && onEdit(restaurant)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger btn-sm flex-fill"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
