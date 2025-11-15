import mongoose from "mongoose";

const mongodbConnect = () => {
  mongoose.connect(process.env.MONGODB_URI);

  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  db.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
};

export default mongodbConnect;
