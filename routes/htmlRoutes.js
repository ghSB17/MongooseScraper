module.exports = function (app, db) {

    app.get("/scrapeA", function (req, res) {

        var Nightmare = require('nightmare');
        console.log("In get function")
        var nightmare = Nightmare({
            show: true
        });
        var results = [];
        
        nightmare
            //load a url
            .goto('http://amazon.com')
            //simulate typing into an element identified by a CSS selector
            //here, Nightmare is typing into the search bar
            .type('#twotabsearchtextbox', 'javascript')
            .type('.searchSelect', 'Books')

            //click an element identified by a CSS selector
            //in this case, click the search button
            .click('input[type="Submit"]')

            //wait for an element identified by a CSS selector
            //in this case, the body of the results
            .wait('ul#s-results-list-atf')

            //execute javascript on the page
            //here, the function is getting book image, title, author and cost from search results
            .evaluate(function () {
                //Array to hold all the scraped JS book details

                //this is the element containing all JS books in listItems
                var listItems = document.getElementById("LI");

                var lI = document.querySelectorAll("ul#s-results-list-atf > li")
                for (var i = 0; i < lI.length; i++) {
                    // to store each javascript book info as a document in the collection
                    var imgSrc = lI[i].querySelector("img").getAttribute('src');
                    var title = lI[i].querySelector("img").getAttribute('alt')
                    var price =
                        ((lI[i].querySelector(".sx-price-whole") == null) ? `$0` : `$${lI[i].querySelector(".sx-price-whole").innerHTML}`);
                    var spans = lI[i].querySelectorAll(".a-color-secondary")
                    var author = '';
                    var p = ((spans[2] == null) ? "" : (spans[2].parentNode))

                    //to retreive the author(s) names
                    if (p != "") {

                        var tc = p.children;
                        for (var m = 1; m < p.children.length; m++) {
                            if (p.children[m].children.length > 0)
                                author += `${p.children[m].children[0].innerHTML} `
                            else
                                author += `${p.children[m].innerHTML} `;
                        }
                    }
                    results.push({
                        title: title,
                        author: author,
                        imgSrc: imgSrc,
                        price: price
                    })
                    // db.Book.findOneAndUpdate({
                    //     title: title,
                    //     author: author,
                    //     imgSrc: imgSrc,
                    //     price: price
                    // }, {
                    //     upsert: true,
                    //     returnNewDocument: true
                    // }).then(function (newBook) {
                    //     console.log(newBook)
                    // }).catch(function (err) {
                    //     console.log(err)
                    // })

                }
                console.log(results);
                return ("blahblah");
            })
            .end()
            //run the queue of commands specified
            .run(function (error, result) {
                if (error) {
                    res.json(error);
                } else {
                    console.log(result)
                    // db.Book.find({})
                    //     .then(function (bookDocs) {
                    //         res.json(bookDocs)
                    //     })
                    //     .catch(function (err) {
                    //         res.json(err)
                    //     });

                    res.json(result)
                }
            });


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