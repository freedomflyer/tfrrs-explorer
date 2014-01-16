'use strict';

angular.module('tfrrsExplorerApp')
  .service('MyService', function ($http) {
    var myData = null;

    var promise = $http.get('/teams').success(function (data) {
      myData = data;
    });	

    return {
      promise:promise,
      setData: function (data) {
          myData = data;
      },
      doStuff: function () {
          return myData;//.getSomeData();
      }
    };

  });
