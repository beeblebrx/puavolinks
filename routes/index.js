/*
 * GET home page.
 */

exports.index = function(req, res){
    var pg = require('pg')
    var psqlClient = new pg.Client(process.env.DATABASE_URL);
    psqlClient.connect();

    psqlClient.query("SELECT url FROM links", function(err, result) {
	debugger;
	if (!err) {
	    var links = new Array();
	    for (var index in result.rows) {
		links.push(result.rows[index].url);
	    }
	    res.render('index', { title: 'puavolinks', 'links': links });
	} else {
	    res.render('error', { title: 'FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'} );
	}

	psqlClient.end();
    });
};
