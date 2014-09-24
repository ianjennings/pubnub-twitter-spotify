var dotenv = require('dotenv');
var PUBNUB = require('pubnub');
var colors = require('colors');
var request = require('request');
var util = require('util');
// hide embedly key
dotenv.load();
var EMBEDLY_KEY = process.env.EMBEDLY_KEY;

// http://stackoverflow.com/questions/4504853/how-do-i-extract-a-url-from-plain-text-using-jquery
var findUrls = function(text) {
    
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null ) {
      var token = matchArray[0];
      urlArray.push( token );
    }

    return urlArray;

}

// initialize pubnub with special key
var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
});

// subscribe to twitter / spotify feed
pubnub.subscribe({
  channel: 'pubnub-twitter-spotify',
  message: function(tweet) { 

    console.log(tweet)

    request.get('http://api.embed.ly/1/extract?key=' + EMBEDLY_KEY + '&url=' + findUrls(tweet.text)[0] + '&maxwidth=640&format=json', function (error, response, body) {

      console.log(error);

      console.log(tweet.text);
      console.log('EMBEDLY RESPONSE!'.green);
      var body = JSON.parse(body);
      console.log(body)

    });

  }
});