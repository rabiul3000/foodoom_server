import express from "express";
import {
  getAllOrders,
  getSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
  createSingleOrder,
  getFilteredOrders,
  
  getAllOrdersForAdmin,
  confirmOrderByAdmin,
  cookingOrderByAdmin,
  onwayOrderByAdmin,
  deliverOrderByAdmin,
  cancelOrderByAdmin,

} from "../controllers/ordersController.js";
import { verifyFirebaseToken, verifyUser } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.patch('/confirm_order',verifyFirebaseToken, verifyUser, confirmOrderByAdmin)
router.patch('/cooking_order',verifyFirebaseToken, verifyUser, cookingOrderByAdmin)
router.patch('/onway_order',verifyFirebaseToken, verifyUser, onwayOrderByAdmin)
router.patch('/delivered_order',verifyFirebaseToken, verifyUser, deliverOrderByAdmin)
router.patch('/cancel_order',verifyFirebaseToken, verifyUser, cancelOrderByAdmin)


router.get("/all_orders_admin/:page_number", getAllOrdersForAdmin);
router.get("/:userId", verifyFirebaseToken, verifyUser, getAllOrders);
router.get("/:orderId", getSingleOrder);
router.patch("/:orderId", updateSingleOrder);
router.delete("/:orderId", deleteSingleOrder);
router.post("/filterOrders", getFilteredOrders);
router.post("/new", verifyFirebaseToken, verifyUser, createSingleOrder);



export default router;
