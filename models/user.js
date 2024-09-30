const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  hisaabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "hisaab" }],
});

// JOI validation schema
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Name must be at least 3 characters long",
      "any.required": "Name is required",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .lowercase()
      .trim()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    hisaabs: Joi.array(),
  });

  return schema.validate(user);
};


const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
  validateUser,
};
