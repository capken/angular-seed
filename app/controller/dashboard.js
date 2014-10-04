'use strict';

angular.module('mainApp.dashboard', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'view/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])
.constant("ranges", 
  [0, 0.5, 1.0, 2.0, 4.0, 8.0, 24.0])
.constant("labelToRange", {
  '0.5H' : [  0,  0.5],
  '1H'   : [0.5,  1.0],
  '2H'   : [1.0,  2.0],
  '4H'   : [2.0,  4.0],
  '8H'   : [4.0,  8.0],
  '>8H'  : [8.0, 24.0]
})
.constant("optionOfChart", {
  title : { text: '异常情况时长' },
  tooltip : { trigger: 'axis' },
  legend: { data:['点检内容异常次数'] },
  xAxis : [{
    type : 'category',
    data : ['0.5H','1H','2H','4H','8H','>8H']
  }],
  yAxis : [{
    type : 'value'
  }],
  series : [{
    name:'点检内容异常次数',
    type:'bar',
    data:[0, 0, 0, 0, 0, 0]
  }]
})
.controller('DashboardCtrl', function(
      $scope, $http, ranges, labelToRange, optionOfChart) {
  $scope.data = [];
  $scope.records = [];

  $scope.endDate = new Date();
  $scope.startDate = new Date($scope.endDate - 3600000*24);

  $scope.equipments = [
    { 'name':'球磨机4系列 1段', 'code':1 },
    { 'name':'16.8m3电铲15号车', 'code':2 }
  ];
  $scope.equipId = 1;

  $scope.query = function() {
    $http.get('/app/data/sample.json').success(function(data) {
      var now = new Date('2014-09-24 13:00:00 +0800');

      angular.forEach(data, function(task, index) {
        var records = task.results;
        task['duration'] = 0;

        for(var i = records.length-1; i >= 0; i--) {
          var record = records[i];
          if(record.status == 0) break;

          var createdAt = new Date(record.created_at);
          task['firstExcep'] = createdAt;
          task['duration'] = Math.max(task['duration'],
            (now - createdAt)/3600000);
        }

      });

      $scope.data = data;
      $scope.records = $scope.filterBy([0, 24]).pop().content;
      chart.setSeries([
        $scope.seriesData(ranges)
      ]);

    });
  }

  $scope.seriesData = function(ranges) {
    var buckets = $scope.filterBy(ranges);
    var counts = []
    for(var i = 0; i < buckets.length; i++) {
      counts.push(buckets[i].content.length);
    }

    return {
      name:'点检内容异常次数',
      type:'bar',
      data: counts
    }
  }

  $scope.updateTable = function(label) {
    console.log('udpate:' + label);
    $scope.records = $scope.filterBy(labelToRange[label]).pop().content;
    console.log($scope.records);
  }

  $scope.filterBy = function(ranges) {
    var buckets = []
    for(var i = 0; i < ranges.length-1; i++) {
      buckets.push({
        min: ranges[i],
        max: ranges[i+1],
        content: []
      });
    }

    angular.forEach($scope.data, function(task) {
      for(var i = 0; i < buckets.length; i++) {
        var bucket = buckets[i]
        if(task.duration > bucket.min && 
            task.duration <= bucket.max) {
          bucket.content.push(task);
          break;
        }
      }
    });

    return buckets;
  }

  $scope.query();

  var chart = echarts.init(document.getElementById('chart'));
  chart.setOption(optionOfChart);
  chart.on(echarts.config.EVENT.CLICK, function(params) {
    angular.element(tableOfRecords).scope().
      $apply("updateTable('" + params.name + "')");
  });
});
