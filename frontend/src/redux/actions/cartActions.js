// fetch cart
// add to cart
// remove from cart
// update cart item quantity
// clear cart
// save delivery info

import api from '../../utils/api';
import {
    cartRequest,
    cartSuccess,
    cartFailure,
    clearCart,
    saveDeliveryInfo,
} from '../slices/cartSlice';

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || 'Something went wrong';

const normalizeCartPayload = (cart) => ({
    cartItems: cart?.items || [],
    restaurantInfo: cart?.restaurant || null,
});

// fetch cart item
export const fetchCart = () => async (dispatch) => {
    try {
        dispatch(cartRequest());

        const { data } = await api.get('/v1/eats/cart/get-cart');

        dispatch(cartSuccess(normalizeCartPayload(data.data)));
    } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 401) {
            dispatch(cartSuccess(normalizeCartPayload(null)));
            return;
        }

        dispatch(cartFailure(getErrorMessage(error)));
    }
};

// add cart items
export const addItemToCart = (foodItemId, restaurantId, quantity) => async (dispatch, getState) => {
    try {
        dispatch(cartRequest());

        const { user } = getState().user;

        const { data } = await api.post('/v1/eats/cart/add-to-cart', {
            userId: user._id,
            foodItemId,
            restaurantId,
            quantity,
        });

        dispatch(cartSuccess(normalizeCartPayload(data.cart)));
    } catch (error) {
        dispatch(cartFailure(getErrorMessage(error)));
    }
};

// update cart quantity
export const updateCartItemQuantityAction = (foodItemId, quantity) => async (dispatch, getState) => {
    try {
        dispatch(cartRequest());

        const { user } = getState().user;

        const { data } = await api.post('/v1/eats/cart/update-cart-item', {
            userId: user._id,
            foodItemId,
            quantity,
        });

        dispatch(cartSuccess(normalizeCartPayload(data.cart)));
    } catch (error) {
        dispatch(cartFailure(getErrorMessage(error)));
    }
};

// remove from cart
export const removeFromCartItem = (foodItemId) => async (dispatch, getState) => {
    try {
        dispatch(cartRequest());

        const { user } = getState().user;

        await api.delete('/v1/eats/cart/delete-cart-item', {
            data: {
                userId: user._id,
                foodItemId,
            },
        });

        dispatch(fetchCart());
    } catch (error) {
        dispatch(cartFailure(getErrorMessage(error)));
    }
};

// clear cart
export const clearCartAction = () => (dispatch) => {
    dispatch(clearCart());
};

// save delivery info
export const saveDeliveryInfoAction = (deliveryInfo) => (dispatch) => {
    dispatch(saveDeliveryInfo(deliveryInfo));
};
