import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: "./src/.env",
});

// (async function () {
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null; // Check if the file path is provided
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file uploaded to cloudinary", response);
    //ONCE THE FILE IS UPLOADED, REMOVE FROM OUR SERVER
    fs.unlinkSync(localfilepath);
    return response.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    fs.unlinkSync(localfilepath); // Delete the file if upload fails
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default uploadOnCloudinary();
