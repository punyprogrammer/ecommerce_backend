const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
