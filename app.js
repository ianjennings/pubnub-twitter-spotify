var path = require('path');
var PUBNUB = require('pubnub');
var mongo = require('mongodb').MongoClient;

var express = require('express');
var app = express();
var config = require('./config');

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.listen(config.port);