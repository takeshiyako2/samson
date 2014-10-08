samson.controller("CurrentDeploysCtrl", function($scope, $window, $interval, Deploys) {
  function init() {
    $scope.deploysFactory = Deploys;
    $scope.deploysFactory.url = "/deploys/active.json";
    $scope.deploysFactory.modalAlerts = false;
    $scope.deploysFactory.load();

    // Refresh the page every X milliseconds
    $interval(function() {
      console.log("Updating list...");
      $scope.deploysFactory.load();
    }, 3000);
  }

  init();
});
