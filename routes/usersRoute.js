import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  createSingleUser,
  beComeRiderFromUser,
  beComeChefFromUser,

  allRiderRequests,
  allChefRequests,
  chefRequestAccept,
  chefRequestReject
} from "../controllers/usersController.js";
import { verifyFirebaseToken } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/all", verifyFirebaseToken, getAllUsers);

router.post("/new", createSingleUser);
router.get("/get_user/:id", getSingleUser);
router.patch("/update_user/:id", verifyFirebaseToken, updateSingleUser);



router.put("/become_rider/:id", verifyFirebaseToken, beComeRiderFromUser);
router.put("/become_chef/:id", verifyFirebaseToken, beComeChefFromUser);
router.delete("/delete_user/:id", deleteSingleUser);

router.get("/rider_requests", verifyFirebaseToken, allRiderRequests);
router.get("/chef_requests", verifyFirebaseToken, allChefRequests);
router.patch("/chef_accept", verifyFirebaseToken, chefRequestAccept);
router.patch("/chef_reject", verifyFirebaseToken, chefRequestReject);

export default router;
