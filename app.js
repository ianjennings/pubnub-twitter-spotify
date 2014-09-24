var dotenv = require('dotenv');
var PUBNUB = require('pubnub');
var EMBEDLY_KEY = process.env.EMBEDLY_KEY;
dotenv.load();


var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
});

pubnub.subscribe({
  channel: 'pubnub-twitter-spotify',
  message: function(tweet) { 
    console.log(tweet.text);
  }
});