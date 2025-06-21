import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Import pagination plugin
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, // Content is required
      trim: true, // Remove whitespace
    },
    video: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Video model
      ref: "Video", // Reference to the Video model
      required: true, // Video is required
    },
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
commentSchema.plugin(mongooseAggregatePaginate); // Apply pagination plugin to the comment schema
export const Comment = mongoose.model("Comment", commentSchema); // Export the Comment model
