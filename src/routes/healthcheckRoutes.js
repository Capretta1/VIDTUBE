import { Router } from "express";
import { healthcheck } from "../controllers/healthcheckController.js";

const router = Router(); // Create a new Express router instance

router.route("/").get(healthcheck); // Define a GET route for the health check at the root path

export default router;
// This code defines a route for health check requests using Express.js.
// It imports the healthcheck function from the healthcheckController module and sets up a GET route at the root path ("/").
