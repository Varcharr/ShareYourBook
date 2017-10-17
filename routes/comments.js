let express = require("express");
let router = express.Router({mergeParams:true});
let Book = require("../models/books");
let Comment = require("../models/comments");
let middleware = require("../middleware/index");


//Comment form
router.get("/books/:id/comments/new", middleware.isLoogedIn, function(req, res){
  Book.findById(req.params.id, function(err, book){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new",{book:book});
    }
  })
});
//Comment logic
router.post("/books/:id/comments", middleware.isLoogedIn, function(req, res){
  Book.findById(req.params.id, function(err, book){
    if (err) {
      res.redirect("/books");
    }
    else {
      Comment.create({author:req.body.comment.author, text:req.body.comment.text}, function(err, comment){
        if (err) {
          req.flash("error","Something went wrong");
          console.log(err);
        }
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          book.comments.push(comment);
          book.save();
          req.flash("sucess","Successfully added comment");
          res.redirect("/books/" + book._id);
        }
      })
    }
  });
});
//Edit form
router.get("/books/:id/comments/:comId/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comId, function(err, comment){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/edit",{bookId:req.params.id,comment:comment});
    }
  })
});
//Edit logic
router.put("/books/:id/comments/:comId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comId, req.body.comment, function(err, comment){
    if (err) {
      console.log(err);
    }
    else {
      console.log(comment);
      res.redirect("/books/"+req.params.id);
    }
  });
});
//Delete
router.delete("/books/:id/comments/:comId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comId, function(err){
    if (err) {
      console.log(err);
      res.redirect("/books/"+req.params.id);
    }
    else {
      req.flash("success","Comment deleted");
      res.redirect("/books/"+req.params.id);
    }
  })
});

module.exports = router;
