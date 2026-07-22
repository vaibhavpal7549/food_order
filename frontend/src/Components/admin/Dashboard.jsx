import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getRestaurants } from "../../redux/actions/restaurantActions";
import { myOrders } from "../../redux/actions/orderActions";
import Loader from "../layout/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { restaurants } = useSelector((state) => state.restaurants);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/users/login");
      return;
    }
    dispatch(getRestaurants());
    dispatch(myOrders());
  }, [dispatch, isAuthenticated, navigate]);

  // Calculate stats
  const totalRestaurants = restaurants?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.finalTotal || 0), 0) || 0;
  const deliveredOrders = orders?.filter((o) => o.orderStatus === "Delivered")?.length || 0;
  const pendingOrders = totalOrders - deliveredOrders;

  if (ordersLoading) return <Loader />;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        <i className="fa fa-tachometer-alt"></i> Dashboard
      </h1>
      <p className="dashboard-welcome">Welcome back, <strong>{user?.name}</strong>!</p>

      {/* Stat Cards */}
      <div className="dashboard-stats">
        <div className="stat-card stat-restaurants">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>{totalRestaurants}</h3>
            <p>Restaurants</p>
          </div>
        </div>

        <div className="stat-card stat-orders">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{totalRevenue.toLocaleString()}</h3>
            <p>Revenue</p>
          </div>
        </div>

        <div className="stat-card stat-delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{deliveredOrders}</h3>
            <p>Delivered</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{pendingOrders}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/" className="action-btn action-view-restaurants">
            🏪 View Restaurants
          </Link>
          <Link to="/eats/orders/me/myOrders" className="action-btn action-view-orders">
            📋 View Orders
          </Link>
          <Link to="/users/me" className="action-btn action-profile">
            👤 My Profile
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-recent-orders">
        <h2>Recent Orders</h2>
        {orders && orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id?.substring(0, 10)}...</td>
                  <td>{order.restaurant?.name || "Unknown"}</td>
                  <td>{order.orderItems?.length}</td>
                  <td>₹{order.finalTotal}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.orderStatus === "Delivered"
                          ? "badge-delivered"
                          : "badge-pending"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-orders">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
