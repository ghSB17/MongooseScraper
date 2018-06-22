var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new BookSchema object
// This is similar to a Sequelize model
var BookSchema = new Schema({
  // `name` must be of type String
  // `name` must be unique, the default mongoose error message is thrown if a duplicate value is given
  title: {
    type: String,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  imgSrc: {
      type: String
  },
  price: {
      type: String
  },
  // `Comments` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Comment model
  // This allows us to populate the Book with any associated Comments
  Comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Book = mongoose.model("Book", BookSchema);

// Export the Library model
module.exports = Book;
