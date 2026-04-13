//user open app
//we need restaurant data from the backend
//api call happens
//data stored in redux
//ui updates automatically

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

//get all restaurants
export const getRestaurants = createAsyncThunk(
    'restaurants/getRestaurants',async(keyword = " ", {rejectWithValue})=>{
    try {
        //API call
        const {data} = await api.get(`/v1/eats/stores?keyword=${keyword}`);
        console.log("Fetched restaurants", data);
        return {
            restaurants :data.restaurants,
            count:data.count,
        }
    }catch(error){
        return rejectWithValue(error.response?.data?.message || error.message);    
    }
    })

