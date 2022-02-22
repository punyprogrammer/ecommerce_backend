const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
//CREATE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE;
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Order has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});
//GET USER ORDERS
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    if (!Order)
      res.status(404).json({ success: false, msg: "Order not found!" });
    // const { password, ...others } = user._doc;
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});
//GET MONTHLY STATS

router.get("/stats/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$amount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});
module.exports = router;
