//import cloudinary package
//To connect Node.js with cloudinary
//connect Node.js with cloudinary
//cloudinary is a cloud-based image and video management service
//that provides an easy-to-use API for uploading, storing, and manipulating media files.
// It allows developers to integrate media management capabilities into their applications
// without having to worry about the underlying infrastructure.
const cloudinary = require("cloudinary");

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary.v2;


