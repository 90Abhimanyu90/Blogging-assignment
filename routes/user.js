const express = require("express");
const User = require("../models/user");
const { createToken } = require("../services/authentication");

const router = express.Router();

// Signup route
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({ fullName, email, password });
    return res.redirect("/user/signin");
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(400).send("Error in signup: " + error.message);
  }
});

// Signin route
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // cookie me token save karo
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/");
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(400).send("Error in signin: " + error.message);
  }
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
