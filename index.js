const path = require("path");
const express = require("express");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 9000;
mongoose.connect("mongodb://localhost:27017/Blogify").then(e=> console.log("Mongodb connected"));
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));



app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


app.get("/",(req,res)=>{
  console.log("USer in / route",req.user);
  res.render("home",{
    user : req.user,
  });
});
app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.listen(PORT,()=> console.log(`Server Started at PORT:${PORT}`));