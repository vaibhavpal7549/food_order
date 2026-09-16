import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getMenus = createAsyncThunk(
    'menu/getMenus',
    async (storeId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/v1/eats/stores/${storeId}/menus`);
            const docs = data.data || [];
            const menuDocument = docs[0] || null;

            let allGroups = [];
            docs.forEach((doc) => {
                if (doc?.menu && Array.isArray(doc.menu)) {
                    doc.menu.forEach((group) => {
                        const existing = allGroups.find((g) => g.category === group.category);
                        if (existing) {
                            group.items?.forEach((item) => {
                                const itemId = item._id || item;
                                if (!existing.items.some((it) => (it._id || it) === itemId)) {
                                    existing.items.push(item);
                                }
                            });
                        } else {
                            allGroups.push({
                                category: group.category,
                                items: [...(group.items || [])],
                            });
                        }
                    });
                }
            });

            return {
                menuDocumentId: menuDocument?._id || null,
                menus: allGroups.map((group, index) => ({
                    _id: `${group.category || 'category'}-${index}`,
                    category: group.category || 'Uncategorized',
                    items: group.items || [],
                })),
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.errMessage ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);

export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async ({ restaurantId, category }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/v1/eats/stores/${restaurantId}/menus`, {
                menu: [{ category, items: [] }],
                restaurant: restaurantId,
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.errMessage ||
                error.response?.data?.message ||
                error.message
            );
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
            return rejectWithValue(
                error.response?.data?.errMessage ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);
