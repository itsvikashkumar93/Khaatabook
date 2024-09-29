const express = require("express");
const router = express.Router();
const flash = require("connect-flash");

const userModel = require("../models/user");

router.get("/signin", (req, res) => {
  const signInMessage = req.flash("signInMessage");
  res.render("signin", {
    signInMessage: signInMessage.length > 0 ? signInMessage[0] : null,
  });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user && user.password === password) {
    req.session.user = user.email;
    req.flash("signInSuccess", "Login successfull");

    return res.redirect("/");
  } else {
    req.flash("signInMessage", "Invalid credentials");
    res.redirect("/signin");
  }
  // res.send(users);
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    req.flash("signInMessage", "You are an existing user, please sign in");
    return res.redirect("/signin");
  }

  const user = await userModel.create({ email, password });
  req.session.user = user.email;

  res.redirect("/");
});

module.exports = router;
