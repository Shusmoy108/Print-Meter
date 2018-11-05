var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var logger = require("morgan");
var expressValidator = require("express-validator");
var session = require("express-session");
var reload = require("reload");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var configDB = require("./db.js");
mongoose.connect(configDB.url); // connect to our databasenodemon

var app = express();

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(expressValidator());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(
  session({
    path: "/",
    secret: "ilovescotchscotchyscotchscotch",
    cookie: { maxAge: 18000000 }
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in s
app.use("/public", express.static(__dirname + "/public"));

app.use(express.static(path.join(__dirname, "public")));
const printRouter = require("./routes/printmeterRouter");
app.use("/", printRouter);
// app.use(expressSession(
//     {secret: 'max', saveUninitialized: false, resave: false,   cookie: {
//             path: "/",
//         },}));

//introducing url in app.js

reload(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
