'use strict';

angular.module('mainApp.nav', ['ngRoute'])
.controller('navCtrl', function($scope, $location){
  $scope.pages = [
    { name: '点检计划', icon: 'glyphicon-tasks', route: '/plan' },
    { name: '点检看板', icon: 'glyphicon-stats', route: '/dashboard' }
  ];

  $scope.selected = function(route) {
    return $location.path() == route ? 'active' : '';
  }
});
