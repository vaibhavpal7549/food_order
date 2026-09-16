import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/actions/userActions";

import Search from "./Search";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, loading } = useSelector((state) => state.user);
  const cartCount = useSelector((state) => state.cart.cartItems?.length || 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <nav className="navbar row sticky-top">
        {/* logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        {/* search */}
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route
              path="/eats/stores/search/:keyword"
              element={<Search />}
            />
          </Routes>
        </div>

        {/* right side */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex align-items-center justify-content-center justify-content-md-end">
          <Link to="/" className="btn text-white mr-2" style={{ textDecoration: "none", fontWeight: "600", fontSize: "1.05rem" }}>
            Home
          </Link>

          {(!user || (user.role !== "admin" && user.role !== "restaurant-owner")) && (
            <Link to="/cart" style={{ textDecoration: "none" }}>
              <span className="ml-2" id="cart">
                Cart
              </span>
              <span className="ml-1" id="cart_count">
                {cartCount}
              </span>
            </Link>
          )}

          {user ? (
            <div
              className="ml-3 dropdown d-inline"
              ref={dropdownRef}
              style={{ position: "relative" }}
            >
              <button
                type="button"
                className="btn text-white mr-2"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                style={{ background: "none", border: "none" }}
              >
                <figure className="avatar avatar-nav" style={{ display: "inline-block" }}>
                  <img
                    src={user?.avatar?.url || "/images/images.png"}
                    alt={user?.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user?.name}</span>
                <span style={{ marginLeft: "0.4rem" }}>▾</span>
              </button>

              {dropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    zIndex: 1050,
                    minWidth: "10rem",
                  }}
                >
                  <Link
                    className="dropdown-item"
                    to="/"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Home
                  </Link>

                  {(user?.role === "admin" || user?.role === "restaurant-owner") ? (
                    <Link
                      className="dropdown-item"
                      to="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      className="dropdown-item"
                      to="/eats/orders/me/myOrders"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Orders
                    </Link>
                  )}

                  <Link
                    className="dropdown-item"
                    to="/users/me"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    className="dropdown-item text-danger"
                    to="/"
                    onClick={logoutHandler}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <Link to="/users/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
