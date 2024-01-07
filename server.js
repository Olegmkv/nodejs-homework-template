import app from "./app.js"
import mongoose from "mongoose";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    });
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);  
  })



// const app = require('./app')

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
