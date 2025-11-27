import mongoose from "mongoose";
// email, id, name, photoURL, role
const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "foodie", "rider", "admin", "chef"],
      default: "user",
    },

    riderStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
        "banned",
        "inactive",
        "top",
        "featured",
      ],
    },

    riderRequestAt: { type: Number },
    riderApprovedAt: { type: Number },

    chefStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
        "banned",
        "active",
        "inactive",
        "top",
        "featured",
      ],
    },
    restaurantName: {
      type: String,
    },

    chefRequestAt: { type: Number },
    chefApprovedAt: { type: Number },

    address: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    nidNumber: {
      type: String,
    },
    phone: {
      type: String,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "bicycle", "scooter", "car", "other"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);



