const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8000;

//mongodb connect
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Conected  to MongoDB"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//model
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("server is running");
});

//api signup
app.post("/signup", async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  userModel
    .findOne({ email: email })
    .then((result) => {
      if (result) {
        res.send({
          message: "Email address is already registered",
          alert: false,
        });
      } else {
        const data = userModel(req.body);
        const save = data.save();
        res.send({ message: "Successfully Registered", alert: true });
      }
    })
    .catch((err) => console.log(err));
});

//api login

app.post("/login", (req, res) => {
  console.log(req.body);

  const { email } = req.body;
  const { password } = req.body;

  userModel.findOne({ email: email, password: password }).then((result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Please enter a valid email or password",
        alert: false,
      });
    }
  });
});

//api product
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(data);
});

//product backend

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", productSchema);

//save product in db
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);

  const data = await productModel(req.body);
  const dataSave = await data.save();

  res.send({ message: "Product added successfully" });
});

//listen
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

//mongodb

//username-vkgEcommerce
//password-vkE1
