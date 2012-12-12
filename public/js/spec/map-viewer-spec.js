describe('Google Map Viewer', function() {

	it('jquery should be on', function() {
		expect($).toBeDefined();
		expect($.ajax).toBeDefined();
	});

	it('underscore should be on', function() {
		expect(_).toBeDefined();
	});

	it('mongohq client should be on', function() {
		expect($.mongohq).toBeDefined();
	});

	it('google map viewer should be present', function() {
		expect($.mv).toBeDefined();
	});

	it('google maps API should be on', function() {
		expect(google.maps).toBeDefined();
	});

	describe('MoodViewer basic properties', function() {

		it('should be possible to center the map elsewhere', function() {
			expect($.mv.center).toEqual($.mv.country.USA.geo);
			expect($.mv.zoom).toEqual($.mv.country.USA.zoom);
			
			$.mv.positionTo($.mv.country.Belarus);

			expect($.mv.center).toEqual($.mv.country.Belarus.geo);
			expect($.mv.zoom).toEqual($.mv.country.Belarus.zoom);

		});
	});

	describe('With MoodViewer instance', function() {

		it('should know the regions', function() {
			expect($.mv.country.USA).toBeDefined();
			expect($.mv.country.Ukraine).toBeDefined();
			expect($.mv.country.Canada).toBeDefined();
			expect($.mv.country.Belarus).toBeDefined();
		});

		it('should know all the cities locations', function() {
			expect($.mv.location.Atlanta).toBeDefined();
			expect($.mv.location.Astanta).toBeDefined();
			expect($.mv.location.Boston).toBeDefined();
			expect($.mv.location.Brest).toBeDefined();
			expect($.mv.location.Budapest).toBeDefined();
			expect($.mv.location.Dnipropetrovsk).toBeDefined();
			expect($.mv.location.Gomel).toBeDefined();
			expect($.mv.location.Grodno).toBeDefined();
			expect($.mv.location.Houston).toBeDefined();
		  expect($.mv.location.Izhevsk).toBeDefined();
		  expect($.mv.location.Karaganda).toBeDefined();
		  expect($.mv.location.Kharkiv).toBeDefined();
		  expect($.mv.location.Krakow).toBeDefined();
		  expect($.mv.location.Kyiv).toBeDefined();
		  expect($.mv.location.London).toBeDefined();
		  expect($.mv.location.Lviv).toBeDefined();
		  expect($.mv.location.Minsk).toBeDefined();
		  expect($.mv.location.Mogilev).toBeDefined();
		  expect($.mv.location.Moscow).toBeDefined();
		  expect($.mv.location['New York']).toBeDefined();
		  expect($.mv.location.Newtown).toBeDefined();
		  expect($.mv.location.Ryazan).toBeDefined();
		  expect($.mv.location['Saint-Petersburg']).toBeDefined();
		  expect($.mv.location.Samara).toBeDefined();
		  expect($.mv.location['Sergiev Posad']).toBeDefined();
		  expect($.mv.location.Stockholm).toBeDefined();
		  expect($.mv.location.Szeged).toBeDefined();
		  expect($.mv.location.Togliatti).toBeDefined();
		  expect($.mv.location.Tver).toBeDefined();
		  expect($.mv.location.Vinnytsya).toBeDefined();
		  expect($.mv.location.Vitebsk).toBeDefined();
		  expect($.mv.location.Wroclaw).toBeDefined();
		  expect($.mv.location.Zurich).toBeDefined();
		});

		it('should initialize properly', function() {
			$.mv.initialize();
			expect($.mv.map).toBeDefined();
		});

		describe('With initialized map', function() {
			it('should center the map if the center changes on the MV object', function() {
				$.mv.positionTo($.mv.country.Belarus);

				expect($.mv.map.getCenter()).toEqual($.mv.country.Belarus.geo);
			});
		});	

	});

	describe('Working with data', function() {
		it('should be possible to get a snapshot from MongoHQ', function() {
			var data = $.mv.snapshot();

			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
		});

		it('should return unique recods for a snapshot', function() {
			var data = $.mv.snapshot();

			expect(_.max(_.values(_.countBy(data, 'name'), 2))).toEqual(1);
		});

		it('should visualize the data it was given', function() {
			$.mv.positionTo($.mv.location.Atlanta);
			var data = $.mv.snapshot();
			$.mv.plot(data);

			expect($.mv.cache).toBeDefined();
			expect(_.toArray($.mv.cache).length).toEqual(data.length);
		});

		it('should be able to plot A LOT of data', function() {
			// generate test data for each location assuming everyone participated in the survey
			$.mv.positionTo($.mv.country.EPAM);

			var data = [];
			var distribution = [];
			_.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(el) {
				for (var i = 0; i < el; i++) {
					distribution.push(el);
				}
			}); 

			console.log(distribution);

			for (var loc in $.mv.location) {
				console.log("Generating data for: " + loc + "Expecting: " + $.mv.location[loc].headcount);
				for (var i = 0; i < $.mv.location[loc].headcount; i++) {
					data.push({
						name: loc + i,
						mood: distribution[Math.floor(Math.random() * (distribution.length))],
						timestamp: '20121210T091606',
						city: loc
					});
				}
			}

			console.log(data.length);

			$.mv.plot(data);
		});

		it('should be visible when new data comes in', function() {
			var new_data = {
				name: 'Minsk25',
				mood: 5,
				city: 'Minsk',
				timestamp: '20121210T130000'
			};

			$.mv.plot(new_data, true);
		});

	});

});