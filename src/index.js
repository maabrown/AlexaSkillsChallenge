var http = require('http');
var AlexaSkill = require('./AlexaSkill');
var APP_ID = 'amzn1.ask.skill.80a6688e-372f-4e1d-bb80-a70c1b5e8cb6';

var fipsCode = {
   "Alabama"                :  "01",
   "Alaska"                 :  "02",
   "Arizona"                :  "04",
   "Arkansas"               :  "05",
   "California"             :  "06",
   "Colorado"               :  "08",
   "Connecticut"            :  "09",
   "Delaware"               :  "10",
   "District of Columbia"   :  "11",
   "Florida"                :  "12",
   "Geogia"                 :  "13",
   "Hawaii"                 :  "15",
   "Idaho"                  :  "16",
   "Illinois"               :  "17",
   "Indiana"                :  "18",
   "Iowa"                   :  "19",
   "Kansas"                 :  "20",
   "Kentucky"               :  "21",
   "Louisiana"              :  "22",
   "Maine"                  :  "23",
   "Maryland"               :  "24",
   "Massachusetts"          :  "25",
   "Michigan"               :  "26",
   "Minnesota"              :  "27",
   "Mississippi"            :  "28",
   "Missouri"               :  "29",
   "Montana"                :  "30",
   "Nebraska"               :  "31",
   "Nevada"                 :  "32",
   "New Hampshire"          :  "33",
   "New Jersey"             :  "34",
   "New Mexico"             :  "35",
   "New York"               :  "36",
   "North Carolina"         :  "37",
   "North Dakota"           :  "38",
   "Ohio"                   :  "39",
   "Oklahoma"               :  "40",
   "Oregon"                 :  "41",
   "Pennsylvania"           :  "42",
   "Rhode Island"           :  "44",
   "South Carolina"         :  "45",
   "South Dakota"           :  "46",
   "Tennessee"              :  "47",
   "Texas"                  :  "48",
   "Utah"                   :  "49",
   "Vermont"                :  "50",
   "Virginia"               :  "51",
   "Washington"             :  "53",
   "West Virginia"          :  "54",
   "Wisconsin"              :  "55",
   "Wyoming"                :  "56"
};

var url = function (state) {
// 	for (var key in fipsCode) {
// 		if (state == key) {
// 			state = fipsCode[key];
// 		}
// 	}
    var stateFormatted = state.toString();
	return 'http://api.census.gov/data/2012/sbo?get=SEX,FIRMALL&for=state:' + stateFormatted + '&key=3859c0c537fc2c737ff6b773da51942f92019e56';
};

// var url = 'http://api.census.gov/data/2012/sbo?get=SEX,FIRMALL&for=state' + state + ':&key=3859c0c537fc2c737ff6b773da51942f92019e56';

var getResponsefromAPI = function(gender, fipCodeChoice, callback) {
	http.get(url(fipCodeChoice), function(res) {
		var body = '';

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			var result = JSON.parse(body);
			callback(result);
		});
	}).on('error', function(e) {
		console.log('error ' + e);
	});
};

var getNumbersRequest = function(intent, session, response) {
	getResponsefromAPI(intent.slots.Gender.value, intent.slots.State.value, function(data) {
        var text;
        var carText;
		if (intent.slots.Gender.value == 'female') {
			if (data) {
				text = data[2][1];
				cardText = "The number of female businesses is " + text;		
			} else {
				text = "Please try again";
				cardText = text;
			}
		} else if (intent.slots.Gender.value == 'male') {
			if (data) {
				text = data[3][1];
				cardText = "The number of male businesses is " + text;		
			} else {
				text = "Please try again";
				cardText = text;
			}
		} else if (intent.slots.Gender.value == 'equally') {
			if (data) {
				text = data[4][1];
			    cardText = "The number of male businesses is " + text;		
			} else {
				text = "Please try again";
				cardText = text;
			}
		}

		var heading = "The number of businesses" + " in " + intent.slots.State.value + " is " + text;
		response.tellWithCard(text, heading, cardText);
	});
};

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
};
