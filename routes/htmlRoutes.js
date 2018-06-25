var scrape = require("../scripts/scrape")
var db = require("../models")


module.exports = function (app) {

    app.get("/all", function (req, res) {
        db.Book.find({}, function (err, bookDocs) {
            console.log("GET ALL:results received")
            // console.log(bookDocs)
            // res.json(bookDocs)
            console.log("Using Render!!")
            res.render('books', {
                books: bookDocs
            });
        })
    })

    app.get("/scrapeAN", function (req, res) {
        console.log("In scrapeAN")
        db.Book.find({}, function (err, documents) {
            if (err) console.log(err)
            var newData = []

            scrape(function (data) {
                var count = 0
                if (documents == undefined) {
                    console.log("UNdefined")
                    count = data.length
                    newData = data
                } else if (documents.length != 0) {
                    console.log(`more than 0, ${documents.length}`)
                    for (var i = 0; i < data.length; i++) {
                        var flag = false
                        for (j = 0; j < documents.length; j++) {
                            if (documents[j].title == data[i].title)
                                flag = true
                        }
                        if (!flag) {
                            count++
                            newData.push(data[i])
                        }
                    }
                    console.log(`found ${newData.length} new documents`)
                } else {
                    console.log(`the collections is empty---!!`)
                    newData = data
                    count = data.length
                }
                if (count > 0) {

                    console.log(`how many in collection now!! --${count}`)
                    db.Book.insertMany(newData).then(function (error, results) {
                        if (error) console.log(error)
                        console.log(`insert NEW Docs`)
                        res.redirect("/all");
                    })
                } else {
                    console.log(`no new STUFF FOUND!!`)
                    res.redirect("/all")
                }
            })
        })

    })

    app.get("/something/:id", function (req, res) {
        console.log(`CAME HERE with NUmber ${req.params.id}`)
    })

    app.get("/jsbook/:ID", function (req, res) {
        console.log("IS THIS TRIGGERED NOW!!")
        db.Book.find({
            "_id": (req.params.ID)
        }).populate('reviews').exec(function (err, data) {
            if (err)
                console.log("in error")
            console.log(JSON.stringify(data))
            res.render('comment', data[0])
        })
        // scrapeBkWC(req.params.ID)
        // res.render('comment', {value:req.params.link + ":" + req.params.ID})
    })

    app.get("/delReview/:ID/:bookID", function (req, res) {

        db.Comment.deleteOne({
            "_id": req.params.ID
        }).exec(function (err, docs) {
            if (err)
                console.log(err)
            else {
                db.Book.findByIdAndUpdate(req.params.bookID, {
                    $pull: {
                        reviews: req.params.ID
                    }
                }, {
                    new: true
                }, function (error, response) {
                    if (error) res.json(error)
                    else res.redirect("/all")
                })
            }
        })
    })

    app.post("/Submit/:bookID", function (req, res) {
        // console.log(req.body)
        // res.send(req.params.ID )
        db.Comment.create({
            review: req.body.body
        }, function (err, doc) {
            if (err) console.log(err)
            else {
                db.Book.findByIdAndUpdate(req.params.bookID, {
                    $push: {
                        reviews: doc._id
                    }
                }, {
                    new: true
                }, function (error, response) {
                    if (error) res.json(error)
                    else res.redirect("/all")
                })
            }
        })
    })

    app.get("/", function (req, res) {
        console.log("IN GET / ")
        res.redirect("/all")
    })

    function scrapeBkWC(id, cb) {
        db.Book.find({
            _id: id
        }, function (error, bookDoc) {
            if (error) console.log(error)
            if (bookDoc.Comments.length > 0) {}
        })
    }


}