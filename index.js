const port = process.env.PORT|| 3333  ;
const express = require("express")
const cheerio = require("cheerio")
const fetch = require('node-fetch')

const app = express()

const base_url = "https://stayhomeegypt.com/";

const feed = function (req, res) {
  fetch(base_url)
    .then(res => res.text())
    .then(body => {
      let $ = cheerio.load(body)
      var gridText = [];
      $(".grid-item p").each(function () { gridText.push($(this).text()) });
      var gridimage = [];
      $(".grid-item img").each(function () { gridimage.push(base_url + $(this).attr('src')) });
      var gridurl = [];
      $(".grid-item a").each(function () { gridurl.push($(this).attr('href')) });
      var list = [];
      for (var i = 0; i < gridText.length; i++) {
        list.push({ "title": gridText[i], "img": gridimage[i], "href": gridurl[i] })
      }
      res.json(list)
    });
}
const browse = function (req, res) {
  console.log(req.params.id)
  fetch(base_url + "browse" + req.params.id)
    .then(res => res.text())
    .then(body => {
      let $ = cheerio.load(body)
      var companiesnames = [];
      $(".gategory-item h3").each(function () { companiesnames.push($(this).text()) });
      console.log(companiesnames)
      var companiesimages = [];
      $(".gategory-item img").each(function () { companiesimages.push(base_url + $(this).attr('src')) });
      console.log(companiesimages)
      var companiescontacts = [];
      $(".gategory-item .web-btn, .face-btn, .insta-btn, .android-btn, .apple-btn").each(function () { companiescontacts.push(base_url + $(this).attr('href')) });
      console.log(companiescontacts)
      var companiescontactstype = [];
      $(".gategory-item .web-btn, .face-btn, .insta-btn, .android-btn, .apple-btn").each(function () { companiescontactstype.push($(this).attr('class')) });
      console.log(companiescontactstype)
      var companiescontactsname = [];
      $(".gategory-item .web-btn, .face-btn, .insta-btn,.whats-btn, .call-btn,  .android-btn, .apple-btn").each(function () { companiescontactsname.push($(this).text().replace('\n', '')) });
      console.log(companiescontactsname)
      var list = [];
      for (var i = 0; i < companiesnames.length; i++) {
        var links = []
        for (var j = 0; j < 3; j++) {
          links.push({ name: companiescontactsname[j], type: companiescontactstype[j], link: companiescontacts[j] })
        }
        list.push({ "title": companiesnames[i], "img": companiesimages[i], "links": links })
      }
      res.json(list)
    });
}


app.route("/api/v1/feed").get(feed)
app.route("/api/v1/browse:id").get(browse)

app.listen(port, function () {
  console.log("SERVER STARTED ON PORT " + port)
})


