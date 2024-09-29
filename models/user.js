const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  hisaabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "hisaab" }],
});

module.exports = mongoose.model("user", userSchema);
