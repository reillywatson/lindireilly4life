var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res) {
	res.send("<html><head><title>WEDDING!!!</title><body><h1>PARTY TIME!!!</h1><img src=\"lindi.jpg\"/><img src=\"reilly.jpg\"/></body></html>");
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});

