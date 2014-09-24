var PUBNUB = require('pubnub');

var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
});

pubnub.subscribe({
  channel: 'pubnub-twitter-spotify',
  message: function(tweet) { 
    console.log(tweet);
  }
});