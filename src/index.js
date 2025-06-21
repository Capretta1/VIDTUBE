import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./src/.env",
}); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;

connectDB() // Connect to the database
  .then(() => {
    // Connect to the database
    app.listen(PORT, () => {
      // Start the server
      console.log(`Server is running on port ${PORT}`); // Log the server start
    });
  })
  .catch((error) => {
    // Handle connection errors
    console.log("Error connecting to the database:", error);
    process.exit(1); // Exit the process if the connection fails
  });
