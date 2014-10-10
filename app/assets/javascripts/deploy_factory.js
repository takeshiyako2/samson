samson.constant("MONTHS",
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
);

samson.constant("DAYS",
  [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
);

samson.constant('STATUS_MAPPING',
  {
    "running": "primary",
    "succeeded": "success",
    "failed": "danger",
    "pending": "info",
    "cancelling": "warning",
    "cancelled": "danger",
    "errored": "danger"
  }
);

samson.constant("StatusFilterMapping",
  {
    Successful: function(deploys) {
      return deploys.filter(function(deploy) {
        return deploy.status === "succeeded";
      });
    },

    Unsuccessful: function(deploys) {
      return deploys.filter(function(deploy) {
        return deploy.status === "failed" ||
          deploy.status === "cancelled" ||
          deploy.status === "errored";
      });
    },

    Unfinished: function(deploys) {
      return deploys.filter(function(deploy) {
        return deploy.status === "cancelling" ||
          deploy.status === "running" ||
          deploy.status === "pending";
      });
    }
  }
);

samson.filter("userFilter",
  function() {
    var hookSources = /^(?:travis|tddium|semaphore|jenkins)$/i;

    return function(deploys, userType) {
      if (userType !== undefined && userType !== null) {
        return deploys.filter(function(deploy) {
          return (deploy.user.name.match(hookSources) !== null) === (userType === "Robot");
        });
      }
      return deploys;
    };
  }
);

samson.filter("stageFilter",
  function() {
    return function(deploys, stageType) {
      if (stageType !== undefined && stageType !== null) {
        return deploys.filter(function(deploy) {
          return deploy.production == stageType;
        });
      }
      return deploys;
    };
  }
);

samson.filter("statusFilter",
  ["StatusFilterMapping", function(StatusFilterMapping) {
    return function(deploys, status) {
      if (status !== undefined && status !== null) {
        return StatusFilterMapping[status](deploys);
      }
      return deploys;
    };
  }]
);

samson.filter("visualizeStatus",
  ["STATUS_MAPPING", function(STATUS_MAPPING) {
    return function(status) {
      return STATUS_MAPPING[status];
    };
  }]
);

samson.filter("fullDate",
  function() {
    return function(local) {
      return local.day + ", " + local.date + " " + local.month + " " + local.year;
    };
  }
);

samson.filter("localize",
  ["DAYS", "MONTHS", function(DAYS, MONTHS) {
    return function(ms) {
      var localDate = new Date(parseInt(ms));

      var day    = DAYS[localDate.getDay()],
        year   = localDate.getFullYear(),
        date   = localDate.getDate(),
        month  = MONTHS[localDate.getMonth()];

      return {
        year: year,
        month: month,
        date: date,
        day: day
      };
    };
  }]
);

samson.factory("Deploys",
  ["$filter", "$window", "$http", "$timeout", function DeploysFactory($filter, $window, $http, $timeout) {
    var localize = $filter("localize");

    var Deploys = {
      entries: [],
      page: 1,
      loading: false,
      theEnd: false,
      url: "/deploys/recent.json",

      jumpTo: function(event) {
        $window.location.href = A.$(event.currentTarget).data("url");
      },

      shortWindow: function() {
        return !this.theEnd && $window.scrollMaxY === 0;
      },

      getActiveCount: function() {
        return $http.get('/deploys/active_count.json');
      },

      load: function(appendToEntries) {
        this.loading = true;
        if (!appendToEntries) { this.page = 1; }
        $http.get(this.url, { params: { page: this.page } }).
          success(function(data) {
            var deploys = data.deploys;

            // Clear any previous loading errors.
            A.$('#remoteLoadAlert').remove();

            if (deploys && deploys.length) {
              this.page += 1;
            } else if (deploys.length === 0) {
              this.theEnd = true;
              if (!appendToEntries) { this.entries = []; }
              return;
            }

            for (var i = 0; i < deploys.length; i++) {
              deploys[i].localized_updated_at = localize(deploys[i].updated_at);
              deploys[i].updated_at_ago = moment(deploys[i].updated_at).fromNow();
            }
            if (appendToEntries) {
              this.entries = this.entries.concat(deploys);
            } else {
              this.entries = deploys;
            }
          }.bind(Deploys)).
          error(function() {
            if (!A.$('#remoteLoadAlert').length) {
              A.$('#alerts').append('<div id="remoteLoadAlert" class="alert alert-warning">Failed to update list from server.</div>');
            }
          }).
          finally(function() {
            $timeout(function() { this.loading = false; }.bind(Deploys), 500);
          });
      },

      loadMore: function() {
        if (this.theEnd) { return; }
        this.load(true);
      }
    };

    angular.element($window).on("scroll", (function() {
      var html = document.querySelector("html");
      return function() {
        if ($window.scrollY >= html.scrollHeight - $window.innerHeight - 100 && !Deploys.loading) {
          Deploys.loadMore();
        }
      };
    })());

    return Deploys;
  }]
);
