
// This controller updates the badge in the navbar 'Current Deploys'
samson.controller("CurrentDeployBadgeCtrl", function($scope, $interval, Deploys) {
  $scope.deploysFactory = Deploys;
  $scope.count = 0;

  function refreshActiveCount() {
    $scope.deploysFactory.getActiveCount()
      .success(function(data) {
        if (data && data.count) {
          $scope.count = data.count;
          A.$('.badge').removeClass('hidden');
        } else {
          $scope.count = 0;
          A.$('.badge').addClass('hidden');
        }
      })
      .error(function() {
        // log?
      });
  }

  // Refresh the page every X milliseconds
  $interval(function() {
    refreshActiveCount();
  }, 5000);

  refreshActiveCount();
});

// This controller updates the Current Active Deploys list.
samson.controller("CurrentDeploysCtrl", function($scope, $window, $interval, Deploys) {
  function init() {
    $scope.deploysFactory = Deploys;
    $scope.deploysFactory.url = "/deploys/active.json";
    $scope.deploysFactory.load();

    // Refresh the page every X milliseconds
    $interval(function() {
      $scope.deploysFactory.load();
    }, 5000);
  }

  init();
});
