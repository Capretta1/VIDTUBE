import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router(); // Create a new Express router instance

router.route("/register").post(registerUser); // Define a POST route for the register user at /register path

export default router;
// This code defines a route for health check requests using Express.js.
// It imports the healthcheck function from the healthcheckController module and sets up a GET route at the root path ("/").
