//configure express and middleware
// import packages
// creates express app
// configure middleware
// export the app



//import express
const express = require('express');
//create express application
const app = express();

//import middleware packages
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middleware/errors');

//configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('Server is running!');
// });

app.use('/api/user', authRoutes);

app.use(errorMiddleware);


module.exports = app;


