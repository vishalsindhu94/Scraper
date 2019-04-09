var router = require("express").Router();
var db = require("../../models");


// This route renders the homepage
router.get("/", function(req, res) {
    db.Headline.find({ saved: false })
      .sort({ date: -1 })
      .then(function(dbArticle) {
        res.render("index", { article: dbArticle });
    });
});

// This route renders the saved handlebars page
router.get("/saved", function(req, res) {
db.Headline.find({ saved: true })
    .sort({ date: -1 })
    .then(function(dbArticle) {
    res.render("saved", { article: dbArticle });
    });
});

module.exports = router;