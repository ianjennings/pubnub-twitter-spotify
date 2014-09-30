var config = {
  development: {
    url: 'http://localhost:3000',
    port: 3000,
    db: 'mongodb://127.0.0.1:27017/pubnub-listening'
  },
  production: {
    url: 'http://memewarz.com',
    port: process.env.PORT,
    db: 'mongodb://admin:BKfxkQk7@proximus.modulusmongo.net:27017/ba5nireJ'
  }
};

if ('production' == process.env.NODE_ENV) {
  module.exports = config.production;
} else {
  module.exports = config.development;
}
