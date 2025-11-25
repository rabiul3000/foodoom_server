import express from "express";
import {
  getAllOrders,
  getSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
  createSingleOrder,
  getFilteredOrders,
  getAllOrdersForAdmin,
} from "../controllers/ordersController.js";
import { verifyFirebaseToken, verifyUser } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/all_orders_admin", getAllOrdersForAdmin);
router.get("/:userId", getAllOrders);
router.get("/:orderId", getSingleOrder);
router.patch("/:orderId", updateSingleOrder);
router.delete("/:orderId", deleteSingleOrder);
router.post("/filterOrders", getFilteredOrders);
router.post("/new", verifyFirebaseToken, verifyUser, createSingleOrder);

export default router;
