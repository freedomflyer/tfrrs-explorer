'use strict';

angular.module('tfrrsExplorerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve:{
          'MyServiceData':function(MyService){
            // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
            return MyService.promise;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
