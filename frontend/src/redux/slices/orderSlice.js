import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  orders: [],
  orderDetails: null,
  paymentUrl: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.error = null;
    },
    createOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    paymentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    paymentSuccess: (state, action) => {
      state.loading = false;
      state.paymentUrl = action.payload;
      state.error = null;
    },
    paymentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    myOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },
    myOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    orderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
      state.error = null;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  clearErrors,
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
} = orderSlice.actions;

export default orderSlice.reducer;
