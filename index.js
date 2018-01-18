const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const randomKey = require("random-key");
const storage = require("node-persist");
const valurl = require("valid-url");
//cleaning data storage interval
const cleanevery_millis = 10000;
//7 days in milllis
const week = 3600*1000*24*7;
 //sets embedded javascript as view engine
app.set("view engine", "ejs");
//sets relative path where to find ejs views
app.set("views", __dirname + "/views");
//if port is defined in env of deployment server
app.set("port", process.env.PORT || 3000);
//parser looks for requests where content-type is url encoded with query string
app.use(bodyParser.urlencoded({ extended: false }));
//serves my static files, img and css in this case
app.use(express.static(__dirname + "/public"));
//root endpoint
app.get("/", (req, res) => {
  res.render("index", { link: "Your shorten url appears here" });
});
//app /shorturl STARTS
//this endpoint posts short url to server to persist provided by user
app.post("/shorturl", (req, res) => {
  console.log(req.body.url);
  var url = req.body.url;
  var key = randomKey.generate();
  var origin = req.headers.origin;
  console.log(req.body.url.type + "34");
    //if url is proper indentifier, i initialize storage for it
  if (valurl.isUri(url)) {
    console.log("valurl");
    storage
      .init({
        dir: "~/secrets/secret.json",
        ttl: week ,
        expiredInterval: cleanevery_millis,
      })
      .then(function() {
        console.log("41");
        storage.getItem("key", function(err, value) {
          //If url already persisted and not expired, then persist it
          if (!storage.values().includes(url)) {
            storage
              .setItem(key, url)
              .then(function() {
                console.log("28");
                return storage.getItem(key);
              })
              .then(value => {
                res.render('shortenurl', {link: req.headers.origin + "/" + key});
              });
          }
        });
      });
  } else {
    res.redirect("/");
  }
  console.log("32");
});
// /shorturl ENDS
//
// this takes the key and get the matching url and redirects
app.get("/:key", (req, res) => {
  storage.getItem(req.params.key).then((value)=>{
    console.log(value);
    res.redirect(value)
    res.redirect('/')
  }).catch(()=>{
    res.redirect('/')
  });
});

app.listen(app.get("port"), err => {
  if (err) {
    return console.log("Something went wrong");
  }

  console.log("server started on: " + app.get("port"));
});
/*res.json({
  chance: req.chance
})*/
