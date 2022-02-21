const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute=require("./routes/product")
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
//enable json parsing
app.use(express.json());
//addroutes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product",productRoute)
// app.use("/api/v1/user", userRoute);
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running !");
});
