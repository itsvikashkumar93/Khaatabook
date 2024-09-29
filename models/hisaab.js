const mongoose = require("mongoose");

const hisaabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  date: { type: Date, default: Date.now },
  desc: { type: String, required: true },
  encrypted: { type: Boolean, default: false },
  password: {
    type: String,
    required: function () {
      return this.encrypted;
    }, // Require password if encrypted is true
  },
  shareable: { type: Boolean, default: false },
  editPermission: {
    type: Boolean,
    default: false,
    validate: {
      validator: function () {
        return !this.editPermission || this.shareable; // editPermission can only be true if shareable is true
      },
      message: "Edit permission can only be set if the hisaab is shareable.",
    },
  },
});

// Pre-save hook to clear password if encrypted is false
hisaabSchema.pre("save", function (next) {
  if (!this.encrypted) {
    this.password = undefined; // Remove password if encryption is disabled
  }
  next();
});

module.exports = mongoose.model("hisaab", hisaabSchema);
