var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Nightmare = require('nightmare');
// var logger = require('morgan');

var PORT = process.env.PORT || 3000;

//require all models
var db = require('./models');

// //require nightmare function to scrape for JS Books
// var nightmare = require('./public/scrapejs')

//Initialize Express
var app = express();
//connect to MongoDB
mongoose.connect('mongodb://localhost/scrapeJSBooks')

//Configure middleware
//Use morgan logger for logging requests
// app.use( logger("dev") );

//Use body-parser for handling submissions/ POST
app.use(bodyParser.urlencoded({
    extended: true
}));

//use express.static to serve the public folder as static directory
app.use(express.static('public'));

require("./routes/apiRoutes")(app, db);
require("./routes/htmlRoutes")(app, db);


app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}......`);
})