import Food from "../models/Food.js";
import User from "../models/User.js";

export const allRiderRequests = async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
};
export const allChefRequests = async (req, res) => {
  const adminId = req.user.user_id;

  const users = await User.find({
    _id: { $ne: adminId },
    chefStatus: { $in: ["pending", "approved"] },
  });

  return res.status(200).json(users);
};

export const createSingleUser = async (req, res) => {
  const { email, id, name, photoURL } = req.body.userInfo;
  console.log(email, id, name, photoURL);

  try {
    const isUser = await User.findOne({ uid: id });
    if (isUser)
      return res.status(200).json({ user: isUser, message: "user exist" });

    const newUser = await User.create({
      uid: id,
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
  const userId = req.params.id;
  try {
    const user = await User.findOne({
      uid: userId,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateSingleUser = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const userId = req.user.user_id;
    if (!phoneNumber) return;
    if (!userId) return res.status(400).json({ message: "no userId" });

    const query = { uid: userId };
    const options = { new: true, runValidators: true };
    const update = { $set: { phone: phoneNumber } };

    const user = await User.findOneAndUpdate(query, update, options);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const beComeChefFromUser = async (req, res) => {
  const userData = req.body.userData;
  const userId = req.user.user_id;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        role: { $in: ["user", "foodie"] },
        riderStatus: { $nin: ["approved", "pending"] },
        chefStatus: { $nin: ["approved", "pending"] },
      },
      {
        ...userData,
        chefStatus: "pending",
        chefRequestAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(400).json({ message: "Request already sent for chef" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
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
        riderRequestAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(400).json({ message: "Request already sent" });
    }

    return res.status(200).json(updatedUser);
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

export const chefRequestAccept = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    user.chefStatus = "approved";
    user.chefApprovedAt = Date.now();
    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const chefRequestReject = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await user.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
