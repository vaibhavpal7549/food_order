const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
        minLength: [4, 'Your name must be at least 4 characters']
    },
    email : {
        type :String,
        required :[true, 'Please enter your email'],
        unique : true,
        validate : [validator.isEmail, 'Please enter a valid email address']
    },

    password :{
        type : String,
        required :[true, 'Please enter your password'],
        minLength : [8, 'Your password must be at least 8 characters'],
        select : false
    },

    passwordConfirm :{
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator : function(el){
                return el === this.password;
            },
            message : 'Passwords are not the same'
        },
    },

    phoneNumber :{
        type: String,
        required:[true, 'Please enter your phone number'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },

    role :{
        type : String,
        enum : ['user', 'restaurant-owner', 'admin'],
        default : 'user'
    },

    avtar :{
        public_id :String,
        url : String,

    },

    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
},
{timestamp :true},
);

//Hash Password before saving the user
userSchema.pre('save', async function(){
    if(!this.isModified('password')) return; 
    
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;   
});