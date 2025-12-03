import Food from "../models/Food.js";
import Order from "../models/Order.js";

export const confirmOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const prevOrderStatus = req.body.prevOrderStatus;
    console.log("Previous Order Status:", prevOrderStatus);

    if (prevOrderStatus !== "pending") {
      return res.status(400).json({ message: "order status is not valid" });
    }

    // Correct query: match ID AND orderStatus: 'pending'
    const query = { _id: orderId, orderStatus: "pending" };
    const update = { orderStatus: "confirmed" };
    const options = { new: true };

    // Use findOneAndUpdate instead of findByIdAndUpdate
    const updatedOrder = await Order.findOneAndUpdate(query, update, options);

    if (!updatedOrder) {
      return res
        .status(400)
        .json({ message: "Order not found or already processed" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while confirming the order." });
  }
};

export const cookingOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const query = { _id: orderId, orderStatus: "confirmed" };
    const update = { orderStatus: "cooking" };
    const options = { new: true };

    const updatedOrder = await Order.findByIdAndUpdate(query, update, options);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while confirming the order." });
  }
};

export const onwayOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const query = { _id: orderId, orderStatus: "cooking" };
    const update = { orderStatus: "onway" };
    const options = { new: true };

    const updatedOrder = await Order.findByIdAndUpdate(query, update, options);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while confirming the order." });
  }
};
export const deliverOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const query = { _id: orderId, orderStatus: "cooking" };
    const update = { orderStatus: "delivered" };
    const options = { new: true };

    const updatedOrder = await Order.findByIdAndUpdate(query, update, options);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while confirming the order." });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const query = {
      _id: orderId,
      orderStatus: { $in: ["pending", "confirmed", "cooking"] },
    };
    const update = { orderStatus: "delivered" };
    const options = { new: true };

    const updatedOrder = await Order.findByIdAndUpdate(query, update, options);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while confirming the order." });
  }
};

// ----------------------------------------------------------

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId");
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

export const getFilteredOrders = async (req, res) => {
  const userId = req.body.userId;
  const status = req.body.filterValue;

  try {
    if (status !== "all") {
      let query = { userId };
      query.$or = [{ orderStatus: status }, { paymentStatus: status }];
      const orders = await Order.find(query);

      return res.status(200).json({ orders });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createSingleOrder = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.user_id; // Firebase UID (from verified token)
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty" });
    }

    // 🧮 Calculate total server-side (secure)
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.unit_price * item.piece,
      0
    );

    // 🧩 Build structured cartItems for DB
    const cartItems = cart.map((item) => ({
      foodId: item._id,
      name: item.name,
      quantity: item.piece,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.piece,
      image: item.image,
      piece: item.piece,
    }));

    // 🕒 Create expiration time (auto-delete unpaid orders)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now

    // 💾 Create and save new order
    const newOrder = new Order({
      userId,
      cartItems,
      totalAmount,
      paymentStatus: "unpaid",
      orderStatus: "pending",
      expiresAt,
    });

    await newOrder.save();

    // ✅ Send success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) return;
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getSingleOrder = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    return res.status(200).json(food);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateSingleOrder = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Success response
    res.status(200).json({
      deletedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
