//start the server


//load environment variables from .env file
//start the server

//import the app
const app = require('./app');

//import dotenv to load environment variables
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

//start the server

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

//connect to the database
const connectDB = require('./db');
connectDB(); //connect to the database

//handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
});


