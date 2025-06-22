import { Router } from "express";
import { registerUser, logoutUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleWARE.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = Router(); // Create a new Express router instance

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
); // Define a POST route for the register user at /register path

//secured Routes
router.route("/logout").post(verifyJwt, logoutUser);

export default router;
// This code defines a route for health check requests using Express.js.
// It imports the healthcheck function from the healthcheckController module and sets up a GET route at the root path ("/").
