angular.module('gservice', [])
	.factory('gservice', function($rootScope, $http){

		//Initialize variables
		var googleMapService = {};
		googleMapService.clickLat = 0;
		googleMapService.clickLong = 0;

		//Array of locations from API call
		var locations = [];

		//Initialized starting coordinates
		var selectedLat = 30.5931;
		var selectedLong = 114.3054;


		//Functions
		//--------------------------------------
		//Refresh the map with new data

		googleMapService.refresh = function(latitude, longitude, filteredResults){

			//clear the holding array of locations
			locations = [];

			//set the selected lat and long to the ones provided by the refresh()
			selectedLat = latitude;
			selectedLong = longitude;

			//if filtered in the refresh()....
			if(filteredResults){
				
				locations = convertToMapPoints(filteredResults);

				//Then, initialize the map
				initialize(latitude, longitude, true);
			} 

			//If no filter is provided
			else {
/*
				$http.get('/projects').success(function(response){
					locations = convertToMapPoints(response);
					initialize(latitude, longitude, false);
				}).error(function(){});
*/

					initialize(latitude, longitude, false);

			}


		} //end of googleMapService

		// Private inner functions
		//-------------------------------------

		//Convert JSON into map points
		var convertToMapPoints = function(response){

			//clear locations
			var locations = [];

			//Loop through the JSON provided
			for(var i = 0; i < response.length; i++){
				var project = response[i];

				//create a popup window for each record
                var  contentString = '<img style="height:100px" src="' + project.image + '"><p><b>Name</b>:' + project.name + '<br><b>Developer</b>: ' + project.developer + '<br><b>City</b>: ' + project.city + '</p>';
            
            	locations.push(new Location(
            		new google.maps.LatLng(project.location[1], project.location[0]),
            		new google.maps.InfoWindow({
            			content: contentString,
            			maxWidth: 320
            		}),
            		project.name,
            		project.developer
            		));
            } //end of for loop

            //location is now an array populated with records in Google Maps format
            return locations
		}  //end of function convertToMapPoints


        // Constructor for generic location
        var Location = function(latlon, message){
            this.latlon = latlon;
            this.message = message
        };
	
		//Initialize the map
		var initialize = function(latitude, longitude, filter){

			//Use the selected lat, long as starting point
			var myLatLng = {lat: selectedLat, lng: selectedLong};

			//if map has not been created...
			if(!map){

			//var styles1 = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
			var styles3 = [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}];


				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 5,
					scrollwheel: false,
					center: myLatLng,
					styles: styles3
				});
			} // end of if map not created

			//if a filter was used, set the search icons to yellow
			if(filter){
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
			} 
			else {
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
			}

			//loop through each location and place a marker
			locations.forEach(function(n, i){
				var marker = new google.maps.Marker({
					position: n.latlon,
					map: map,
					title: n.name,
					icon: icon,
				});

				//for each marker, add a listener that checks for clicks
				google.maps.event.addListener(marker, 'click', function(e){

					//when clicked, open the marker's message
					currentSelectedMarker = n;
					n.message.open(map, marker);

				});

			}); //end of locations.forEach

		}


        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;

	}); //end of factory call