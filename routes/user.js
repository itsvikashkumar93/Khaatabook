const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const { userModel, validateUser } = require("../models/user");

router.get("/signin", (req, res) => {
  const signInMessage = req.flash("signInMessage");
  res.render("signin", {
    signInMessage: signInMessage.length > 0 ? signInMessage[0] : null,
  });
});

router.get("/signup", (req, res) => {
  const signUpMessage = req.flash("signUpMessage");
  const signInMessage = req.flash("signInMessage");

  res.render("signup", {
    signUpMessage: signUpMessage.length > 0 ? signUpMessage[0] : null,
    signInMessage: signInMessage.length > 0 ? signInMessage[0] : null,
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (user === null) {
    req.flash("signInMessage", "Please create an account first");
    return res.redirect("/signup");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (user && isMatch) {
    req.session.user = {
      _id: user._id,
      email: email,
    };
    req.flash("signInSuccess", "Login successfull");
    return res.redirect("/");
  } else {
    req.flash("signInMessage", "Invalid password");
    res.redirect("/signin");
  }
  // res.send(users);
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      req.flash("signInMessage", "You are an existing user, please sign in");
      return res.redirect("/signin");
    }

    const { error } = validateUser({ name, email, password });

    if (error) {
      req.flash("signUpMessage", error.details[0].message);
      return res.redirect("/signup");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    req.session.user = {
      _id: user._id,
      email: email,
    };

    res.redirect("/");
  } catch (error) {
    req.flash(
      "signUpMessage",
      "There was an error signing up. Please try again."
    );
    return res.redirect("/signup");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
