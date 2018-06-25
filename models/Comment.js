var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({

    // _bookId: {
    //     type:Schema.Types.ObjectId,
    //     ref:'Book'
    // },
    review: {
        type:String,
        required:true
    }

});

var Comment = mongoose.model("Comment", CommentSchema)

module.exports = Comment