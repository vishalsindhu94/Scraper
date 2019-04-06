var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");



var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;


var app = express();


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });




app.get("/", function (req, res) {

  db.Article.find({})
    .then(function (dbArticle) {
      
      var hbsObject = {
        articles: dbArticle
      };

      res.render("index", hbsObject);

    })
    .catch(function (err) {
      t
      res.json(err);
    });
});


app.get("/scrape", function (req, res) {
  
  axios.get("https://www.nytimes.com/").then(function (response) {
    
    var $ = cheerio.load(response.data);

    
    console.log($("article.item").length)

    $("article").each(function (i, element) {

      
      var result = {};

      

      summary = ""
      if ($(this).find("ul").length) {
        summary = $(this).find("li").first().text();
      } else {
        summary = $(this).find("p").text();
      };

      result.title = $(this).find("h2").text();
      result.summary = summary;
      result.link = "https://www.nytimes.com" + $(this).find("a").attr("href");

      
      db.Article.create(result)
        .then(function (dbArticle) {
         
          console.log(dbArticle);
        })
        .catch(function (err) {
          
          console.log(err);
        });
    });

    
    res.send("Scrape Complete");
  });
});

app.get("/saved", function (req, res) {
  
  db.Article.find({ saved: true })
    .then(function (dbArticle) {
      
      var hbsObject = {
        articles: dbArticle
      };

      res.render("saved", hbsObject);

    })
    .catch(function (err) {
      
      res.json(err);
    });
});

app.put("/delete/:id", function (req, res) {


  db.Article.findOneAndUpdate({ _id: req.params.id }, { "saved": false }, { new: true })


    .then(function (dbArticle) {
      
      console.log(dbArticle);
      res.send("Deleted");
    })
    .catch(function (err) {
      
      console.log(err);
      res.send("Error");
    });
  });
  
  app.get("/articles/:id", function (req, res) {
    
    db.Article.findOne({ _id: req.params.id })
      
      .populate("note")
      .then(function (dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function (err) {
        
        res.json(err);
      });
  });

  
  app.post("/articles/:id", function (req, res) {
    
    db.Note.create(req.body)
      .then(function (dbNote) {
        
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function (err) {
       
        res.json(err);
      });
  });

  app.post("/deleteArticles/:id/:noteId", function (req, res) {
    
    db.Note.findByIdAndDelete(req.params.noteId)
      .then(function (dbNote) {

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { notes: dbNote._id } }, { new: true });

      })
      .then(function (dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function (err) {
        
        res.json(err);
      });
  });


  
  app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
