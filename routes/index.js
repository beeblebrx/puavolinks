/*
 * GET home page.
 */

var moment = require('moment');

function range1(i){return i?range1(i-1).concat(i):[]}

exports.index = function(req, res){
    var pg = require('pg')
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
	debugger;
	psqlClient.query("SELECT l.url, p.nick, l.date_posted FROM links l, posters p WHERE l.poster = p.pid ORDER BY l.date_posted DESC LIMIT $1 OFFSET $2", [pageSize, page * pageSize], function(err, result) {
	    if (!err) {
		var links = [];

		for (var index in result.rows) {
		    var offset = moment().isDST() ? 3 : 2;
		    var row = result.rows[index];
		    links.push({ "url": row.url,
				 "poster": row.nick,
				 "date": moment(row.date_posted).add('h', offset).format("DD.MM.YYYY HH:mm")
			       });
		}
		
		res.render('index', { title: 'puavolinks', 'links': links, 'pages': range1(numPages), 'pageNum': page + 1 });
	    } else {
		res.render('error', { title: 'FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'} );
	    }
	    
	    psqlClient.end();
	});
    });
};
