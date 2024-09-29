const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

module.exports = db;
