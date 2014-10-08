samson.controller("RecentDeploysCtrl", ["$scope", "$window", "$timeout", "$interval", "Deploys", "StatusFilterMapping",
function($scope, $window, $timeout, $interval, Deploys, StatusFilterMapping) {
  $scope.userTypes = ["Human", "Robot"];
  $scope.stageTypes = { "Production": true, "Non-Production": false };
  $scope.deployStatuses = Object.keys(StatusFilterMapping);

  $scope.deploysFactory = Deploys;
  $scope.deploysFactory.url = "/deploys/recent.json";
  $scope.deploysFactory.load();

  $timeout(function() {
    $('select').selectpicker();
  });
}]);
