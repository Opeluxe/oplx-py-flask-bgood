
    /* simple scripts file for Themes.guide Bootstrap 4 theme templates */

    // init Bootstrap tooltips & popovers
    $("[data-toggle=popover]").popover();
    $("[data-toggle=tooltip]").tooltip();
    
    
		/* bGood routines (general functionality) */		
		
		// functionality implementation
		function bGoodHeatmapList(mapId) {
			let testData = [];
			let cfgData = [];
			let cfg = {};
			let heatMap = {};
			testData[0] = {
			  max: 8,
			  data: [
					{lat: -11.996373999999999, lng:-77.122274000000004, count: 1},
					{lat: -12.067328000000000, lng:-77.135958000000002, count: 2},
					{lat: -12.064621000000001, lng:-77.141138999999995, count: 3},
					{lat: -12.026497000000001, lng:-77.129299000000003, count: 4},
					{lat: -12.052351000000000, lng:-77.100446000000005, count: 1},
					{lat: -12.065435000000001, lng:-77.125345999999993, count: 2},
				]
			};
			testData[1] = {
			  max: 8,
			  data: [
					{lat: -12.059260999999999, lng:-77.145044999999996, count: 1},
					{lat: -12.056901999999999, lng:-77.106470999999999, count: 2},
					{lat: -11.877879000000000, lng:-77.129620000000003, count: 3},
					{lat: -11.873447000000001, lng:-77.125005999999999, count: 4},
					{lat: -12.065397000000001, lng:-77.106847999999999, count: 1},
					{lat: -12.018653000000000, lng:-77.092150000000004, count: 2},
				]
			};
			
			cfgData[0] = {
				container: document.getElementById(mapId),
			  radius: 100,
			  scaleRadius: false,
			  useLocalExtrema: true,
			  latField: 'lat',
			  lngField: 'lng',
			  valueField: 'count',
				maxOpacity: .4,
				minOpacity: 0,
				blur: .8,
				gradient: {
					'.4': 'lightcoral',
					'.75': 'salmon',
					'.99': 'tomato'
				}
			};
			cfgData[1] = {
				container: document.getElementById(mapId),
				radius: 100,
				scaleRadius: false,
				useLocalExtrema: true,
				latField: 'lat',
				lngField: 'lng',
				valueField: 'count',
				maxOpacity: .2,
				minOpacity: 0,
				blur: .8,
				gradient: {
					'.4': 'cyan',
					'.75': 'aquamarine',
					'.99': 'dodgerblue'
				}
			};
			
			let mapCnt = 2;
			
			for (let i=0; i<mapCnt; i++){
				let heatMapId = 'heatmap'+i;
				if (heatMap[heatMapId]=== undefined) {
					cfg[heatMapId] = cfgData[i];
					heatMap[heatMapId] = new HeatmapOverlay(cfg[heatMapId]);
					heatMap[heatMapId].setData(testData[i]);
				};
			};
			return heatMap;
		};
		
		function bGoodCreateIcon(iconClass) {
			let icon = L.divIcon({
				className: 'marker-div-icon',
        html: "<div class='marker-pin bg-primary'></div>"+iconClass,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
			});
			return icon;
		};
		
		function bGoodMarkerList() {
			let iconMusic = bGoodCreateIcon("<i class='fas fa-microphone-alt awesome'>");
			let iconStore = bGoodCreateIcon("<i class='fas fa-store-alt awesome'>");
			let iconNight  = bGoodCreateIcon("<i class='fas fa-moon awesome'>");
			let markerList = L.layerGroup([
				L.marker([-11.996373999999999, -77.122274000000004], {icon: iconMusic}).bindPopup('<strong>Un concierto</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.067328000000000, -77.135958000000002], {icon: iconStore}).bindPopup('<strong>Una feria</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.064621000000001, -77.141138999999995], {icon: iconNight}).bindPopup('<strong>Una actividad nocturna</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.026497000000001, -77.129299000000003], {icon: iconMusic}).bindPopup('<strong>Un concierto más</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.052351000000000, -77.100446000000005], {icon: iconStore}).bindPopup('<strong>Una feria más</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.065435000000001, -77.125345999999993], {icon: iconNight}).bindPopup('<strong>Una actividad nocturna más</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.059260999999999, -77.145044999999996], {icon: iconMusic}).bindPopup('<strong>Otro concierto</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.056901999999999, -77.106470999999999], {icon: iconStore}).bindPopup('<strong>Otra feria</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-11.877879000000000, -77.129620000000003], {icon: iconNight}).bindPopup('<strong>Otra actividad nocturna</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-11.873447000000001, -77.125005999999999], {icon: iconMusic}).bindPopup('<strong>Otro concierto más</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.065397000000001, -77.106847999999999], {icon: iconStore}).bindPopup('<strong>Otra feria más</strong><br/><span> Info... </span><br/><a href="#">Más</a>'),
				L.marker([-12.018653000000000, -77.092150000000004], {icon: iconNight}).bindPopup('<strong>Otra actividad nocturna más</strong><br/><span> Info... </span><br/><a href="#">Más</a>')
			]);
			return markerList;
		};
		
		function bGoodHeatmapLayer(mapId) {
			let heatmap = bGoodHeatmapList(mapId);
			let markers = bGoodMarkerList();
			let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			});
			
			let colorFilter = [
				/*'blur:0px',
				'brightness:95%',
				'contrast:130%',
				'grayscale:20%',
				'hue:290deg',
				'opacity:100%',
				'invert:100%',
				'saturate:300%',
				'sepia:10%'*/
				'invert:30%',
				'hue:130deg',
				'saturate:700%',
				'brightness:90%',
				'contrast:200%'
			];

			let colorLayer = L.tileLayer.colorFilter('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
				attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
				filter: colorFilter
			});
			
			let lightFilter = [
				'brightness:110%',
				'hue:90deg',
				'saturate:120%'
			];

			let lightLayer = L.tileLayer.colorFilter('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				filter: lightFilter
			});
			
			let grayFilter = [
				'hue:180deg',
				'invert:100%'
			];

			let grayLayer = L.tileLayer.colorFilter('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				filter: grayFilter
			});
			
			let wcolorLayer = layer = new L.StamenTileLayer("watercolor");
			
			let tonerLayer = layer = new L.StamenTileLayer("toner");
			
			let baseMaps = {
				'<i class="far fa-route"></i> Calles': baseLayer,
				//'<i class="far fa-map"></i> Color': colorLayer,
				'<i class="far fa-route"></i> Claro': lightLayer,
				//'<i class="far fa-map"></i> Gris': grayLayer,
				'<i class="far fa-map"></i> B/N': tonerLayer,
				'<i class="far fa-map"></i> Acuarela': wcolorLayer
			};

			let overlayMaps = {
				'<i class="far fa-grin-stars"></i> Eventos': markers,
				'<i class="far fa-grin-wink"></i> Densidad': heatmap["heatmap1"],
				'<i class="far fa-meh-rolling-eyes"></i> Ocurrencias': heatmap["heatmap0"]
			};
			
			let map = new L.Map(mapId, {
			  center: new L.LatLng(-11.996373999999999, -77.122274000000004),
			  zoom: 14,
				minZoom: 6,
				maxZoom: 18,
			  layers: [baseLayer, markers]
			});
			
			L.control.layers(baseMaps, overlayMaps).addTo(map);
		};
		
		function bGoodNavCollapse(navbar, navItem, controls) {
			$(".nav-link").on('click', function (event) {
				$("#"+navbar).collapse('toggle');
				$("#"+controls).collapse('hide');
			});
			$(".navbar-toggler").on('click', function (event) {
				$("#"+controls).collapse('hide');
			});
			$("#"+navItem).on('click', function (event) {
				$("#"+navbar).collapse('hide');
			});
			$(".navbar-brand").on('click', function (event) {
				$("#"+navbar).collapse('hide');
				$("#"+controls).collapse('hide');
			});
		};
		
		function bGoodSetDisplay(timer, date) {
			const options = { 
				weekday: 'short', 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric', 
				hour: 'numeric', 
				minute: 'numeric' 
			};
			let holder = $('#'+timer+ ' strong');
			holder.text(date.toLocaleDateString('es-PE', options));
		}
		
		function bGoodSetDate(timer, year, month, day, hour, date, change = false) {
			let _year = date.getFullYear();
			let _month = date.getMonth();
			let _day = date.getDate();
			let _hour = date.getHours();
			if (change) {
				$('#'+year).val(_year);
				$('#'+month).val(_month);
				$('#'+day).val(_day);
				$('#'+hour).val(_hour);
			} else {
				$('#'+year).val(_year).change();
				$('#'+month).val(_month).change();
				$('#'+day).val(_day).change();
				$('#'+hour).val(_hour).change();	
			}
			bGoodSetDisplay(timer, date);
			bGoodGetData(date);
		};
		
		function bGoodUpdateTimer(timer, year, month, day, hour) {
			let _year = $('#'+year+' option:selected').val();
			let _month = $('#'+month+' option:selected').val();
			let _day = $('#'+day).val();
			let _hour = $('#'+hour).val();
			let maxDate = new Date(_year, parseInt(_month) + 1, 0, _hour, 0, 0, 0);
			let nowDate = new Date(_year, _month, _day, _hour, 0, 0, 0);
			let maxD = "" + maxDate.getDate();
			if ( maxD != _day ) {
				$('#'+day).prop('max',maxD);
			};
			if ( nowDate > maxDate ) {
				nowDate = maxDate;
			};
			bGoodSetDate(timer, year, month, day, hour, nowDate, true);
		};
		
		function bGoodSetTimer(timer, year, month, day, hour) {
			bGoodSetDate(timer, year, month, day, hour, new Date());
			$('#'+year).change( function() {
				$(this).find(":selected").each(function () {
					bGoodUpdateTimer(timer, year, month, day, hour);
				});
			});
			$('#'+month).change( function() {
				$(this).find(":selected").each(function () {
					bGoodUpdateTimer(timer, year, month, day, hour);
				});
			});
			$('#'+day).change(function() {
				bGoodUpdateTimer(timer, year, month, day, hour);
			});
			$('#'+hour).change(function() {
				bGoodUpdateTimer(timer, year, month, day, hour);
			});
		};
		
		function bGoodGetData(evdate) {
			let params = { date: evdate };
			const service = "https://oplx-py-flask-bgood.herokuapp.com/event";
			const proxyurl = "https://cors-anywhere.herokuapp.com/";
			let webservice = proxyurl + service;
			let jsondata = JSON.stringify(params);
			let y = new XMLHttpRequest();
			// same server
			y.open('POST', service);
			y.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			y.onload = function() {
			    alert(y.responseText);
			};
			y.send(jsondata);
			// remote server
			let x = new XMLHttpRequest();
			x.open('POST', webservice);
			x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			x.setRequestHeader('Access-Control-Allow-Origin', '*');
			x.onload = function() {
			    alert(x.responseText);
			};
			x.send(jsondata);
		};
				
		// SéBien variables and initialization		
		if ($("#eventMapId").length) {
			bGoodHeatmapLayer("eventMapId");
			bGoodNavCollapse("collapsingNavbar", "navTimer", "collapsingControls");
			bGoodSetTimer("navTimer", "navFormY", "navFormM", "navRangeD", "navRangeH");
		};