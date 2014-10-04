'use strict';

angular.module('mainApp', [
  'ngRoute',
  'mainApp.nav',
  'mainApp.dashboard',
  'mainApp.plan'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
