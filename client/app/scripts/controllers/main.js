'use strict';

angular.module('tfrrsExplorerApp')
  .controller('MainCtrl', function ($http, $scope, MyService) {

    console.log('Promise is now resolved: ' + MyService.doStuff().data);
  	$scope.data = MyService.doStuff();
  	console.log($scope.data);
    $scope.athletes = [{test:"testing"}];


  	$scope.getRoster = function(url) {

	    $http.get("/teams/roster" + url).success(function (data) {
        $scope.athletes = data;

        console.log($scope.athletes);

      }); 

  	}

    $scope.getStats = function(url) {
      var athleteID = url.match(/\d+/g)[0];  
      $http.get("/athlete/" + athleteID).success(function (data) {
      
        $scope.athleteData = data;
        console.log(data);

      }); 
    }


  });
