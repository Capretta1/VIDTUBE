import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Import pagination plugin

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Reference to the User model
      required: true, // Subscriber is required
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model (channel owner)
      ref: "User", // Reference to the User model
      required: true, // Channel is required
    },
  },

  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

subscriptionSchema.plugin(mongooseAggregatePaginate); // Apply pagination plugin to the subscription schema
export const Subscription = mongoose.model("Subscription", subscriptionSchema); // Export the Subscription model
