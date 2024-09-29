const mongoose = require("mongoose");
const debuglog = require("debug")("development:mogooseconfig");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

module.exports = db;
