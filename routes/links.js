var pg = require('pg')

var psqlClient = new pg.Client(process.env.DATABASE_URL);
psqlClient.connect();

exports.add = function(req, res){
  console.log("Adding URL to database.");
  psqlClient.query("INSERT INTO links (url, poster, channel) VALUES ('http://www.google.com', 1, 1)");
};
