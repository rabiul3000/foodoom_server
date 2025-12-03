import express from "express";
import {
  cancelPayment,
  failPayment,
  paySingleOrder,
  successPayment,
} from "../controllers/paymentsController.js";

const router = express.Router();

router.post("/new", paySingleOrder);
router.post("/success", successPayment);
router.post("/fail", failPayment);
router.post("/cancel", cancelPayment);

export default router;
