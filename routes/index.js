let express = require("express");
let router = express.Router();
let User = require("../models/users");
let passport = require("passport");

//Root route
router.get("/", function(req,res){
  res.render("landing");
});

//Register form
router.get("/register",function(req, res){
  res.render("users/register");
});
//Register logic
router.post("/register", function(req, res){
  let newUser = new User({username:req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      req.flash("error",err.message);
      return res.redirect("back");
    }
      passport.authenticate("local")(req, res, function(){
      req.flash("success","Welcome "+user.username);
      res.redirect("/books");
    });
  });
});

//login form
router.get("/login", function(req, res){
  res.render("users/login");
});
//Login logic
router.post("/login", passport.authenticate("local",{
  successRedirect: "/books",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res){
});

//Logout
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success","Logged out!");
  res.redirect("/books");
});

module.exports = router;
