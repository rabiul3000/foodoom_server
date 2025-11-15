import Food from "../models/Food.js";
import User from "../models/User.js";

export const createSingleUser = async (req, res) => {
  const { email, id, name, photoURL } = req.body.userInfo;
  console.log(email, id, name, photoURL);

  try {
    const isUser = await User.findOne({ _id: id });
    if (isUser)
      return res.status(200).json({ user: isUser, message: "user exist" });

    const newUser = await User.create({
      _id: id,
      email,
      name,
      photoURL,
    });

    return res.status(201).json({ user: newUser, message: "user created" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const foods = await Food.find();
    return res.status(200).json(foods);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getSingleUser = async (req, res) => {
  const foodId = req.params.id;
  try {
    const user = await User.findById(foodId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateSingleUser = async (req, res) => {
  const userData = req.body.userData;
  const userId = req.user.user_id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...userData, riderStatus: "pending" } },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const beComeRiderFromUser = async (req, res) => {
  const userData = req.body.userData;
  const userId = req.user.user_id;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        riderStatus: { $nin: ["admin", "pending"] },
      },
      {
        ...userData,
        riderStatus: "pending",
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(400).json({ message: "Request already sent" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSingleUser = async (req, res) => {
  const foodId = req.params.id;
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
