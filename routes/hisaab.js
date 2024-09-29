const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user");
const hisaabModel = require("../models/hisaab");
const flash = require("connect-flash");

// Create Hisaab
router.get("/create", isLoggedIn, (req, res) => {
  res.render("create");
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const { title, desc, encrypted, password, shareable, editPermission } =
      req.body;
    console.log(req.body);

    const user = await userModel.findOne({ email: req.session.user });

    let newHisaab = new hisaabModel({
      title,
      user: user._id, // Assuming user is authenticated and available in `req.user`
      desc,
      encrypted: encrypted === "on" ? true : false,
      shareable: shareable === "on" ? true : false,
      editPermission: editPermission === "on" ? true : false,
    });

    if (newHisaab.encrypted && password) {
      const salt = await bcrypt.genSalt(10);
      newHisaab.password = await bcrypt.hash(password, salt);
    }

    user.hisaabs.push(newHisaab._id);

    await newHisaab.save();
    await user.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error saving Hisaab:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Show Hisaab
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    if (!hisaab) {
      return res.status(404).send("Hisaab not found");
    }

    // Check if Hisaab is encrypted
    if (hisaab.encrypted) {
      return res.render("hisaabPasswordPrompt", { hisaabId: hisaab._id });
    }

    res.render("hisaab", { hisaab });
  } catch (error) {
    console.error("Error fetching Hisaab:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Route to unlock the Hisaab
router.post("/:id/unlock", async (req, res) => {
  try {
    const { password } = req.body;
    const hisaab = await hisaabModel.findById(req.params.id);

    if (!hisaab) {
      return res.status(404).send("Hisaab not found");
    }

    if (hisaab.encrypted) {
      const isMatch = await bcrypt.compare(password, hisaab.password);

      if (!isMatch) {
        req.flash("errorMessage", "Incorrect password");
        return res.redirect("back");
      }
    }

    // If password is correct or Hisaab is not encrypted, render the Hisaab details
    res.render("hisaab", { hisaab });
  } catch (error) {
    console.error("Error unlocking Hisaab:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Hisaab
router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const hisaab = await hisaabModel.findOne({ _id: req.params.id });
  res.render("edit", { hisaab });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { title, desc } = req.body;
  const hisaab = await hisaabModel.findOneAndUpdate(
    { _id: req.params.id },
    { title, desc },
    { new: true }
  );
  res.redirect(`/hisaab/${req.params.id}`);
});

// Delete hisaab
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const hisaab = await hisaabModel.findOneAndDelete({ _id: req.params.id });
  const user = await userModel.findOne({ email: req.session.user });
  const index = user.hisaabs.indexOf(req.params.id);
  if (index !== -1) {
    user.hisaabs.splice(index, 1);
  }
  await user.save();
  res.redirect("/");
});

module.exports = router;
