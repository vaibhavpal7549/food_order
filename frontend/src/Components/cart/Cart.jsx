import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  fetchCart,
  removeFromCartItem,
  updateCartItemQuantityAction,
} from "../../redux/actions/cartActions";
import { processPayment } from "../../redux/actions/ORDERActions";

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems = [], restaurantInfo, loading, error } = useSelector(
    (state) => state.cart
  );
  const { paymentUrl, error: orderError, loading: orderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
    }
  }, [orderError]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const removeCartItemHandler = (id) => {
    dispatch(removeFromCartItem(id));
    toast.success("Item removed from cart");
  };

  const increaseQty = (id, quantity, stock) => {
    if (typeof stock !== "number") {
      toast.error("Stock information is unavailable right now");
      return;
    }

    const newQty = quantity + 1;

    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }

    dispatch(updateCartItemQuantityAction(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) {
      dispatch(updateCartItemQuantityAction(id, quantity - 1));
      return;
    }

    removeCartItemHandler(id);
  };

  const checkoutHandler = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    dispatch(processPayment(cartItems));
  };

  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const totalPrice = cartItems
    .reduce(
      (acc, item) =>
        acc + Number(item.quantity || 0) * Number(item.foodItem?.price || 0),
      0
    )
    .toFixed(2);

  if (loading) {
    return <h2 className="mt-5">Loading cart...</h2>;
  }

  if (!cartItems.length) {
    return <h2 className="mt-5">Your Cart is empty</h2>;
  }

  return (
    <>
      <h2 className="mt-5">
        Your Cart: <b>{cartItems.length} items</b>
      </h2>
      <h3 className="mt-5">
        Restaurant: <b>{restaurantInfo?.name || "N/A"}</b>
      </h3>

      <div className="row d-flex justify-content-between cartt">
        <div className="col-12 col-lg-8">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id || item.foodItem?._id}>
              <div className="row">
                <div className="col-4 col-lg-3">
                  <img
                    src={item.foodItem?.images?.[0]?.url || "/images/template.jpeg"}
                    alt={item.foodItem?.name || "item"}
                    height="90"
                    width="115"
                  />
                </div>

                <div className="col-5 col-lg-3">{item.foodItem?.name}</div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p id="card_item_price">
                    <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                    {item.foodItem?.price || 0}
                  </p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <div className="stockCounter d-inline">
                    <span
                      className="btn btn-danger minus"
                      onClick={() =>
                        decreaseQty(item.foodItem?._id, item.quantity)
                      }
                    >
                      -
                    </span>

                    <input
                      type="number"
                      className="form-control count d-inline"
                      value={item.quantity}
                      readOnly
                    />

                    <span
                      className="btn btn-primary plus"
                      onClick={() =>
                        increaseQty(
                          item.foodItem?._id,
                          item.quantity,
                          item.foodItem?.stock
                        )
                      }
                    >
                      +
                    </span>
                  </div>
                </div>

                <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                  <i
                    id="delete_cart_item"
                    className="fa fa-trash btn btn-danger"
                    onClick={() => removeCartItemHandler(item.foodItem?._id)}
                  ></i>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />

            <p>
              Subtotal:
              <span className="order-summary-values">{totalUnits} (Units)</span>
            </p>

            <p>
              Total:
              <span className="order-summary-values">
                <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                {totalPrice}
              </span>
            </p>

            <hr />

            <button
              id="checkout_btn"
              className="btn btn-primary btn-block"
              onClick={checkoutHandler}
              disabled={orderLoading}
            >
              {orderLoading ? "Processing..." : "Check Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
