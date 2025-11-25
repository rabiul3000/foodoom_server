import mongoose from "mongoose";
// email, id, name, photoURL, role
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
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
  chefStatus: {
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
});

const User = mongoose.model("user", userSchema);

export default User;
