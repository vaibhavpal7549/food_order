const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendToken = require('../utils/sendToken');

//register a new user

exports.signUp = async (req, res) => {
    const {name, email, password, passwordConfirm, phoneNumber} = req.body;

    let avtar = {};

    if(!req.body.avtar || req.body.avtar === "/images/images.png"){
        avtar = {
            public_id: "default",
            url: "/images/images.png"
        };
    }

    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        phoneNumber,
        avtar
    });
    
    sendToken(user, 200, res);
};


