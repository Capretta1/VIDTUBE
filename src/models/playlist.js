import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Import pagination plugin

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove whitespace
      minlength: 3, // Minimum length for title
      maxlength: 100, // Maximum length for title
    },
    description: {
      type: String,
      required: true,
      maxlength: 500, // Maximum length for description
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Video model
        ref: "Video", // Reference to the Video model
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Reference to the User model
      required: true, // Owner is required
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

playlistSchema.plugin(mongooseAggregatePaginate); // Apply pagination plugin to the playlist schema
export const Playlist = mongoose.model("Playlist", playlistSchema); // Export the Playlist model
