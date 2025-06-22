import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    throw new apiError(401, "Unauthorized");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const getUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );
    if (!getUser) {
      throw new apiError(401, "Unauthorized");
    }
    req.user = getUser;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Access Token");
  }
});
