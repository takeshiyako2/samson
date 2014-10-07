samson.factory("CurrentDeploys", function($http) {
  var factory = {
    getRecentDeploys: function () {
      return $http.get("/deploys/active.json");
    }
  }

  return factory;
});

samson.controller("CurrentDeploysCtrl", function($scope, $window, $interval, CurrentDeploys) {

  $scope.jumpTo = function(event) {
    $window.location.href = A.$(event.currentTarget).data("url");
  };

  function updateList() {
    CurrentDeploys.getRecentDeploys().success(function (data) {
      $scope.deploys = data.deploys;
      console.log("Size of deploys: " + data.deploys.length);
    });
  }

  updateList();

  // Refresh the page every X milliseconds
  $interval(function() {
    console.log("Updating list...");
    updateList();
  }, 3000);
});
