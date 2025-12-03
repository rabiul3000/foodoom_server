import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  name: String,
  piece: Number,
  unit_price: Number,
  total_price: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "cooking", "onway","delivered", "cancelled"],
      default: "pending",
    },
    transactionId: String,
    bankTranId: String,
    validationId: String,
    paymentDate: String,
    cardIssuer: String,
    maskedCard: String,
    riskLevel: String,
    storeAmount: String,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
