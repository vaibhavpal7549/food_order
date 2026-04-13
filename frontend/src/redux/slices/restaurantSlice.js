import {createSlice} from '@reduxjs/toolkit';
import {getRestaurants} from '../actions/restaurantAction';

const initialState = {
    restaurants:[],
    count:0,
    loading:false,
    error:null,
    showVegOnly :false,
    pureVegRestaurantsCount: 0,
};

const restaurantSlice = createSlice({   
    name:'restaurants',
    initialState,
    reducers:{
        sortByRatings :(state) =>{
            state.restaurants.sort((a,b) => b.rating - a.rating);
        },
        sortByReviews :(state) =>{
            state.restaurants.sort((a,b) => b.reviews - a.reviews);
        },
        toggleVegOnly:(state) =>{
            state.showVegOnly = !state.showVegOnly;
            state.pureVegRestaurantsCount = calculatePureVegCount(state.restaurants, state.showVegOnly);
        },
        clearError:(state) =>{
            state.error = null;
        }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(getRestaurants.pending, (state) =>{    
            state.loading = true;
            state.error = null;
        })
        .addCase(getRestaurants.fulfilled, (state, action) =>{
            state.loading = false;
            state.restaurants = action.payload.restaurants;
            state.count = action.payload.count;
            state.pureVegRestaurantsCount = calculatePureVegCount(state.restaurants, state.showVegOnly);
        })
        .addCase(getRestaurants.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.payload || 'Failed to fetch restaurants';
        }) 
    }


})

export const {
    sortByRatings, 
    sortByReviews, 
    toggleVegOnly, 
    clearError
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

// Helper function to calculate pure veg restaurant count
const calculatePureVegCount = (restaurants, showVegOnly) => {
    if (!showVegOnly) {
        return restaurants.filter(restaurant => restaurant.isVeg).length;
    }
}