const mongoose=require("mongoose");

//BOOK SCHEMA SETUP
let bookSchema = new mongoose.Schema(
  { title:String,
    image:String,
    created:{type:Date, default:Date.now},
    author:{
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      username:String
    },
    description:String,
    comments:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
      }
    ]
  });
let Book = mongoose.model("Book",bookSchema);


module.exports = mongoose.model("Book",bookSchema);
