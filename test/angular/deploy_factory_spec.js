describe("Deploy Factory", function() {
  var $scope, Deploys, $timeout, $httpBackend, $interval;

  beforeEach(function() {
    module("samson");

    inject(function(_$rootScope_, _$httpBackend_, _$interval_, _$timeout_, _Deploys_) {
      $scope = _$rootScope_.$new;
      $httpBackend = _$httpBackend_;
      $interval = _$interval_;
      $timeout = _$timeout_;

      // Factories are singletons anyway, so treat it as a global variable in tests.
      Deploys = _Deploys_;
    })
  });

  it("initial load should get 1 deploy", function() {
    $httpBackend.expectGET('/test?page=1').respond({
      "deploys": [
        {
          "id": 1,
          "updated_at": 1412847908000,
          "summary": "testFactory",
        }
      ]
    });
    Deploys.url = "/test";
    Deploys.load();
    $httpBackend.flush();
    expect(Deploys.url).toEqual("/test");
    expect(Deploys.entries.length).toEqual(1);
    expect(Deploys.entries).toEqual([
      {
        id : 1, updated_at : 1412847908000, summary : 'testFactory',
        localized_updated_at : {
          year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      }
    ]);
  });

  it("loadmore should add another entry to existing entries", function() {
    $httpBackend.expectGET('/test?page=1').respond({
      "deploys": [
        {
          "id": 1,
          "updated_at": 1412847908000,
          "summary": "testFactory",
        }
      ]
    });
    Deploys.url = "/test";
    Deploys.load();
    $httpBackend.flush();
    expect(Deploys.entries.length).toEqual(1);

    $httpBackend.expectGET('/test?page=2').respond({
      "deploys": [
        {
          "id": 2,
          "updated_at": 1412847908000,
          "summary": "testFactory 2",
        }
      ]
    });
    Deploys.loadMore();
    $httpBackend.flush();

    expect(Deploys.entries.length).toEqual(2);
    expect(Deploys.entries).toEqual([
      {
        id : 1, updated_at : 1412847908000, summary : 'testFactory',
        localized_updated_at : {
          year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      },
      {
        id: 2,
        updated_at: 1412847908000,
        summary: "testFactory 2",
        localized_updated_at : { year : 2014, month : 'October', date : 9, day : 'Thursday' },
        updated_at_ago : 'a day ago'
      }
    ]);
  });

});
