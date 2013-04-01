/*
 * GET home page.
 */

var moment = require('moment');

exports.index = function(req, res){
    var pg = require('pg');
    var psqlClient = new pg.Client(process.env.DATABASE_URL);
    psqlClient.connect();

    var pageSize = 20;
    var page = parseInt(req.query.page);
    if (isNaN(page)) {
	page = 0;
    }

    psqlClient.query("SELECT count(*) FROM links", function(countErr, countResult) {
	if (countErr)  {
	    res.render('error', { title: 'FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'} );
	    psqlClient.end();
	    return;
	}

	var numPages = Math.ceil(countResult.rows[0].count / pageSize);
	psqlClient.query("SELECT l.url, p.nick, l.date_posted AT TIME ZONE 'Europe/Helsinki' AS date_posted FROM links l, posters p WHERE l.poster = p.pid ORDER BY l.date_posted DESC LIMIT $1 OFFSET $2", [pageSize, page * pageSize], function(err, result) {
	    if (!err) {
		var links = [];

		for (var index in result.rows) {
		    var row = result.rows[index];
		    links.push({ "url": row.url,
				 "poster": row.nick,
				 "date": moment(row.date_posted).format("DD.MM.YYYY HH:mm")
			       });
		}

		res.render('index', { title: 'puavolinks', 'links': links, 'pages': numPages, 'pageNum': page });
	    } else {
		res.render('error', { title: 'FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'} );
	    }

	    psqlClient.end();
	});
    });
};
