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
