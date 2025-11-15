import express from "express";
import { getAllFoods, getSingleFood, updateSingleFood, deleteSingleFood, createSingleFood } from "../controllers/foodsController.js";

const router = express.Router();

router.get("/", getAllFoods);

router.get("/:id", getSingleFood);
router.patch("/:id", updateSingleFood);
router.delete("/:id", deleteSingleFood);
router.post("/", createSingleFood);

export default router;
