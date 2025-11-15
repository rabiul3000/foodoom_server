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
    userId: { type: String, required: true },
    cartItems: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    bankTranId: {
      type: String,
      default: null,
    },
    validationId: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: String,
      default: null,
    },
    cardIssuer: {
      type: String,
      default: null,
    },
    maskedCard: {
      type: String,
      default: null,
    },
    riskLevel: {
      type: String,
      default: null,
    },
    storeAmount: {
      type: String,
      default: null,
    },
    paymentMethod: { type: String, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
