/*
 * GET home page.
 */

var moment = require('moment');

exports.index = function(req, res){
    var pg = require('pg')
    var psqlClient = new pg.Client(process.env.DATABASE_URL);
    psqlClient.connect();

    psqlClient.query("SELECT l.url, p.nick, l.date_posted FROM links l, posters p WHERE l.poster = p.pid", function(err, result) {
	if (!err) {
	    var links = [];

	    for (var index in result.rows) {
		var offset = moment().isDST() ? 3 : 2;
		debugger;
		var row = result.rows[index];
		links.push({ "url": row.url,
			     "poster": row.nick,
			     "date": moment(row.date_posted).add('h', offset).format("DD.MM.YYYY HH:mm")
					   });
	    }
	    res.render('index', { title: 'puavolinks', 'links': links });
	} else {
	    res.render('error', { title: 'FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'} );
	}

	psqlClient.end();
    });
};
