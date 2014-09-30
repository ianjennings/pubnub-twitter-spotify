var PUBNUB = require('pubnub');
var mongo = require('mongodb').MongoClient;

var express = require('express');
var app = express();
var config = require('./config');

app.set('views', './views');
app.set('view engine', 'jade');

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

mongo.connect(config.db, function(err, db) {

  var albums = db.collection('albums');

  // initialize pubnub with special key
  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
  });

  var top = function(callback) {

    var callback = callback || function(){};

    albums
      .find({$where: function () { return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000)}})
      .sort({plays: -1})
      .limit(5)
      .toArray(function(err, docs) {
        callback(docs);
    });

  };

  // subscribe to twitter / spotify feed
  pubnub.subscribe({
    channel: 'pubnub-twitter-spotify',
    message: function(tweet) { 

      var link = findUrls(tweet.text)[0];

      if(typeof link !== "undefined" && link) {

        albums.update({link: link, tweet: tweet}, {$inc: {plays: 1}}, {upsert: true, w: 1}, function(err, docs) {
          console.log(' ');
          console.log('--------------------------------------------------');
          console.log(' ');
          console.log('Update: ' + link);
          top(function(docs) {

            for(var i = 0; i < docs.length; i++) {
              console.log(i + ') [' + docs[i].plays + ' plays] ' + docs[i].link);
            }

          });
        });

      }

    }
  });

  app.get('/', function (req, res) {
    res.sendfile('index.html');
  });

  app.get('/top', function(req, res) {
    top(function(docs) {
      res.json(docs);
    });
  });

  app.listen(config.port);

});