describe('MongoHQ Collector', function() {


	it('should be possible to instantiate a collector', function() {
		var c = new hotsouth.Collector();

		expect(c).toBeDefined();
	});

	it('jQuery should be on', function() {
		expect($).toBeDefined();
		expect($.ajax).toBeDefined();
	});

	it('moment.js should be on', function() {
		expect(moment).toBeDefined();
		expect(moment()).toBeDefined();
		expect(moment().format).toBeDefined();
	});

	it('MongoHQ JS client should be on', function() {
		expect($.mongohq).toBeDefined();
	});

	describe('With Collector instance', function() {
		var c = new hotsouth.Collector();

		var helper = {
			collect_one: function() {
				return c.collect({
					name:"Pavel Veller",
					location:"NA, USA, Atlanta, Off-site",
					unit:"EPAM/NA Operations/Delivery",
					manager:"Viktar Dvorkin",
					mood: 1
				});
			},
			collect: function(times) {
				var result = [];
				for (var i = 0; i < times; i ++) {
					result.push(helper.collect_one());
				}

				return result;
			}
		};


		it('should be possible to test MongoHQ connection', function() {
			var online = c.test_connection();

			expect(online).toBeTruthy();
		});

		it('should be possible to collect data', function() {
			var result = helper.collect_one();

			expect(result).toBeTruthy();
			expect(result.ok).toEqual(1);
			expect(result._id).toBeDefined();

			// read it back and verify it was pre-processed properly
			var doc;

			runs(function() {
				$.mongohq.documents.find({
					db_name: 'mood',
					col_name: 'raw',
					doc_id: result._id,
					success: function(response) {
						console.log("Received: " + JSON.stringify(response));
						doc = response;
					},
					error: function(e) {
						console.log('Error while retrieving a document: ' + e);
						doc = null;
					}
				});
			});

			waitsFor(function() {
				return doc !== undefined;
			});

			runs(function() {
				expect(doc).toBeDefined();
				expect(doc.year).toEqual((new Date()).getFullYear().toString());
				expect(doc.month).toEqual(((new Date()).getMonth() + 1).toString());
				expect(doc.date).toEqual(moment().format('YYYYMMDD'));
				expect(doc.timestamp).toBeDefined();
				expect(doc.country).toEqual("USA");
				expect(doc.city).toEqual('Atlanta');				
			});
		});
	
		it('should be possible to get the most recent snapshot', function() {
			helper.collect(2);

			var result = c.snapshot();

			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);
		});

		describe('With clean database', function() {
			beforeEach(function() {
				// clean collection
				$.mongohq.collections.delete({
					db_name: 'mood',
					col_name: 'raw',
					data: {}
				});
			});

			it('should only return one record for the person in a snapshot', function() {
				helper.collect(2);
				var snapshot = c.snapshot();

				expect(snapshot.length).toEqual(1);
			});

			it('should return the most recent record in a snapshot', function() {
				var docs = helper.collect(10);
				console.log(JSON.stringify(docs));
				var snapshot = c.snapshot();

				expect(snapshot[0]._id['$oid']).toEqual(docs[9]._id);
			});
		});
	});

});