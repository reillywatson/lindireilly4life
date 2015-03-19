var express = require("express");
var path = require("path");
var mongodb = require("mongodb");
var bodyParser = require('body-parser');
var app = express();
var mailer = require('nodemailer');
var uri = "mongodb://heroku_app33677492:mki02rshq8orejid96hcn3ssdn@ds041228.mongolab.com:41228/heroku_app33677492";

var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "dailywebshots@gmail.com",
        pass: "MyDailyWebShots"
    }
});

var sendEmail = function(to, subject, body) {
	var message = {
		from: "dailywebshots@gmail.com",
		to: to,
		subject: subject,
		text: body,
	};
	try {
		smtpTransport.sendMail(message, function(err, info) {console.log(err); console.log(info);});
	}
	catch(err) {
		console.log(err);
	}
}

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
	sendEmail(["reillywatson@gmail.com", "lindipruss@gmail.com"], "Secret RSVP!", JSON.stringify(req.body, null, 2));
});
app.post("/rsvp", function(req, res) {
	console.log(req.body);
	mongodb.MongoClient.connect(uri, function(err, db) {
		var rsvp = db.collection("rsvps");
		rsvp.insert(req.body, function(err, result){});
		res.send("");
		sendEmail(["reillywatson@gmail.com", "lindipruss@gmail.com"], "Wedding RSVP", JSON.stringify(req.body, null, 2));
	});
});

/*app.get("/initregistry", function(req, res) {
	var gifts = [
		{ giftid: "gift-dancefloor", name: "Tear up the dance floor", takers: [], sortid: 1},
		{ giftid: "gift-kegstand", name: "Do a keg stand", takers: [], sortid: 2},
		{ giftid: "gift-pizza", name: "Eat way too much pizza", takers: [], sortid: 3},
		{ giftid: "gift-lindibeer", name: "Get Lindi a beer", takers: [], sortid: 4},
		{ giftid: "gift-reillybeer", name: "Get Reilly a beer", takers: [], sortid: 5},
		{ giftid: "gift-reillytwobeers", name: "Get Reilly two beers!", takers: [], sortid: 6},
		{ giftid: "gift-inappropriatephoto", name: "Take an inappropriate photo", takers: [], sortid: 7},
		{ giftid: "gift-louis", name: "Be a Louis impersonator", takers: [], sortid: 8},
		{ giftid: "gift-highfive", name: "High-five *EVERYBODY*", takers: [], sortid: 9}
	];

	mongodb.MongoClient.connect(uri, function(err, db) {
		var registry = db.collection("registry");
		registry.remove({}, function(err, result) {
			for (var i = 0; i < gifts.length; i++) {
				registry.insert(gifts[i], function(err, result){});
			}
			res.send("SUCCESS");
		});
	});
});*/
app.get("/registry", function(req, res) {
	mongodb.MongoClient.connect(uri, function(err, db) {
		var registry = db.collection("registry");
		registry.find({}).sort({sortid: 1}).toArray(function(err, docs) {
			res.send(JSON.stringify(docs));
		});
	});
});
app.post("/registry", function(req, res) {
	if (!req || !req.body || !req.body.name) {
		res.send("success");
		return;
	}
	console.log(req.body);
	mongodb.MongoClient.connect(uri, function(err, db) {
		var registry = db.collection("registry");
		registry.update({ giftid: req.body.giftid}, { $push: {takers: req.body.name} }, function(err, result) {
			console.log("err");
			console.log(err);
			console.log("result");
			console.log(result);
			res.send("success");
		});
		sendEmail(["reillywatson@gmail.com", "lindipruss@gmail.com"], "Party Registry!", JSON.stringify(req.body, null, 2));
	});
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});

