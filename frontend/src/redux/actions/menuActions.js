import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getMenus = createAsyncThunk(
    'menu/getMenus',
    async (storeId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/v1/eats/stores/${storeId}/menus`);
            const menuGroups = data.data?.[0]?.menu || [];

            return menuGroups.map((group, index) => ({
                _id: `${group.category || 'category'}-${index}`,
                category: group.category || 'Uncategorized',
                items: group.items || [],
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async ({ restaurantId, category }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/v1/eats/stores/${restaurantId}/menus`, { category, restaurant: restaurantId });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addItemToMenu = createAsyncThunk(
    'menu/addItemToMenu',
    async ({ menuId, category, foodItemId, restaurantId }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/v1/eats/stores/${restaurantId}/menus/${menuId}/addItem`, {
                category,
                foodItemId,
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
