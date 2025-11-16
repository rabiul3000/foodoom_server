import Order from "../models/Order.js";
import SSLCommerzPayment from "sslcommerz-lts";
import User from "../models/User.js";
import admin from "../config/firebaseAdmin.js";
import { clientURL, CURRENT_SERVER_URL } from "../constants.js";

export const paySingleOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findById(orderId).populate("userId", "name email");
  const store_id = "rolis68ecbe300bdfb";
  const store_passwd = "rolis68ecbe300bdfb@ssl";
  const is_live = false;

  const user = order.userId; // populated user document

  const data = {
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: crypto.randomUUID(),

    // Payment callback URLs
    success_url: `${CURRENT_SERVER_URL}/payments/success?orderId=${order._id}`,
    fail_url: `${CURRENT_SERVER_URL}/payments/fail?orderId=${order._id}`,
    cancel_url: `${CURRENT_SERVER_URL}/payments/cancel?orderId=${order._id}`,
    ipn_url: `${CURRENT_SERVER_URL}/payments/ipn`,

    // Product / service info
    shipping_method: "Food Delivery",
    product_name: `Food Order #${order._id}`, // helpful for identifying order in payment logs
    product_category: "Food & Beverages",
    product_profile: "restaurant", // better than "general" for food orders

    // ✅ Customer info from populated User model
    cus_name: user.name || "Foodie Customer",
    cus_email: user.email || "customer@example.com",
    cus_add1: order.deliveryAddress || "Gazipur",
    cus_add2: "",
    cus_city: order.deliveryCity || "Gazipur",
    cus_state: "Bangladesh",
    cus_postcode: order.postcode || "1701",
    cus_country: "Bangladesh",
    cus_phone: user.phone || "017XXXXXXXX",
    cus_fax: "",

    // ✅ Shipping info (mirrors customer)
    ship_name: user.name || "Foodie Customer",
    ship_add1: order.deliveryAddress || "Gazipur",
    ship_city: order.deliveryCity || "Gazipur",
    ship_postcode: order.postcode || "1701",
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then(({ GatewayPageURL }) => {
    res.status(200).json({ url: GatewayPageURL });
  });
};

export const successPayment = async (req, res) => {
  try {
    const { orderId } = req.query;
    const paymentData = req.body; // SSLCommerz sends payment details in POST body

    if (!orderId) return res.redirect(`${clientURL}/payment/fail/${orderId}`);

    const order = await Order.findById(orderId);
    if (!order) return res.redirect(`${clientURL}/payment/fail/404`);

    const user = await User.findById(order.userId);
    if (!user) return res.redirect(`${clientURL}/payment/fail/404`);

    // Extract payment details from SSLCommerz response
    const {
      tran_id,
      card_type,
      store_amount,
      tran_date,
      bank_tran_id,
      card_issuer,
      card_no,
      val_id,
      risk_level,
    } = paymentData;

    // Update order record
    order.paymentStatus = "paid";
    order.paymentMethod = card_type || "SSLCommerz";
    order.transactionId = tran_id;
    order.bankTranId = bank_tran_id;
    order.paymentDate = tran_date;
    order.cardIssuer = card_issuer;
    order.riskLevel = risk_level;
    order.storeAmount = store_amount;
    order.validationId = val_id;
    order.maskedCard = card_no;
    await order.save();

    // ✅ Update user role only if not already a foodie
    if (user.role !== "foodie") {
      user.role = "foodie";
      await user.save();
    }

    // ✅ Update User role in Firebase
    try {
      if (user.role !== "foodie") {
        await admin.auth().setCustomUserClaims(user._id, { role: "foodie" });
        console.log(`Firebase role updated for ${user.email}`);
      }
    } catch (firebaseError) {
      console.error("Firebase role update failed:", firebaseError);
    }

    res.redirect(`${clientURL}/payment/success/${orderId}`);
  } catch (error) {
    console.error(error);
    res.redirect(`${clientURL}/payment/fail/500`);
  }
};

export const failPayment = async (req, res) => {
  res.redirect(`${clientURL}/payment/fail/404`);
};

export const cancelPayment = async (req, res) => {
  res.redirect(`${clientURL}/payment/cancel`);
};
