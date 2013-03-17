var pg = require('pg')
var psqlClient = new pg.Client(process.env.DATABASE_URL);
psqlClient.connect();

function nextStep(linkObj, steps, success, failure) {
    if (steps && steps.length > 0) {
	var f = steps.shift();
	f(linkObj, steps, success, failure);
    } else {
	success();
    }
}

function findChannel(linkObj, steps, success, failure) {
    if (linkObj.channel) {
	var channelQuery = psqlClient.query("WITH new_channel (name) as (VALUES ($1)) INSERT INTO channels (channel_name) SELECT name FROM new_channel WHERE NOT EXISTS (SELECT 1 FROM channels c WHERE c.channel_name = new_channel.name)", [linkObj.channel], function(err, result) {
	    if (!err) {
		console.log("Channel '" + linkObj.channel + "' found or insterted in channels table.");
		nextStep(linkObj, steps, success, failure);
		return;
	    } else {
		console.log(err.toString());
		failure();
		return;
	    }
	});
    }
}

function findPoster(linkObj, steps, success, failure) {
    if (linkObj.poster) {
	var posterQuery = psqlClient.query("WITH new_poster (nick) as (VALUES ($1)) INSERT INTO posters (nick) SELECT nick FROM new_poster WHERE NOT EXISTS (SELECT 1 FROM posters p WHERE p.nick = new_poster.nick)", [linkObj.poster], function(err, result) {
	    if (!err) {
		console.log("Nick '" + linkObj.poster + "' found or inserted in posters table.");
		nextStep(linkObj, steps, success, failure);
		return;
	    } else {
		console.log(err.toString());
		failure();
		return;
	    }
	});
    }
}

function addLink(linkObj, steps, success, failure) {
    if (linkObj.url) {
	psqlClient.query("INSERT INTO links (url, poster, channel) VALUES ($1, (SELECT pid FROM posters WHERE nick = $2), (SELECT cid FROM channels WHERE channel_name = $3))", [linkObj.url, linkObj.poster, linkObj.channel], function(err, result) {
	    if (err) {
		console.log(err.toString());
		failure();
		return;
	    }

	    nextStep(linkObj, steps, success, failure);
	});
    }
}

function storeLink(linkObj, steps, success, failure) {
    if (!linkObj || !steps || steps.length == 0) {
	failure();
	return;
    }

    nextStep(linkObj, steps, success, failure);
}

function hasAccess(key, onAccessGranted, onAccessDenied) {
    if (!key) {
	onAccessDenied();
	return;
    }

    psqlClient.query("SELECT * FROM keys WHERE key = $1 AND active = TRUE", [key], function(err, result) {
	if (!err && result.rows.length > 0) {
	    onAccessGranted();
	} else {
	    onAccessDenied();
	}
    });
}

exports.add = function(req, res){
    var channel = req.params.channel;
    var poster = req.params.poster;
    var url = req.body.url;
    var key = req.body.key;

    hasAccess(key,
	      function() {
		  console.log("POST to addLink. channel: " + channel + ", poster: " + poster + ", URL: " + url);
		  
		  storeLink({"url": url, "channel": channel, "poster": poster}, [findChannel, findPoster, addLink],
			    function() {
				res.writeHead(204, "URL saved", {'Content-Type': 'text/html'});
				res.end();
			    },
			    function() {
				res.writeHead(500, "URL not saved", {'Content-Type': 'text/html'});
				res.end();
			    });
	      },
	      function()
	      {
		  console.log("Access denied for key " + key);
		  res.writeHead(403, "Access denied", {'Content-Type': 'text/html'});
		  res.end();
		  return;
	      }
	     );
}
