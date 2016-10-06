In index.js you have the exporter function:

<code>
exports.handler = function(event, context) {
	var skill = new BusinessInfo();
	skill.execute(event, context);
};
</code>

which is what Alexa calls the Lambda Handler function (http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)
	- event is an object passed by Alexa
	- context is an object passed by Alexa
	- could use a callback if we wanted 

BusinessInfo invokes the previous code (index.js):

<code>
var BusinessInfo = function(){
  AlexaSkill.call(this, APP_ID);
};
</code>

where we use the JS method 'call()' (to chain constructors - you're chaining the AlexaSkill constructor defined in AlexaSkill.js to the BusinessIinfo constructor - and passing in the APP_ID (which is given from the variable in index.js) )

Remember in AlexaSkill.js:

<code>
function AlexaSkill(appId) {
    this._appId = appId;
}
</code>

So APP_ID is the 'appID' that is passed into the function - which is then validated later in the execute function:

<code>
AlexaSkill.prototype.execute = function (event, context) {
    try {
        console.log("session applicationId: " + event.session.application.applicationId);

        // Validate that this request originated from authorized source.
        if (this._appId && event.session.application.applicationId !== this._appId) {
            console.log("The applicationIds don't match : " + event.session.application.applicationId + " and "
                + this._appId);
            throw "Invalid applicationId";
        }
</code>

the 'event' parameter is an OBJECT that is passed to you from Amazon and it looks like this:

<code>
	{
  "session": {
    "new": false,
    "sessionId": "session1234",
    "attributes": {},
    "user": {
      "userId": null
    },
    "application": {
      "applicationId": "amzn1.ask.skill.80a6688e-372f-4e1d-bb80-a70c1b5e8cb6"
    }
  },
  "version": "1.0",
  "request": {
    "intent": {
      "slots": {
        "Gender": {
          "name": "Gender",
          "value": "male"
        },
        "State": {
          "name": "State",
          "value": "Virginia"
        }
      },
      "name": "GetBusinessInfo"
    },
    "type": "IntentRequest",
    "requestId": "request5678"
  }
}
</code>

It is used in our validation code above to make sure that the APP_ID we provide in our Node.JS script is the same as the app_id that is passed to us when a request is made to Alexa from the user (which starts an 'event')

The context object has things some info you can use from Amamzon (http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html)

Our necessary handler function is index.handler b/c the name of the file is index.js and we use the simple - which is why on the AWS Lambda console in the 'Configuration' tab you see the handler is index.js

<code>
	export.handler = function() {}; 
</code>

