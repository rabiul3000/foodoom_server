import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  createSingleUser,
  beComeRiderFromUser,
} from "../controllers/usersController.js";
import { verifyFirebaseToken } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/new", createSingleUser);
router.get("/:id", getSingleUser);
router.put("/:id", verifyFirebaseToken, updateSingleUser);
router.put("/become_rider/:id", verifyFirebaseToken, beComeRiderFromUser);
router.delete("/:id", deleteSingleUser);

export default router;
