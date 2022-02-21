const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_PASS
      ).toString(),
    });

    const savedUser = await newUser.save();
    res.status(200).json({ success: true, msg: "User successfully created!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json({ success: false, msg: "Invalid username" });
    const newPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_PASS
    ).toString(CryptoJS.enc.Utf8);
    newPassword !== req.body.password &&
      res
        .status(401)
        .json({ success: false, msg: "Invalid Password entered!" });
    //assign token
const accessToken=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY,{expiresIn:'3d'})
    const { password, ...others } = user._doc;
    res.status(200).json({ success: true, data: others,accessToken });
  } catch (error) {}
});
module.exports = router;
