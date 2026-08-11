//start the server

//import dotenv — MUST be first so all process.env vars are available
//when app.js, db.js, and any other modules are required.
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

//Import app
const app = require("./app");
const connectDatabase = require("./db");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

//connect to database
connectDatabase();

//start the server

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise rejection");
  server.close(() => process.exit(1));
});