import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, // Content is required
      trim: true, // Remove whitespace
      maxlength: 280, // Maximum length for tweet content
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Reference to the User model
      required: true, // Owner is required
    },
  },
  { timestamps: true }, // Automatically manage createdAt and updatedAt fields
);

tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet = mongoose.model("Tweet", tweetSchema); // Export the Tweet model
