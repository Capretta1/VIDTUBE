import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JSON Web Token for authentication

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Remove whitespace
      lowercase: true,
      match: /.+\@.+\..+/, // Simple email validation regex
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6, // Minimum password length
      match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, // At least one uppercase, one lowercase, and one digit
    },
    fullname: {
      type: String,
      required: true,
      trim: true, // Remove whitespace
      minlength: 3, // Minimum length for full name
      maxlength: 50, // Maximum length for full name
      index: true, // Index for faster search
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video", // Reference to the Video model
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to hash the password before saving the user
// This middleware runs before saving a user document to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
  // If password is modified, hash it
  // Validate password length and complexity
  if (this.password.length < 6) {
    return next(new Error("Password must be at least 6 characters long"));
  }
  // Validate password complexity: at least one uppercase, one lowercase, and one digit
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(this.password)) {
    return next(
      new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
      ),
    );
  }
  this.password = await bcrypt.hash(
    this.password,
    10, //cryptography rounds
  ); // Hash the password before saving
  next(); // Proceed to the next middleware
});

// Method to check if the provided password matches the hashed password
// This method is used to verify the user's password during login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare the provided password with the hashed password
};

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
  // Generate an access token for the user
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.JWT_SECRET, // Use environment variable for secret key
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }, // Token expires in 1 hour
  );
};

// Method to generate a refresh token for the user
// This method is used to refresh the access token when it expires
userSchema.methods.refreshAccessToken = function () {
  // Generate an access token for the user
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_SECRET, // Use environment variable for secret key
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }, // Token expires in 1 hour
  );
};

export const User = mongoose.model("User", userSchema); // Export the User model
