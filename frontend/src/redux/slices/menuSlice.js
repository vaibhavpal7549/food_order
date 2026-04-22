import { createSlice } from '@reduxjs/toolkit';
import { getMenus } from '../actions/menuActions';

const initialState = {
    menus: [],
    loading: false,
    error: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        clearMenuError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.menus = action.payload;
            })
            .addCase(getMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch menus';
            });
    },
});

export const { clearMenuError } = menuSlice.actions;

export default menuSlice.reducer;
