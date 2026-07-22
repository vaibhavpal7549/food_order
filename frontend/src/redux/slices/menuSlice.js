import { createSlice } from '@reduxjs/toolkit';
import { getMenus, createMenu, addItemToMenu } from '../actions/menuActions';

const initialState = {
    menus: [],
    // FIX BUG-07: Store the real MongoDB _id of the Menu document so
    // addItemToMenu can use a valid ObjectId instead of undefined.
    menuDocumentId: null,
    loading: false,
    error: null,
    addingItem: false,
    addError: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        clearMenuError: (state) => {
            state.error = null;
            state.addError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET MENUS
            .addCase(getMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.menus = action.payload.menus;
                // FIX BUG-07: Store the real Menu document _id
                state.menuDocumentId = action.payload.menuDocumentId || null;
            })
            .addCase(getMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch menus';
            })

            // CREATE MENU
            .addCase(createMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMenu.fulfilled, (state, action) => {
                state.loading = false;
                // After creating a menu, menuDocumentId is now available
                if (action.payload?._id) {
                    state.menuDocumentId = action.payload._id;
                }
            })
            .addCase(createMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create menu';
            })

            // ADD ITEM TO MENU
            .addCase(addItemToMenu.pending, (state) => {
                state.addingItem = true;
                state.addError = null;
            })
            .addCase(addItemToMenu.fulfilled, (state) => {
                state.addingItem = false;
            })
            .addCase(addItemToMenu.rejected, (state, action) => {
                state.addingItem = false;
                state.addError = action.payload || 'Failed to add item';
            });
    },
});

export const { clearMenuError } = menuSlice.actions;

export default menuSlice.reducer;
