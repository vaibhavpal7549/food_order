import api from "../../utils/api";
import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  paymentRequest,
  paymentSuccess,
  paymentFail,
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
} from "../slices/orderSlice";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

// create order
export const createOrder = (session_id) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const { data } = await api.post(
      "/v1/eats/orders/new",
      { session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(createOrderSuccess(data.order));
  } catch (error) {
    dispatch(createOrderFail(getErrorMessage(error)));
  }
};

// payment
export const processPayment = (items) => async (dispatch) => {
  try {
    dispatch(paymentRequest());

    const { data } = await api.post(
      "/v1/payment/process",
      { items },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(paymentSuccess(data.url));
  } catch (error) {
    dispatch(paymentFail(getErrorMessage(error)));
  }
};

// my orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch(myOrdersRequest());

    const { data } = await api.get("/v1/eats/orders/me/myOrders");

    dispatch(myOrdersSuccess(data.orders));
  } catch (error) {
    dispatch(myOrdersFail(getErrorMessage(error)));
  }
};

// order details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());

    const { data } = await api.get(`/v1/eats/orders/${id}`);

    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(orderDetailsFail(getErrorMessage(error)));
  }
};
