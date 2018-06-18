module.exports = function (app, db) {

    app.get("/book/:title", function (req, res) {

        db.Book.findOne({
            title: req.params.title
        }, function (err, data) {
            if (err)
                res.json(err)
            else
                res.json(data);
        })
    })

    app.get("/books", function (req, res) {
        db.Book.find(({}), function (err, data) {
            if (err)
                res.json(err);
            else
                res.json(data);
        })
    })

    app.post("/book", function (req, res) {
         const jsBook = new db.Book(req.body);
        jsBook.save(function (err, newJsBook) {
            if (err) return res.status(500).send(err);
            else return res.status(200).send(newJsBook);
        })

    })


}