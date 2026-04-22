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

// For the atlas connection only
// const connectDB =()=>{
//     mongoose.connect(process.env.MONGO_URI).then((con) =>{
//         console.log(`MongoDB connected with host: ${con.connection.host}`);
//     }).catch((err) => {
//         console.error(`Error connecting to MongoDB: ${err.message}`);
//     });
// }


// For the local connection and atlas both
const connectDB = async () => {
    try {
        const dbURI =
        process.env.NODE_ENV === "production"
            ? process.env.MONGO_ATLAS_URI
            : process.env.MONGO_LOCAL_URI;

            const connection = await mongoose.connect(dbURI);
            const host = connection.connection.host || "unknown-host";
            const databaseName = connection.connection.name || "unknown-db";

            console.log(`MongoDB Connected: ${host}/${databaseName}`);
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
