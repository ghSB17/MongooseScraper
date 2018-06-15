module.exports = function (app, db) {

    app.get("/scrape", function (req, res) {

        console.log("Came Here!!")
        var nightmare = Nightmare({
            show: false
        });

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
                var results = [];

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
                    db.Book.findOne({title:title, author:author, imgSrc:imgSrc,price:price}, function(err,data){

                    })
                }
                console.log(results);
                return (results);
            })
            .end()
            //run the queue of commands specified
            .run(function (error, result) {
                if (error) {
                    res.json(error);
                } else {
                    console.log(result)
                    res.json(result);
                }
            });


    })
}