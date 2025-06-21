import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Set this in your .env file
    credentials: true, // Allow credentials if needed
  }),
);
// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: "16kb" })); // Set a limit for JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Set a limit for URL-encoded payloads
app.use(express.static("public")); // Serve static files from the "public" directory. Images or anything locally
app.use(cookieParser()); // Middleware to parse cookies
// Middleware to parse cookies, useful for handling authentication tokens or session IDs

// import routes

import healthcheckRoutes from "./routes/healthcheckRoutes.js"; // Import the health check routes
//routes
app.use("/healthcheck", healthcheckRoutes); // Use the health check routes

export { app };
