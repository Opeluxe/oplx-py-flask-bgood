
    /* simple scripts file for Themes.guide Bootstrap 4 theme templates */

    // init Bootstrap tooltips & popovers
    $("[data-toggle=popover]").popover();
    $("[data-toggle=tooltip]").tooltip();
    
    
		/* bGood routines (general functionality) */		
		
		// functionality implementation
		
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
		
		function bGoodSetDisplay(timer, date, message=false) {
			const options = { 
				weekday: (message) ? 'long' : 'short',
				year: 'numeric',
				month: (message) ? 'long' : 'short',
				day: 'numeric'
			};
			if (message==false) {
				options.hour = 'numeric';
				options.minute = 'numeric';
			};
			let holder = $('#'+timer+ ' strong');
			let text = date.toLocaleDateString('es-PE', options);
			if (message==false) {
				text = text.replace(/de /g, '');
			};
			holder.text(text);
		};
		
		function bGoodSetDate(timer, year, month, day, hour, date, toast, toastMsg, gData, gLayers, change=false) {
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
				$('#'+year).val(_year);
				$('#'+month).val(_month);
				$('#'+day).val(_day); //.change();
				$('#'+hour).val(_hour); //.change();	
			}
			bGoodSetDisplay(timer, date);
			if (change) {
				bGoodGetData(date, "event", toast, toastMsg, gData, gLayers);
				bGoodGetData(date, "overlay", toast, toastMsg, gData, gLayers);
			} else {
				bGoodExploitData(date, "event", gData, gLayers);
				bGoodExploitData(date, "overlay", gData, gLayers);
			};
		};
		
		function bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers, change=false) {
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
			bGoodSetDate(timer, year, month, day, hour, nowDate, toast, toastMsg, gData, gLayers, change);
		};
		
		function bGoodSetRangeTip(tip, object, update=false) {
			if (update) {
				$('#'+tip).removeClass('invisible');
				$('#'+tip).addClass('visible');
				let _value = $('#'+object).val();
				$('#'+tip).text(_value);
			} else {
				$('#'+tip).removeClass('visible');
				$('#'+tip).addClass('invisible');
			};
		};
		
		function bGoodSetTimer(timer, year, month, day, hour, toast, toastMsg, tipD, tipH, gData, gLayers) {
			bGoodSetDate(timer, year, month, day, hour, new Date(), toast, toastMsg, gData, gLayers);
			bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers, true);
			bGoodSetRangeTip(tipD, day);
			bGoodSetRangeTip(tipH, hour);
			$('#'+year).change( function() {
				$(this).find(":selected").each(function () {
					bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers, true);
				});
			});
			$('#'+month).change( function() {
				$(this).find(":selected").each(function () {
					bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers, true);
				});
			});
			$('#'+day).change(function() {
				bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers);
				bGoodSetRangeTip(tipD, day);
			});
			$('#'+hour).change(function() {
				bGoodUpdateTimer(timer, year, month, day, hour, toast, toastMsg, gData, gLayers);
				bGoodSetRangeTip(tipH, hour);
			});
			$('#'+day).on("input", function() {
				bGoodSetRangeTip(tipD, day, true);
			});
			$('#'+hour).on("input", function() {
				bGoodSetRangeTip(tipH, hour, true);
			});
		};
		
		function bGoodGetData(evdate, for_url, toast, toastMsg, gData, gLayers) {
			const service = "oplx-py-flask-bgood.herokuapp.com";
			let webservice = 'https://' + service + '/' + for_url;
			let params = { date: evdate, period: true };
			let jsondata = JSON.stringify(params);
			let x = new XMLHttpRequest();
			x.responseType = 'json';
			if (service == location.hostname) {
				// same server
				x.open('POST', webservice);
				x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			} else {
				// remote server
				const proxyurl = "https://cors-anywhere.herokuapp.com/";
				webservice = proxyurl + webservice;
				x.open('POST', webservice);
				x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			}
			x.onload = function() {
					bGoodExtractData(for_url, x.response, gData);
					bGoodExploitData(evdate, for_url, gData, gLayers)
					$('#'+toast).toast('hide');
			};
			bGoodSetDisplay(toastMsg, evdate, true);
			$('#'+toast).toast('show');
			x.send(jsondata);
		};
		
		function bGoodExtractData(kind, response, gData) {
			switch (kind) {
				case "event":
					gData.eventData = response;
					break;
				case "overlay":
					gData.overlayData = response;
					break;
				default:
					break;
			};
		};
		
		function bGoodExploitData(evdate, kind, gData, gLayers) {
			switch (kind) {
				case "event":
					let filterEvent = bGoodFilterData(gData.eventData, evdate);
					bGoodUpdateEvent(filterEvent, gLayers);
					break;
				case "overlay":
					let filterOverlay = bGoodFilterData(gData.overlayData, evdate);
					bGoodUpdateOverlay(filterOverlay, gLayers);
					break;
				default:
					break;
			};
		};
		
		function bGoodFilterData(data_, date_) {
			let filterData = [];
			for (let i=0; i<data_.length; i++) {
				let filter = data_[i];
				let datetime = date_.getTime();
				if (filter['DateFrom']<=datetime && filter['DateTo']>=datetime) {
					filterData.push(filter);
				};
			};
			return filterData;
		};
		
		function bGoodUpdateEvent(response, gLayers) {
			gLayers.eventGroup.clearLayers();
			for (let i=0; i<response.length; i++) {
				let event = response[i];
				let marker = L.marker(bGoodEventLatLng(event), {icon: bGoodEventIcon(event)}).bindPopup(bGoodEventPopup(event));
				gLayers.eventGroup.addLayer(marker);
			};
		};
		
		function bGoodEventLatLng(event_) {
			return [event_['Lat'], event_['Long']];
		};
		
		function bGoodEventIcon(event_) {
			let html = "<div class='marker-pin bg-primary'></div>";
			switch (event_['Type']) {
				case 'Concierto':
					html += "<i class='fas fa-microphone-alt awesome'>";
					break;
				case 'Feria':
					html += "<i class='fas fa-store-alt awesome'>";
					break;
				case 'Nocturna':
					html += "<i class='fas fa-moon awesome'>";
					break;
				default:
					html += "<i class='fas fa-question awesome'>";
					break;
			};
			let icon = L.divIcon({
				className: 'marker-div-icon',
        html: html,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
			});
			return icon;
		};
		
		function bGoodEventPopup(event_) {
			let title = '<strong>' + event_['Name'] + '</strong>';
			let description = '<span>'+ event_['Description'] + '</span>';
			let place = '<span>Lugar: ' + event_['Place'] + '</span>';
			let more = '<a href="#' + event_['Link'] + '">Más</a>';
			let popup = title + '<br/>' + description + '</br>'+ place +'<br/>' + more;
			return popup;
		};
		
		function bGoodUpdateOverlay(response, gLayers) {
			const initialData = {
			  max: 8,
			  data: []
			};
			let overlayData = {};
			
			for (let i=0; i<response.length; i++) {
				let overlay = response[i];
				if (overlayData[overlay['Type']]===undefined) {
					//overlayData[overlay['Type']] = initialData;
					overlayData[overlay['Type']] = jQuery.extend(true, {}, initialData);
				};
				let item = {lat: overlay['Lat'], lng: overlay['Long'], count: overlay['Intensity']};
				overlayData[overlay['Type']].data.push(item);
			};
			
			Object.keys(overlayData).forEach(function(key) {
				if (gLayers.overlayGroup[key]!==undefined) {
					gLayers.overlayGroup[key].setData(overlayData[key]);
				};
			});
			
		};
		
		function bGoodStartOverlay(mapId) {
			const overlay = ['Density', 'Issue'];
			const initialData = {
			  max: 8,
			  data: []
			};
			const gradient = {
				Density: {
					'.4': 'cyan',
					'.75': 'aquamarine',
					'.99': 'dodgerblue'
				},
				Issue: {
					'.4': 'lightcoral',
					'.75': 'salmon',
					'.99': 'tomato'
				}
			};
			
			let config = {
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
				gradient: { }
			};
			let overlayGroup = {};
			
			for (let i=0; i<overlay.length; i++) {
				if (overlayGroup[overlay[i]]=== undefined) {
					let overlayCfg = jQuery.extend(true, {}, config);
					overlayCfg.gradient = gradient[overlay[i]];
					overlayGroup[overlay[i]] = new HeatmapOverlay(overlayCfg);
					overlayGroup[overlay[i]].setData(initialData);
				};
			};
			return overlayGroup;
		};
		
		function bGoodStartMap(mapId, latLng, gLayers) {
			gLayers.overlayGroup = bGoodStartOverlay(mapId);
			
			let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
			//let tonerLayer = layer = new L.StamenTileLayer("toner");
			let tonerLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				ext: 'png'
			});
			
			//let wcolorLayer = layer = new L.StamenTileLayer("watercolor");
			let wcolorLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				ext: 'jpg'
			});
			
			let baseMaps = {
				'<i class="far fa-route"></i> Calles': baseLayer,
				'<i class="far fa-route"></i> Claro': lightLayer,
				'<i class="far fa-map"></i> B/N': tonerLayer,
				'<i class="far fa-map"></i> Acuarela': wcolorLayer
			};

			let overlayMaps = {
				'<i class="far fa-grin-stars"></i> Eventos': gLayers.eventGroup,
				'<i class="far fa-grin-wink"></i> Densidad': gLayers.overlayGroup['Density'],
				'<i class="far fa-meh-rolling-eyes"></i> Ocurrencias': gLayers.overlayGroup['Issue'],
				'<i class="far fa-meh-rolling-eyes"></i> Población': gLayers.geoGroup
			};
			
			let map = new L.Map(mapId, {
			  center: latLng,
			  zoom: 14,
				minZoom: 6,
				maxZoom: 18,
			  layers: [baseLayer, gLayers.eventGroup]
			}); //.fitWorld();
			
			L.control.layers(baseMaps, overlayMaps).addTo(map);
			
			//map.locate({setView: true, maxZoom: 16});
			
			let geocoder = L.Control.geocoder({
			  defaultMarkGeocode: false,
				expand: "click"
			}).on('markgeocode', function(e) {
				map.setView(e.geocode.center, 15);
			}).addTo(map);
			
		};
		
		function bGoodStartLocation(gCtrls, gData, gLayers) {
			const geoOptions = {
				enableHighAccuracy: true,
				maximumAge: 7000,
				timeout: 5000
			};
			let latLng = {};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					function (position) {
						latLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
						bGoodDefineLocation(gCtrls, gData, gLayers, latLng);
					}, 
					function (err) {
						bGoodDefineLocation(gCtrls, gData, gLayers, latLng);
					}, 
					geoOptions);
			} else {
				bGoodDefineLocation(gCtrls, gData, gLayers, latLng);
			};
		};
		
		function bGoodDefineLocation(gCtrls, gData, gLayers, latLng) {
			if (jQuery.isEmptyObject(latLng)) {
				$.getJSON('https://ipapi.co/json/', function(data) {
					latLng = new L.LatLng(data.latitude, data.longitude);
				}).always(function() {
					if (jQuery.isEmptyObject(latLng)) {
						latLng = new L.LatLng(-12.0551, -77.04506);
					};
					bGoodStartMapTimer(gCtrls, gData, gLayers, latLng);
				});
			} else {
				bGoodStartMapTimer(gCtrls, gData, gLayers, latLng);
			};
		};
		
		function bGoodStartMapTimer(gCtrls, gData, gLayers, latLng) {
			bGoodStartMap(gCtrls.mapCanvas, latLng, gLayers);
			bGoodSetTimer(gCtrls.navbarDate, gCtrls.navbarFYear, gCtrls.navbarFMonth, 
										gCtrls.navbarFDay, gCtrls.navbarFHour, gCtrls.mapAlert, 
										gCtrls.mapAlertMsg, gCtrls.navbarFTipD, gCtrls.navbarFTipH, 
										gData, gLayers);
		};
		
		function bGoodSetGeoLayer(gData, gLayers) {
			//Test: add GeoJSON info as overlay
			let geolayer = {};
			$.getJSON('/static/json/lima.geojson', function(data) {
				geolayer = L.geoJSON(data, {
					style: function(feature) {
						return {
							color: bGoodGeoColor(feature.properties.POBLACION),
							opacity: .6,
							fillColor: bGoodGeoColor(feature.properties.POBLACION),
							fillOpacity: .4,
							weight: 1
						}
					}
				});
				gLayers.geoGroup.clearLayers();
				gLayers.geoGroup.addLayer(geolayer);
			});
			
		};
		
		function bGoodGeoColor(feature) {
			let color = '#ff0000';
			/*if (feature<172017) {
				color = '#0000ff';
			} else
			return color;*/
			switch (true) {
				case (feature <  12623): color = '#3effec'; break;
				case (feature <  38530): color = '#53e8d8'; break;
				case (feature <  72756): color = '#69d1c4'; break;
				case (feature < 111015): color = '#7ebab0'; break;
				case (feature < 172017): color = '#94a39c'; break;
				case (feature < 261864): color = '#a98c87'; break;
				case (feature < 350551): color = '#bf7573'; break;
				case (feature < 438994): color = '#d45e5f'; break;
				case (feature < 645313): color = '#ea474b'; break;
				default: color = '#ff3037'; break;
			};
			return color;
		};
				
		// SéBien variables and initialization
		let gDynLayers = {
			eventGroup: L.layerGroup(),
			overlayGroup: {},
			geoGroup: L.layerGroup()
		};
		let gDynData = {
			eventData: {},
			overlayData: {}
		};
		let gControls = {
			mapCanvas: "eventMapId",
			navbarMenu: "collapsingNavbar",
			navbarDate: "navTimer",
			navbarForm: "collapsingControls",
			navbarFYear: "navFormY",
			navbarFMonth: "navFormM",
			navbarFDay: "navRangeD",
			navbarFHour: "navRangeH",
			mapAlert: "myToast",
			mapAlertMsg: "myToastMsg",
			navbarFTipD: "rangeTipD",
			navbarFTipH: "rangeTipH"
		};

		if ($("#eventMapId").length) {
			bGoodNavCollapse(gControls.navbarMenu, gControls.navbarDate, gControls.navbarForm);
			bGoodStartLocation(gControls, gDynData, gDynLayers);
			bGoodSetGeoLayer(gDynData, gDynLayers);
		};