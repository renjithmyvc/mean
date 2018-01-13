app.controller('AppCtrl', ["$scope", "Utils", "Auth", "$window", "$location",
  function ($scope, Utils, Auth, $window, $location) {

  $scope.$on("$routeChangeSuccess", function(event, params) {
    this.showLogin = false;
    this.currentPath_ = params.$$route.originalPath;
    this.currentUser = Auth.currentUser();
    this.locationHash = $window.location.hash;
  }.bind(this));

  $scope.$on("authTokenChanged", function(event, data){
    this.currentUser = Auth.currentUser();
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  }.bind(this));

  this.Utils = Utils;

  this.showLoginForm = function() {
    this.showLogin = false;
    if (!Auth.currentUser()) {
      if (['/sign-up'].indexOf(this.currentPath_) > -1) {
        $location.path('/login');
      } else {
        $scope.$broadcast("showLoginForm");
        this.showLogin = true;
      }
    }
  }; 

  this.logOut = function() {
    Auth.logOut();
    this.currentUser = null;
  };
  
}]);
