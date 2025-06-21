import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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

export { registerUser };
