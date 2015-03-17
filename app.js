var express = require("express");
var path = require("path");
var mongodb = require("mongodb");
var bodyParser = require('body-parser');
var app = express();
var uri = "mongodb://heroku_app33677492:mki02rshq8orejid96hcn3ssdn@ds041228.mongolab.com:41228/heroku_app33677492";
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post("/secretrsvp", function(req, res) {
	console.log(req.body);
	mongodb.MongoClient.connect(uri, function(err, db) {
		var secret = db.collection("secret");
		secret.insert({name: req.body.secret_name}, function(err, result) {});
	});
	res.send("<html>Thanks!<br><img src=\"images/lindibaby.jpg\"/></html>");
});
app.post("/rsvp", function(req, res) {
	console.log(req.body);
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});

