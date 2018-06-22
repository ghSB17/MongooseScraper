
var scrape = require("../scripts/scrape")
var db = require("../models")
module.exports = function (app) {

    app.get("/", function(req,res){
        console.log("IN GET / ")
        res.redirect("/all")
    })

    app.get("", function(req,res){
        console.log("IN GET ")
        res.redirect("/all");
    })

    app.get("/scrapeAn", function (req, res) {
        console.log("In scrapeAN")
        db.Book.find({}, function (err, documents) {
            if(err) console.log(err)
            var newData = []
            console.log("whats in the docs?!!!")
            console.log(documents);
            console.log("WHATS in the docs")
            scrape(function (data) {
                var count = 0
                if ( documents == undefined) {
                    console.log("UNdefined")
                    count=data.length
                    newData=data
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
                }else {
                    console.log(`the collections is empty---!!`)
                    newData=data
                    count=data.length
                }
                if(count>0){
                    console.log(`how many in collection now!! --${count}`)
                    db.Book.insertMany(newData).then(function(error,results){
                        if(error) console.log(error)
                        console.log(`insert NEW Docs`)
                        res.redirect("/all");
                    })
                }else {
                    console.log(`no new STUFF FOUND!!`)
                    res.redirect("/all")
                }
            })
        })

    })

    app.get("/scrape", function (req, res) {
        db.Book.find({}).then(function (errorR, bDocuments) {
            var promises = [];
            if (typeof bDocuments === undefined) {

                scrape(function (data) {

                    db.Book.insertMany(data, function (err, docs) {
                        if (err) console.log(err)
                        else {
                            console.log(docs)
                            console.log("success did something")
                            res.json(docs)
                        }
                    })
                })
            } else {
                console.log("Maybe you already have stuff")
                res.send("why do you need more stuff")
            }
        })
    })
    // console.log("================================================================================================================================")
    // // for (var l = 0; l < data.length; l++) {
    // //     candI(l, data[l], function (data) {
    // //         console.log(data)
    // //     })
    // // }
    // for (var i = 0; i < data.length; i++) {
    //     promises.push(checkAndInsert(i, data[i]))
    // }
    // var docus=[]
    // console.log("HERE OPEN PROMISES")
    // Promise.all(promises).then(function (message) {

    //     // console.log(message)
    //     console.log("DONE WITH PROMISES")
    //     // res.redirect("/all")
    // }).catch(function (err) {
    //     console.log(err)
    //     console.log("<<<<<<<<<<<<<<<<<<<<<<<<DONE>>>>>>>>>>>>>>>>>>>>>>")
    //     // res.redirect("/all")
    // })



    // db.Book.insertMany(data, {ordered:false}, function (error, resBookData) {
    //     if (error) {
    //         console.log("IN ERROR")
    //         console.log(error)
    //         // res.redirect("/all")
    //     } else {
    //         console.log("something happened!!!!")
    //         console.log(resBookData)
    //         res.redirect("/all")
    //     }
    // })
    //         })
    //     })

    // })

    // function candI(val, bookDoc, cb) {
    //     db.Book.find({
    //         title: bookDoc.title
    //     }, function (err, dc) {
    //         if (err) {
    //             console.log(err);
    //             cb("error")
    //         } else {
    //             console.log(val)
    //             console.log(dc)
    //             if (dc.length === 0) {
    //                 db.Book.create(bookDoc, function (e, d) {
    //                     if (e) cb(e)
    //                     else cb(d)
    //                 })
    //             } else
    //                 cb(dc)
    //         }
    //     })
    // }

    function checkAndInsert(val, bookDoc, cb) {
        var promise = new Promise(function (resolve, reject) {

            db.Book.findOne({
                title: bookDoc.title,
                // author: bookDoc.author
                // imgSrc: bookDoc.imgSrc,
                // price: bookDoc.price
            }).then(function (err, doc) {
                if (err) {

                    console.log(bookDoc);
                    reject("something went wrong")
                } else if (doc != undefined && doc.length === 1) {
                    console.log(val)
                    // console.log(doc)
                    resolve("Document exisits!!!" + val)
                } else {
                    //       if (doc.length === 0) {
                    // db.Book.create(bookDoc, function (e, d) {
                    //     if (e) console.log(e)
                    //     console.log(val)
                    //     console.log(d);
                    // console.log("*****************************************************************************************************************************************")
                    resolve("NONE FOUND")
                }

                // } else {
                //     reject("no document inserted: " + val)
                // }
            })
        })
        return promise
    }

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


    app.get('/example/b', function (req, res, next) {
        console.log('the response will be sent by the next function ...')
        next()
    }, function (req, res) {
        console.log("this will be executed")
        res.send('Hello from B!')
    })

    app.get("/scrapeSOF", function (req, res) {
        var cheerio = require("cheerio");
        var request = require("request");

        var results = [];
        // Make a request call to grab the HTML body from the site of your choice
        request("https://stackoverflow.com/users", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            // console.log(cheerio.load(html))
            var $ = cheerio.load(html);


            // An empty array to save the data that we'll scrape

            var cPosition, fname, bio, img;

            $("div#user-browser").find(".grid-layout").each(function (i, element) {
                // console.log($(element));
                var temp = $(element).find('div.user-details')
                temp.each(function (j, ele) {
                    var link = $(ele).children().attr("href");
                    var name = $(ele).children('a').text();
                    var loc = $(ele).children('.user-location').html();
                    // var bio=[];
                    var userLink = "https://stackoverflow.com/" + link;
                    console.log("in first request:", name, loc, userLink);
                    // request(userLink, function (error, response, html2) { 
                    //    $ = cheerio.load(html2);
                    //    img = $('div.avatar').children('img').attr('src');
                    //   fname =$('h2.user-card-name');
                    //   cPosition=$('div.current-position');
                    // $('div.bio').children().forEach(element => {
                    //   bio+=$(element).text()
                    // });

                    //  console.log(fname, img, cPosition);
                    // var bio = bioF(userLink);
                    // var request1 = require("request")
                    // request1(userLink, function (error, response, html2) {
                    //     $ = cheerio.load(html2);
                    //     img = $('div.avatar').children('img').attr('src');
                    //     fname = $('h2.user-card-name');
                    //     cPosition = $('div.current-position');
                    //     console.log(img, fname, cPosition)

                    var obj = {
                        name: name,
                        //  fullName: fname,
                        location: loc,
                        //   currentPosition: cPosition,
                        //   img: img,
                        // bio:bio,
                        link: link,
                    }
                    console.log("In Here:2222222")
                    console.log(obj)
                    results.push(obj);

                })

            })

            console.log(results);
            res.json(results)
        });



    });



    // function bioF(userLink) {
    //     var request = require("request");
    //     var img, fname, cPosition;
    //     console.log("Are we here??!! is it working??!!")
    //     request(userLink, function (error, response, html2) {
    //         $ = cheerio.load(html2);
    //         img = $('div.avatar').children('img').attr('src');
    //         fname = $('h2.user-card-name');
    //         cPosition = $('div.current-position');
    //         console.log(img, fname, cPosition)
    //         return ([img, fname, cPosition])
    //     })
    // }
}