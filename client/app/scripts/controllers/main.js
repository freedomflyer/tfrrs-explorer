'use strict';

angular.module('tfrrsExplorerApp')
  .controller('MainCtrl', function ($scope, MyService) {

    console.log('Promise is now resolved: ' + MyService.doStuff().data)
  	$scope.data = MyService.doStuff();
  	console.log($scope.data);


  	$scope.getRoster = function(url) {

	    var promise = $http.get('/teams').success(function (data) {
	      myData = data;
	    });	
	    
  	}

  });
