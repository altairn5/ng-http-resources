var app = angular.module('wineApp', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/index.html',
      controller: 'WinesIndexCtrl'
    })
    .when('/wines/:id', {
      templateUrl: 'templates/show.html',
      controller: 'WinesShowCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);

app.factory("Wine", function($resource) {
  return $resource('http://daretodiscover.herokuapp.com/wines/:id')
});

app.controller('WinesIndexCtrl', ['$scope', 'Wine', function ($scope, Wine) {
  // variables we will use later
  $scope.wines = [];
  $scope.wine = {};

  // get all wines on page load
  Wine.query(function(data) {
    console.log("test")
    $scope.wines = data.reverse();
  });

  // user can create a new wine
  $scope.createWine = function() {
    // create a new wine
    Wine.save($scope.wine, function(newWine) {
      // clear the form
      $scope.wine = {};
      // add the new wine to the list
      $scope.wines.unshift(newWine);
    })
  };

  // user can delete a wine
  $scope.deleteWine = function(wine) {
    Wine.remove({id: wine.id}, function(response) {
      // remove that wine from the wines array
      var wineIndex = $scope.wines.indexOf(wine);
      $scope.wines.splice(wineIndex, 1);
    });
  };

}]);

app.controller('WinesShowCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.wine = {};
  $http.get('http://daretodiscover.herokuapp.com/wines/' + $routeParams.id)
    .then(function(response) {
      $scope.wine = response.data;
    }
  );
}]);