import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Import pagination plugin
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Remove whitespace
      minlength: 3, // Minimum length for title
      maxlength: 100, // Maximum length for title
    },
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500, // Maximum length for description
    },
    views: {
      type: Number,
      default: 0, // Default view count is zero
    },
    duration: {
      type: Number,
      required: true, // Duration of the video in seconds
      min: 0, // Duration cannot be negative
    },
    likes: {
      type: Number,
      default: 0, // Default like count is zero
    },
    isPublished: {
      type: Boolean,
      default: true, // Default is published
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Reference to the User model
      required: true, // Owner is required
    },
    dislikes: {
      type: Number,
      default: 0, // Default dislike count is zero
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

videoSchema.plugin(mongooseAggregatePaginate); // Apply pagination plugin to the video schema
export const Video = mongoose.model("Video", videoSchema); // Export the Video model
