'use strict';

angular.module('tfrrsExplorerApp')
  .controller('MainCtrl', function ($http, $scope, MyService) {

    console.log('Promise is now resolved: ' + MyService.doStuff().data);
  	$scope.data = MyService.doStuff();
  	console.log($scope.data);
    $scope.athletes = [{test:"testing"}];


  	$scope.getRoster = function(url, index) {
	    $http.get("/teams/roster" + url).success(function (data) {
        $scope.athletes = data;
        $scope.selectedRoster = index;

        console.log($scope.athletes);

      }); 

  	}

    $scope.getStats = function(url, index) {

      var athleteID = url.match(/\d+/g)[0];  
      $http.get("/athlete/" + athleteID).success(function (data) {
        $scope.selectedAthlete = index;
        $scope.athleteData = data;
        console.log(data);
      }); 
    }
  });
