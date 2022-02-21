const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_PASS
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "User has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});
//GET USER
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ success: false, msg: "User not found!" });
    const { password, ...others } = user._doc;
    res.status(200).json({ success: true, data: others });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong!" });
  }
});
//GET USER STATS
router.get("/info/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
