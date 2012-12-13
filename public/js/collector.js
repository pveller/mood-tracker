// API token - qjlg0aj5zrugwu00xjuu
// Account Token - 260254
// Endpoint - https://api.mongohq.com


var hotsouth = {};

(function() {
	var endpoint = "https://api.mongohq.com";

	var c = function() {
		$.mongohq.authenticate({ apikey: 'qjlg0aj5zrugwu00xjuu'});
	};

	c.prototype.test_connection = function() {
		var success = false;
		
		return $.mongohq.databases.all({
			success: function(data) {
				console.log('Successfully connected to MongoHQ. Received: ' + JSON.stringify(data));
				success = data.length > 0;
			}
		});
	};

	var prepare = function(data) {
		var date = moment();
		data.timestamp = date.format('YYYYMMDDTHHmmss');
		data.year = date.format('YYYY');
		data.month = date.format('MM');
		data.date = date.format('YYYYMMDD');

		var regex = new RegExp('^[\\w\\s]+,\\s([\\w\\s]+),\\s([\\w+\\s]+),');
		var loc = regex.exec(data.location);
		console.log(loc);
		data.country = loc[1];
		data.city = loc[2];

		return data;
	};

	c.prototype.collect = function(data) {
		// expect that the databse has a collection names "raw"
		var result = null;
		var doc = prepare(data);
		$.mongohq.documents.create({
			db_name: 'mood',
			col_name: 'raw',
			data: {document: doc},
			success: function(response) {
				console.log('Successfully posted a document to MongoHQ: ' + JSON.stringify(doc) + 
										'. And received: ' + JSON.stringify(response));
				result = response;
			},
			error: function(e) {
				console.log('Error while posting a document to MongoHQ: ' + e);
			}
		});

		return result;
	};

	c.prototype.snapshot = function() {
		var data = null;
		$.mongohq.documents.all({
			db_name: 'mood',
			col_name: 'raw',
			data: {
				limit: 1
			},
			success: function(result) {
				console.log('Successfully received data from MongoHQ: ' + JSON.stringify(result));
				data = result;
			},
			error: function(e) {
				console.log('Error while posting a document to MongoHQ: ' + e);
				data = [];
			}
		});

		return data;
	};


	hotsouth.Collector = c;

})();