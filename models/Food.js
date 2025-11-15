import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },

  rating: {
    type: Number,
  },
  ingredients: {
    type: Array,
  },

  piece: {
    type: Number,
  },
});

const Food = mongoose.model("food", foodSchema);

export default Food;
