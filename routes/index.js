const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user");
const flash = require("connect-flash");

router.get("/", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.session.user })
    .populate("hisaabs");

  const errorMessage = req.flash("errorMessage");
  const signInSuccess = req.flash("signInSuccess");

  res.render("index", {
    hisaabs: user.hisaabs,
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
    signInSuccess: signInSuccess.length > 0 ? signInSuccess[0] : null,
  });
});

module.exports = router;
// { hisaabs: req.session.user.hisaabs }
