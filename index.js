const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const stripeRoute = require("./routes/stripe");
//enable dotenv
dotenv.config();
//connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => console.log(err));
//
//cors
app.use(cors());
//enable json parsing

app.use(express.json());
//addroutes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);
 app.use("/api/v1/user", userRoute);
app.use("/api/v1/checkout",stripeRoute);
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running !");
});
