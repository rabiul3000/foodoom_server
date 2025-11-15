import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user info to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyUser = async (req, res, next) => {
  const _id = req.user.uid;

  if (!_id) {
    return res.status(401).json({ message: "no user data found" });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "auth conflict" });
    }
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
