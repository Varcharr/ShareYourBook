let Book = require("../models/books");
let Comment =require("../models/comments");
let middleware = {};

middleware.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comId, function(err, comment){
        if (err) {
          req.flash("error","Database connection error! Sorry!");
          res.redirect("back");
        }
        else {
              if (comment.author.id.equals(req.user._id)) {
                next();
              }
              else {
                req.flash("error","You don't have premision to do that");
                res.redirect("back");
              }
            }
      });
  }
  else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
};

middleware.checkOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Book.findById(req.params.id, function(err, book){
      if (err) {
        req.flash("error","Database connection error! Sorry!");
        res.redirect("back");
      }
      else {
        if (book.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error","You don't have premision to do that");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
};

middleware.isLoogedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error","Please Login First!");
  res.redirect("/login");
};
middleware.admin = function(req, res, next){
  if (req.isAuthenticated()) {
    next();
    }
  else {
    req.flash("error","You don't have premision to do that!");
    res.redirect("/books");
  }
}

module.exports = middleware;
