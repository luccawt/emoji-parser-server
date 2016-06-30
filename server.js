var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var emojiRepository = {
	//Map
	tokensMap: [
		{ symbol: ':)', imageName: 'simple_smile.png' },
		{ symbol: ':(', imageName: 'worried.png' },
		{ symbol: ';)', imageName: 'wink.png'}
		
	
	
	],
	//Search 
	getEmoji: function (symbolEmoji) {
		for (var i = 0; i < this.tokensMap.length; i++) {
			if (this.tokensMap[i].symbol === symbolEmoji) {
				return this.tokensMap[i];
			}
		}
		return null;
	},
	hasImage: function (imageName) {
		for (var i = 0; i < this.tokensMap.length; i++) {
			if (this.tokensMap[i].imageName === imageName) {
				return true;
			}
		}
		return false;
	}
};

app.use(bodyParser.json());

app.get('/image/:imageName', function (req, res) {
	var imageName = req.params.imageName;
	console.log('Requesting image [' + imageName + ']...');
	var imageFilePath = 'images/' + imageName;
	try {
		if (emojiRepository.hasImage(req.params.imageName)) {
			if (fs.statSync(imageFilePath).isFile()) {
				var image = fs.readFileSync(imageFilePath);
				res.writeHead(200, {'Content-Type': 'image/png' });
				res.end(image, 'binary');
			}
		} else {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Esse emoji nao esta disponivel');
		}
	} catch(e) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Esse emoji nao existe');
	}
	
});

app.post('/parserEmoji', function (req, res) {
	var tokens = req.body.phrase.split(' ');
	var returnTokens = [];
	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		var emojiSymbol = emojiRepository.getEmoji(token);
		if (emojiSymbol) {
			returnTokens.push(emojiSymbol);
		}
	}
	res.send(returnTokens);
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});