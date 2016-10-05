var http = require('http');
var AlexaSkill = require('./AlexaSkill');
var APP_ID = 'amzn1.ask.skill.80a6688e-372f-4e1d-bb80-a70c1b5e8cb6';

var url = 'http://api.census.gov/data/2012/sbo?get=SEX,FIRMALL&for=us:*&key=3859c0c537fc2c737ff6b773da51942f92019e56';

var getResponsefromAPI = function(random,callback) {
	http.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			body += data;
		})

		res.on('end', function() {
			var result = JSON.parse(body);
			callback(result);
		});
	}).on('error', function(e) {
		console.log('error ' + e);
	});
}

var getNumbersRequest = function(intent, session, response) {
	getResponsefromAPI(intent.slots.Gender.value, function(data) {

		if (intent.slots.Gender.value == 'female') {
			if (data) {
				var text = data[2][1];
				var cardText = "The number of female businesses is " + text;		
			} else {
				var text = "Please try again"
				var cardText = text;
			}
		} else if (intent.slots.Gender.value == 'male') {
			if (data) {
				var text = data[3][1];
				var cardText = "The number of male businesses is " + text;		
			} else {
				var text = "Please try again"
				var cardText = text;
			}
		} else (intent.slots.Gender.value == 'equally') {
			if (data) {
				var text = data[4][1];
				var cardText = "The number of male businesses is " + text;		
			} else {
				var text = "Please try again"
				var cardText = text;
			}
		}

		var heading = "The number of businesses is " + intent.slots.Gender.value;
		response.tellWithCard(text, heading, cardText);
	})
}

var BusinessInfo = function(){
  AlexaSkill.call(this, APP_ID);
};

BusinessInfo.prototype = Object.create(AlexaSkill.prototype);
BusinessInfo.prototype.constructor = BusinessInfo;

BusinessInfo.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Welcome to Business Info. ' +
    'Say the number of the gender to get the number of businesses.';

  var reprompt = 'Which gender do you want to find more about?';

  response.ask(output, reprompt);
};

BusinessInfo.prototype.intentHandlers = {
  GetBusinessInfo: function(intent, session, response){
    getNumbersRequest(intent, session, response);
  }
};

exports.handler = function(event, context) {
	var skill = new BusinessInfo();
	skill.execute(event, context);
}
