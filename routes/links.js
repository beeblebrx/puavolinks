var pg = require('pg')
var psqlClient = new pg.Client(process.env.DATABASE_URL);
psqlClient.connect();

function nextStep(linkTuple, steps, acc, success, failure) {
    if (steps && steps.length > 0) {
	var f = steps.shift();
	f(linkTuple, steps, acc, success, failure);
    } else {
	success();
    }
}

function findChannel(linkTuple, steps, acc, success, failure) {
    if (linkTuple.channel) {
	var channelQuery = psqlClient.query("SELECT cid FROM channels WHERE channel_name=$1", [linkTuple.channel], function(err, result) {
	    if (!err) {
		if (result.rows.length > 0) {
		    console.log("Channel '" + linkTuple.channel + "' found in channels table.");
		    acc.cid = result.rows[0].cid;
		    nextStep(linkTuple, steps, acc, success, failure);
		    return;
		} else {
		    console.log("Adding new channel to table: " + linkTuple.channel);
		    psqlClient.query("INSERT INTO channels (channel_name) VALUES ($1)", [linkTuple.channel], function(inserr, insresult) {
			if (!inserr) {
			    psqlClient.query("SELECT cid FROM channels WHERE channel_name=$1", [linkTuple.channel], function(ciderr, cidresult) {
				if (!ciderr) {
				    acc.cid = cidresult.rows[0].cid;
				    nextStep(linkTuple, steps, acc, success, failure);
				    return;
				} else {
				    console.log(ciderr.toString());
				    failure();
				    return;
				}
			    });
			} else {
			    console.log(inserr.toString());
			    failure();
			    return;
			}
		    });
		}
	    } else {
		console.log(err.toString());
		failure();
		return;
	    }
	});
    }
}

function findPoster(linkTuple, steps, acc, success, failure) {
    if (linkTuple.poster) {
	var posterQuery = psqlClient.query("SELECT pid FROM posters WHERE nick=$1", [linkTuple.poster], function(err, result) {
	    if (!err) {
		if (result.rows.length > 0) {
		    console.log("Nick '" + linkTuple.poster + "' found in posters table.");
		    acc.pid = result.rows[0].pid;
		    nextStep(linkTuple, steps, acc, success, failure);
		    return;
		} else {
		    console.log("Adding new poster to table: " + linkTuple.poster);
		    psqlClient.query("INSERT INTO posters (nick) VALUES ($1)", [linkTuple.poster], function(inserr, insresult) {
			if (!inserr) {
			    psqlClient.query("SELECT pid FROM posters WHERE nick=$1", [linkTuple.poster], function(piderr, pidresult) {
				if (!piderr) {
				    acc.pid = pidresult.rows[0].pid;
				    nextStep(linkTuple, steps, acc, success, failure);
				    return;
				} else {
				    console.log(piderr.toString());
				    failure();
				    return;
				}
			    });
			} else {
			    console.log(inserr.toString());
			    failure();
			    return;
			}
		    });
		}
	    } else {
		console.log(err.toString());
		failure();
		return;
	    }
	});
    }
}

function addLink(linkTuple, steps, acc, success, failure) {
    debugger;
    console.log("Inserting '" + linkTuple.url + "' from channel id " + acc.cid + ", poster id " + acc.pid);
    if (acc.cid && acc.pid && linkTuple.url) {
	psqlClient.query("INSERT INTO links (url, poster, channel) VALUES ($1, $2, $3)", [linkTuple.url, acc.pid, acc.cid], function(err, result) {
	    if (err) {
		console.log(err.toString());
		failure();
		return;
	    }

	    nextStep(linkTuple, steps, acc, success, failure);
	});
    }
}

function storeLink(linkTuple, steps, success, failure) {
    if (!linkTuple || !steps || steps.length == 0) {
	failure();
	return;
    }

    nextStep(linkTuple, steps, {}, success, failure);
}

exports.add = function(req, res){
    var channel = req.params.channel;
    var poster = req.params.poster;
    var url = req.body.url;
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
};
