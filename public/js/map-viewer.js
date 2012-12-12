(function($) {
	var COLORS = ["#FF0000", "DD2200", "BB4400", "996600", "778800", "55AA00", "44CC00", "22EE00", "11FA00", "#00FF00"];
	var IMAGES = ["1b.png", "2b.png", "3b.png", "4b.png", "5b.png", "6b.png", "7b.png", "8b.png", "9b.png", "10b.png"];

	var MV = function() {
		this.map = undefined;
		this.zoom = this.country.USA.zoom; // default
		this.center = this.country.USA.geo; // default
		this.cache = {};
		this.positions = {};

		$.mongohq.authenticate({ apikey: 'qjlg0aj5zrugwu00xjuu'});
	};

	var country = {
		EPAM: {
			geo: new google.maps.LatLng(50, -20),
			zoom: 3
		},
		USA: {
			geo: new google.maps.LatLng(38.000, -97.000),
			zoom: 5
		},
		Belarus: {
			geo: new google.maps.LatLng(53.3275, 27.4014),
			zoom: 6
		},
		Ukraine: {
			geo: new google.maps.LatLng(49.2144, 30.2937),
			zoom: 6
		},
		Canada: {
			geo: new google.maps.LatLng(46.0000, -71.0000),
			zoom: 5
		}
	};

	var location = {
		Atlanta: {
			geo: new google.maps.LatLng(33.7489, -84.3881),
			zoom: 10,
			headcount: 32
		},
		Astanta: {
			geo: new google.maps.LatLng(51.1667, 71.4167),
			zoom: 10,
			headcount: 44
		},
		Boston: {
			geo: new google.maps.LatLng(42.3583, -71.0603),
			zoom: 10,
			headcount: 7
		},
		Brest: {
			geo: new google.maps.LatLng(52.1333, 23.6667),
			zoom: 10,
			headcount: 91
		},
		Budapest: {
			geo: new google.maps.LatLng(47.5000, 19.0500),
			zoom: 10,
			headcount: 529
		},
		Dnipropetrovsk: {
			geo: new google.maps.LatLng(48.4500, 34.9833),
			zoom: 10,
			headcount: 72
		},
		Chicago: {
			geo: new google.maps.LatLng(41.8500, -87.6500),
			zoom: 10,
			headcount: 5
		},
		Gomel: {
			geo: new google.maps.LatLng(52.4167, 30.9833),
			zoom: 10,
			headcount: 207
		},
		Grodno: {
			geo: new google.maps.LatLng(53.6667, 23.8333),
			zoom: 10,
			headcount: 136
		},
		Houston: {
			geo: new google.maps.LatLng(29.7631, -95.3631),
			zoom: 10,
			headcount: 5
		},
		Izhevsk: {
			geo: new google.maps.LatLng(56.8333, 53.1833),
			zoom: 10,
			headcount: 113
		},
		Karaganda: {
			geo: new google.maps.LatLng(49.8631, 73.1936),
			zoom: 10,
			headcount: 191
		},
		Kharkiv: {
			geo: new google.maps.LatLng(50.0000, 36.2500),
			zoom: 10,
			headcount: 340
		},
		Krakow: {
			geo: new google.maps.LatLng(50.0614, 19.9372),
			zoom: 10,
			headcount: 61
		},
		Kyiv: {
			geo: new google.maps.LatLng(50.4500, 30.5233),
			zoom: 10,
			headcount: 1450
		},
		London: {
			geo: new google.maps.LatLng(51.5171, 0.1062),
			zoom: 10,
			headcount: 53
		},
		'Los Angeles': {
			geo: new google.maps.LatLng(34.0522, -118.2428),
			zoom: 10,
			headcount: 6
		},
		Lviv: {
			geo: new google.maps.LatLng(49.8333, 24.0000),
			zoom: 10,
			headcount: 413
		},
		Minsk: {
			geo: new google.maps.LatLng(53.9000, 27.5667),
			zoom: 10,
			headcount: 2800
		},
		Minneapolis: {
			geo: new google.maps.LatLng(44.9800, -93.2636),
			zoom: 10,
			headcount: 3
		},
		Mogilev: {
			geo: new google.maps.LatLng(53.9000, 30.3333),
			zoom: 10,
			headcount: 72
		},
		Moscow: {
			geo: new google.maps.LatLng(55.7517, 37.6178),
			zoom: 10,
			headcount: 232
		},
		'New York': {
			geo: new google.maps.LatLng(40.7142, -74.0064),
			zoom: 10,
			headcount: 100
		},
		Newtown: {
			geo: new google.maps.LatLng(40.2292, -74.9372),
			zoom: 10,
			headcount: 15
		},
		Orlando: {
			geo: new google.maps.LatLng(28.5381, -81.3794),
			zoom: 10,
			headcount: 2
		},
		Ryazan: {
			geo: new google.maps.LatLng(54.6167, 39.7333),
			zoom: 10,
			headcount: 214
		},
		'Saint-Petersburg': {
			geo: new google.maps.LatLng(59.9333, 30.3333),
			zoom: 10,
			headcount: 159
		},
		'San Diego': {
			geo: new google.maps.LatLng(32.7153, -117.1564),
			zoom: 10,
			headcount: 7
		},
		'San Francisco Bay Area': {
			geo: new google.maps.LatLng(37.7750, -122.4183),
			zoom: 10,
			headcount: 93
		},
		Samara: {
			geo: new google.maps.LatLng(53.2333, 50.1667),
			zoom: 10,
			headcount: 128
		},
		Seattle: {
			geo: new google.maps.LatLng(47.6097, -122.3331),
			zoom: 10,
			headcount: 13
		},
		'Sergiev Posad': {
			geo: new google.maps.LatLng(56.3067, 38.1414),
			zoom: 10,
			headcount: 26
		},
		Stockholm: {
			geo: new google.maps.LatLng(59.3300, 18.0700),
			zoom: 10,
			headcount: 10
		},
		Szeged: {
			geo: new google.maps.LatLng(46.2500, 20.1667),
			zoom: 10,
			headcount: 200
		},
		Togliatti: {
			geo: new google.maps.LatLng(53.4833, 49.5167),
			zoom: 10,
			headcount: 21
		},
		Toronto: {
			geo: new google.maps.LatLng(43.6481, -79.4042),
			zoom: 10,
			headcount: 50
		},
		Tver: {
			geo: new google.maps.LatLng(56.8667, 35.9167),
			zoom: 10,
			headcount: 42
		},
		Vinnytsya: {
			geo: new google.maps.LatLng(49.2333, 28.4833),
			zoom: 10,
			headcount: 59
		},
		Vitebsk: {
			geo: new google.maps.LatLng(55.1833, 30.1667),
			zoom: 10,
			headcount: 47
		},
		Wroclaw: {
			geo: new google.maps.LatLng(51.1167, 17.0333),
			zoom: 10,
			headcount: 15
		},
		Zurich: {
			geo: new google.maps.LatLng(47.3690, 8.5380),
			zoom: 10,
			headcount: 55
		}
	};

	MV.prototype.country = country;
	MV.prototype.location = location;

	MV.prototype.initialize = function() {
		if (!this.map) {
			var myStyle = [
				{
					featureType: "administrative",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
			 },
			 {
				featureType: "poi",
				elementType: "labels",
				stylers: [
					{ visibility: "off" }
				]
			 },
			 {
				featureType: "water",
				elementType: "labels",
				stylers: [
					{ visibility: "off" }
				]
			 },
			 {
				featureType: "road",
				elementType: "labels",
				stylers: [
					{ visibility: "off" }
				]
			 }
			];

			this.map = new google.maps.Map(document.getElementById("map_canvas"), {
				zoom: this.zoom,
				center: this.center,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				mapTypeControlOptions: {
        	mapTypeIds: ['mystyle', google.maps.MapTypeId.ROADMAP]
       	},
       	mapTypeId: 'mystyle',
				streetViewControl: false
			});

			this.map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle, { name: 'My Style' }));
		}
	};

	MV.prototype.positionTo = function(value) {
		this.center = value.geo;
		this.zoom = value.zoom;

		if (this.map) {
			this.map.setCenter(this.center);
			this.map.setZoom(this.zoom);
		}
	};

	MV.prototype.data = function() {
		var data = [];
		$.mongohq.documents.all({
			db_name: 'mood',
			col_name: 'raw',
			success: function(result) {
				console.log('Successfully received data from MongoHQ: ' + result.length);
				data = result;
			},
			error: function(e) {
				console.log('Error while posting a document to MongoHQ: ' + e);
				data = [];
			}
		});

		return data;
	}

	MV.prototype.snapshot = function() {
		// only return the most recent record for each person
		return _.map(_.groupBy(this.data(), 'name'), function(el) {
			idx = 0;
			if (el.length > 1) {
				return _.sortBy(el, 'timestamp')[el.length - 1];
			} else {
				return el[0];	
			}
		});
	};

	MV.prototype.everything = function() {
		return _.sortBy(this.data(), 'timestamp');
	};


	var direction = ["right", "down", "left", "up"];

	var mutation = {
		right: function(ll, step) {
			return new google.maps.LatLng(ll.lat(), ll.lng() + step);
		},
		down: function(ll, step) {
			return new google.maps.LatLng(ll.lat() - step, ll.lng());
		},
		left: function(ll, step) {
			return new google.maps.LatLng(ll.lat(), ll.lng() - step);
		},
		up: function(ll, step) {
			return new google.maps.LatLng(ll.lat() + step, ll.lng());
		}
	};


	MV.prototype._calculate_position = function(city) {
		// console.log('Figuring out position for: ' + city);
		if (!this.positions[city]) {
			// console.log('Not in the cache. Will create a new one');
			this.positions[city] = {
				last: this.location[city].geo,
				next: 0,
				counter: 1,
				step: 1
			};
		} else {
			// console.log('In cache. Will mutate');
			var last_pos = this.positions[city];
			var next_pos = mutation[direction[last_pos.next]](last_pos.last, 0.005);
			// console.log('Last position: ' + last_pos.last + ', New position: ' + next_pos);
			this.positions[city].last = next_pos;
			if (last_pos.counter - 1 === 0) {
				if (last_pos.next === 1 || last_pos.next === 3) {
					this.positions[city].step++;
				}
				this.positions[city].next = (last_pos.next > 2 ? 0 : last_pos.next + 1);
				this.positions[city].counter = this.positions[city].step;
			} else {
				this.positions[city].counter--;
			}
		}

		// console.log('Last/Next position for [' + city + ']: ' + JSON.stringify(this.positions[city]));
		return this.positions[city].last;
	};

	MV.prototype.plot = function(data, bounce) {
		for (var i = 0; i < data.length; i++) {
			try {		
				var marker = data[i];
				var image = "images/" + IMAGES[marker.mood - 1];
				
				// console.log('plotting: ' + JSON.stringify(marker));

				if (!this.cache[marker.name]) {
					this.cache[marker.name] = new google.maps.Marker({
						map: $.mv.map,
						clickable: true,
						title: marker.name,
						position: this._calculate_position(marker.city)
						// animation: (bounce ? google.maps.Animation.DROP : {})
					});
				}
				var moodImage = this.cache[marker.name];
				moodImage.setIcon(image);

			} catch (e) {
				console.log(e.message);
			}
		}
	};

	MV.prototype.clear = function() {
		for (var name in this.cache) {
			// console.log('Cleaning data point for: ' + name);
			this.cache[name].setMap(null);
			this.cache[name] = null;
			delete this.cache[name];
		}

		for (var city in this.positions) {
			this.positions[city] = null;
			delete this.positions[city];
		}
	};

	$.mv = new MV();

})(jQuery);