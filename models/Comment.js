var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({

    review: {
        type:String
    }

});

var Comment = mongoose.model("Comment", CommentSchema)