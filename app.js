const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const methodOverride = require("method-override");
const Book        = require("./models/books");
const User        = require("./models/users");
const Comment     = require("./models/comments");
const passport    = require("passport");
const flash       = require("connect-flash");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const seedDB = require("./seeds.js");

//requiring routes
let commentRoutes = require("./routes/comments");
let bookRoutes = require("./routes/books");
let indexRoutes = require("./routes/index");

//Seed DB
//seedDB();



//PASSPORT CONFIGURATION
app.use(expressSession({
  secret:"Don't be late for school again boy",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(bookRoutes);
app.use(indexRoutes);
app.use(commentRoutes);

//DB CONNECTION
mongoose.connect("mongodb://localhost/syb11");


app.listen(process.env.PORT || 3000, function(){
  console.log("=========================");
  console.log("SERVER WORKING");
  console.log("=========================");
});
