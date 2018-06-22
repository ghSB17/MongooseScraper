var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var exphbs = require('express-handlebars');


var PORT = process.env.PORT || 3000;

// var nightmare = require('./public/scrapejs')

//Initialize Express
var app = express();
//connect to MongoDB

var db = require("./models");
mongoose.connect("mongodb://localhost/scrapeJSBooks", function (error) {
    if (error) console.log(error)
    else {
        console.log("mongoose connection is successful")
        //  db.Book.find({},function(err, docs){
        //      console.log("Here")
        //      console.log(docs)
        //  });
    }

})
//Configure middleware
//Use morgan logger for logging requests
app.use(logger("dev"));

//Use body-parser for handling submissions/ POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// // app.set("views", __dirname+"\\public\\views\\layouts");
// exphbs.ExpressHandlebars.prototype.layoutsDir =path.join(__dirname,"./public/views");

//use express.static to serve the public folder as static directory
app.use(express.static('public'));
app.engine("handlebars", exphbs({ defaultLayout : "main" }));
app.set("view engine", "handlebars");


// db.Book.find({},function(err, docs){
//     console.log(docs)
// });

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}......`);
})