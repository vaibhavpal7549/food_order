const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendToken = require('../utils/sendToken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require("../utils/errorHandler");


//register a new user
exports.signUp = catchAsyncErrors(async (req, res) => {
    const {name, email, password, passwordConfirm, phoneNumber} = req.body;

    // let avtar = {};
    // if(!req.body.avtar || req.body.avtar === "/images/images.png"){
    //     avtar = {
    //         public_id: "default",
    //         url: "/images/images.png"
    //     };
    // }

    //image uploading pending.


    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        phoneNumber,
        
    });
    
    sendToken(user, 200, res);
});


// login user
exports.login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} =  req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email", 401));
    }

    const isPasswordMatched = await user.correctPassword(password, user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email", 401));
    }

    sendToken(user, 200, res);
});

//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("jwt", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });    
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

//Get User Profile
exports.me = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

