import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  createSingleUser,
  beComeRiderFromUser,
  allRiderRequests,
  beComeChefFromUser
} from "../controllers/usersController.js";
import { verifyFirebaseToken } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/all", verifyFirebaseToken, getAllUsers);

router.post("/new", createSingleUser);
router.get("/get_user/:id", getSingleUser);
router.put("/update_user/:id", verifyFirebaseToken, updateSingleUser);
router.put("/become_rider/:id", verifyFirebaseToken, beComeRiderFromUser);
router.put("/become_chef/:id", verifyFirebaseToken, beComeChefFromUser);
router.delete("/delete_user/:id", deleteSingleUser);

router.get("/rider_requests", verifyFirebaseToken, allRiderRequests);

export default router;
