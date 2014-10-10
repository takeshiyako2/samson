describe("CurrentDeploys", function() {
  var $scope, $controller, $httpBackend, $interval;

  beforeEach(function() {
    module("samson");

    inject(function(_$rootScope_, _$controller_, _$interval_, _$httpBackend_, Deploys) {
      $scope = _$rootScope_.$new;
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
      $interval = _$interval_;

      createController = function() {
        return $controller('CurrentDeploysCtrl', {
          '$scope' : $scope,
          '$interval': $interval,
          "Deploys": Deploys
        });
      };

    })
  });

  it("should have get 1 active deploy", function() {
    $httpBackend.expectGET('/deploys/active.json?page=1').respond({
      "deploys": [{
        "id": 1,
        "updated_at": 1412847908000,
        "summary": "testsummary",
      }]
    });
    var controller = createController();
    $httpBackend.flush();
    expect($scope.deploysFactory.url).toEqual("/deploys/active.json");
    expect($scope.deploysFactory.entries.length).toEqual(1);
    expect($scope.deploysFactory.entries).toEqual([
      {
        id : 1, updated_at : 1412847908000, summary : 'testsummary',
        localized_updated_at : {
          year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      }
    ]);
  });

  it("should refresh from the server after interval elapses", function() {
    $httpBackend.expectGET('/deploys/active.json?page=1').respond({
      "deploys": [{
        "id": 1,
        "updated_at": 1412847908000,
        "summary": "testsummary",
      }]
    });
    var controller = createController();
    $httpBackend.flush();
    expect($scope.deploysFactory.url).toEqual("/deploys/active.json");
    expect($scope.deploysFactory.entries.length).toEqual(1);
    expect($scope.deploysFactory.entries).toEqual([
      {
        id : 1, updated_at : 1412847908000, summary : 'testsummary',
        localized_updated_at : {
          year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      }
    ]);

    $httpBackend.expectGET('/deploys/active.json?page=1').respond({
      "deploys": [{
        "id": 2,
        "updated_at": 1412847908000,
        "summary": "testsummary 2",
      }]
    });
    $interval.flush(6000);
    $httpBackend.flush();
    expect($scope.deploysFactory.entries.length).toEqual(1);
    expect($scope.deploysFactory.entries).toEqual([
      {
        id : 2, updated_at : 1412847908000, summary : 'testsummary 2',
        localized_updated_at : {
          year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      }
    ]);

  });


});
