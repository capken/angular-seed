'use strict';

angular.module('mainApp.plan', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plan', {
    templateUrl: 'view/plan.html',
    controller: 'PlanCtrl'
  });
}])
.controller('PlanCtrl', function(){
});
