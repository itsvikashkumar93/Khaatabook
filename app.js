const express = require("express");
const app = express();
const path = require("path");
const mongooseConnection = require("./config/mongoose");
const expressSession = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

require("dotenv").config();

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(flash());

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const hisaabRouter = require("./routes/hisaab");
const isLoggedIn = require("./middlewares/isLoggedIn");

// HomePage

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/hisaab", hisaabRouter);

app.listen(process.env.PORT || 3000);
