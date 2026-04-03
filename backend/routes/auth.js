const express = require('express');
const router = express.Router();

//const  authController = require('../controllers/authController');
const { signUp, login, logout, me} = require('../controllers/authController');

//register a new user
router.post('/signUp', signUp);

// login a user
router.post('/login', login);

//logout a user
router.get('/logout', logout);
router.get('/me', me);

module.exports = router;

