const mongoose = require('mongoose');
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }           
// };

// or we can use another type of connection method
const connectDB =()=>{
    mongoose.connect(process.env.MONGO_URI).then((con) =>{
        console.log(`MongoDB connected with host: ${con.connection.host}`);
    }).catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    });
}

module.exports = connectDB;
