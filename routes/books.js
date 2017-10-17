let express = require("express");
let router = express.Router();
let Book = require("../models/books");
let middleware = require("../middleware/index");

//Index
router.get("/books", function(req,res){
  //Get books from DB
  Book.find({},function(err,allBooks){
    if (err) {
      console.log("Error");
        console.log(err);
    }
    else {
      res.render("books/index",{books:allBooks});
    }
  });
});
//Create
router.post("/books", middleware.isLoogedIn, function(req,res){
  //Save book to DB
  let author = {id:req.user._id, username:req.user.username};
  let book={title:req.body.book.title, image:req.body.book.image, description:req.body.book.description, author:author};
  Book.create(book,function(err,book){
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/books");
    }
  })
});
//NEW - BOOKS FORM
router.get("/books/new", middleware.isLoogedIn, function(req,res){
    res.render("books/new");
});

router.get("/books/:id/vitamin", middleware.admin, function(req, res){
  Book.findById(req.params.id).populate("comments").exec(function(err,book){
    if(err)
    {
      console.log(err);
    }
    else {
      res.render("books/vitamin",{book:book});
    }
  });
});
//SHOW
router.get("/books/:id", function(req,res){
  Book.findById(req.params.id).populate("comments").exec(function(err,book){
    if(err)
    {
      console.log(err);
    }
    else {
      res.render("books/show",{book:book});
    }
  });
});
//EDIT
router.get("/books/:id/edit", middleware.checkOwnership, function(req, res){
    Book.findById(req.params.id, function(err, book){
          res.render("books/edit",{book:book});
    });
});

router.put("/books/:id", middleware.checkOwnership, function(req, res){
  Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, book){
    if (err) {
      console.log(err);
      res.redirect("/books");
    }
    else {
      res.redirect("/books/"+req.params.id);
    }
  })
});

//DELETE
router.delete("/books/:id", middleware.checkOwnership, function(req, res){
  Book.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      console.log(err);
    }
    else {
      req.flash("success","Book deleted");
      res.redirect("/books");
    }
  });
});




module.exports = router;
