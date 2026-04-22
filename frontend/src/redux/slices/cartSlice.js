//store cart items
//tract restaurant info for order summary
//handleloading errors
//update cart item quantity when user add/remove items from cart


import { createSlice } from '@reduxjs/toolkit';


//initial state for cart slice
const initialState = {
    cartItems: [],
    restaurantInfo: null,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        cartRequest : (state) => {
            state.loading = true;
            state.error = null;
        },
        cartSuccess : (state, action) => {
            state.loading = false;
            state.cartItems = action.payload.cartItems;
            state.restaurantInfo = action.payload.restaurantInfo;
        },
        cartFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.cartItems.push(item);
            }
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== itemId);
        },
        updateCartItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const existingItem = state.cartItems.find(cartItem => cartItem.id === itemId);
            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.restaurantInfo = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        saveDeliveryInfo: (state, action) => {
            state.deliveryInfo = action.payload;
        }
    },
});



export const { cartRequest, cartSuccess, cartFailure, addToCart, removeFromCart, updateCartItemQuantity, clearCart, clearError, saveDeliveryInfo } = cartSlice.actions;

export default cartSlice.reducer;



