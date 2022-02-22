const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
//CREATE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE;
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Cart has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});
//GET USER CART
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    if (!Cart) res.status(404).json({ success: false, msg: "Cart not found!" });
    // const { password, ...others } = user._doc;
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

//GET ALL USER CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({success:true,data:carts})
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

module.exports = router;
