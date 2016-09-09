var app = angular.module('queryController', ['gservice']);

app.controller('queryController', function($scope, $log, $http, $rootScope, gservice){

	$http.get('/projects').success(function(json){

		var lookup = {};
		var items = json;
		var result = [];

		for (var key in items){

			var name= items[key].developer;

			if(!(name in lookup)){
				lookup[name] = 1;
				result.push(items[key]);
			}
		}

		$scope.projectdevelopers = result;

	});

	//initialize variables
	$scope.formData = {};
	var queryBody = {};

	var startLat = 30.5931, startLong = 114.3054;

	//Functions
	$scope.openDetails = function(queryProject){
		this.name = queryProject.name;
		this.developer = queryProject.developer;
		this.status = queryProject.status;
		this.image = queryProject.image;
		this.year = queryProject.year;
	}

	//Query paraments incorporated into a JSON queryBody
	$scope.queryProjects = function(){
		//Assemble queryBody
		queryBody = {
			developer: $scope.formData.developer,
		};

		//Post the queryBody to the /query POST route to retrieve filtered results
		$http.post('/query', queryBody)
			.success(function(queryResults){

				//Pass the filtered results to the gMaps service and refresh the map
				gservice.refresh(startLat, startLong, queryResults);

				//count the number of records retrieved.
				$scope.queryCount = queryResults.length;
				$scope.developer = queryResults[0].developer;
				$scope.projectList = queryResults;
			})
			.error(function(queryResults){
				console.log('Error ' + queryResults);
			})
	};

});