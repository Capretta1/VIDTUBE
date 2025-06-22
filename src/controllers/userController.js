import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Function to register a new user
// This function handles user registration by validating input, checking for existing users, uploading images to Cloudinary, and creating a new user in the database.
// It uses async/await for asynchronous operations and handles errors using a custom error class `apiError`.
// The function expects the request body to contain `fullName`, `email`, `username`, and `password` fields, and it handles file
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  //validation
  if (
    [fullName, email, username, password].some((field) => field?.trim === "")
  ) {
    throw new apiError(400, "full name is required");
  }

  //checking both username and email at the same time
  // const existedUser = await User.findOne(
  //     {
  //         $or: [{username}, {email}]
  //     }
  // )
  //check if username  already exist
  const existedUsername = await User.findOne(username);

  if (existedUsername) {
    throw new apiError(409, "username already exist");
  }

  //check if email already exist
  // Using a separate query for email to ensure clarity and separation of concerns
  // This allows for more specific error handling and clearer code structure.
  const existedEmail = await User.findOne(email);

  if (existedEmail) {
    throw new apiError(409, "Email already exist");
  }

  //Handling the images. not required for all tho
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!coverImageLocalPath) {
    throw new apiError(400, "Cover Image is missing");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // CREATING A USER IN THE DATABSE
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Selecting fields to exclude sensitive information from the response
  // This ensures that the response does not include the password or refresh token, enhancing security.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken ",
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registerd succesfully"));
});

// Function to generate an access token for a user
const generateAccessToken = async (userID) => {
  try {
    const findUser = await User.findById(userID); // Find the user by ID

    if (!findUser) {
      throw new apiError(404, "User not found"); // If user not found, throw an error
    }

    const accessToken = findUser.generateAccessToken(); // Generate an access token for the user
    const refreshToken = findUser.generateRefreshToken(); // Generate a refresh token for the user

    findUser.refreshToken = refreshToken; // Set the refresh token in the user document
    await findUser.save({ validateBeforeSave: false }); // Save the user document without validation
    return { accessToken, refreshToken }; // Return the access token and refresh token
  } catch (error) {
    throw new apiError(500, "Failed to generate access token"); // Handle any errors that occur during token generation
  }
};

// Function to log in a user
// This function handles user login by validating input, checking for existing users, verifying passwords, and generating access and refresh tokens.
// It uses async/await for asynchronous operations and handles errors using a custom error class `apiError`.
// The function expects the request body to contain `email` and `password` fields, and it returns the access token and user information in the response.
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "Email and password are required");
  }
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }
  // Check if the provided password matches the user's password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(401, "Invalid password");
  }
  // Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAccessToken(user._id);

  // Select fields to exclude sensitive information from the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // If the user is not found after login, throw an error
  // This ensures that the response does not include the password or refresh token, enhancing security.
  // This is important to ensure that the user object returned does not contain sensitive information.
  if (!loggedInUser) {
    throw new apiError(500, "Something went wrong");
  }
  // Set the refresh token in the user's document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false }); // Save the user document without validation
  // Return the access token and user information in the response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { accessToken, user },
        "User logged in successfully",
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(404, "Refresh token not found");
  }

  try {
    const decode = jwt.verify(incomingRefreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decode?._id);

    if (!user) {
      throw new apiError(404, "Invalid Refresh Token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new apiError(404, "Invalid Refresh Token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { newRefreshToken, accessToken },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new apiError(404, "Invalid Refresh Token");
  }
});

//
const logoutUser = asyncHandler(async (req, res) => {
  const findUser = await User
    .findByIdAndUpdate
    //TODO
    ();
});

export { registerUser, loginUser, refreshAccessToken };
