//Centralise api setup here
import axios from 'axios';
import qs from 'qs';
const api = axios.create({
    baseURL: '/api', // Base URL for all API requests
    withCredentials: true, // Include cookies in requests
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }), // Serialize query parameters
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;



