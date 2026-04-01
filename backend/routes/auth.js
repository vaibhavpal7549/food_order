const express = require('express');
const router = express.Router();

//const  authController = require('../controllers/authController');
const { signUp, loginUser, logoutUser } = require('../controllers/authController');

//register a new user
router.post('/signUp', signUp);

//login a user
router.post('/login', loginUser);

//logout a user
router.get('/logout', logoutUser);

module.exports = router;