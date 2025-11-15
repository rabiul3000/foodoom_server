import Food from "../models/Food.js";

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    return res.status(200).json(foods);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getSingleFood = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    return res.status(200).json(food);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateSingleFood = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSingleFood = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSingleFood = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
