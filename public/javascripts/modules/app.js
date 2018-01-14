var app = angular.module('app', ['ngRoute', 'ngResource', 'ngSanitize', 'vcRecaptcha']);

var resolveUserToken = {
  token: ['Auth', function(Auth) {
    if (Auth.currentUser())  {
      return Auth.getUserToken().then(function(res) {
        return res;
      }, function(error) { return error;});
    } else {
      return true;
    }
  }]
};


app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'ctrl',
      requiredUser: false
    })
    .when('/sign-up', {
      templateUrl: 'templates/sign-up.html',
      requiredUser: false,
      redirectUrl: '/'
    })
    .when('/reset-password', {
      templateUrl: 'templates/reset-password.html',
      controller: 'ResetPasswordCtrl',
      controllerAs: 'resetPasswordCtrl',
      requiredUser: false,
      redirectUrl: '/'
    })
    .when('/account', {
      templateUrl: 'templates/account.html',
      controller: 'AccountCtrl',
      controllerAs: 'ctrl',
      requiredUser: true,
      resolve: resolveUserToken,
    })
    .when('/examination', {
      templateUrl: 'templates/examination.html',
      requiredUser: true,
      resolve: resolveUserToken,
    })
    .when('/reports', {
      templateUrl: 'templates/reports.html',
      requiredUser: true,
      resolve: resolveUserToken,
    })
    .otherwise({redirectTo:'/'});
}]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.run(['$rootScope', 'Auth', '$location', '$http', function($rootScope, Auth, $location, $http) {

  $rootScope.$on('$routeChangeStart', function(event, next, prev) {
    document.querySelector('.modal-backdrop') &&
        document.querySelector('.modal-backdrop').remove();
    document.body.classList.remove('modal-open');

    // if token expired, call logout -> removes token from localstorage.
    if (Auth.isTokenExpired()) {
      event.preventDefault();
      Auth.logOut();
      $location.url('/login');
      return;
    }
    if (!Auth.isLoggedIn()) {
      if (next.$$route.requiredUser) {
        event.preventDefault();
        $location.url('/');
        return;
      }
    } else {
      if (!next.$$route.requiredUser && next.$$route.redirectUrl) {
        event.preventDefault();
        $location.url(next.$$route.redirectUrl);
        return;
      }
    }
    $http.defaults.headers.common.Authorization = 'Bearer '+ Auth.getToken();
  });
}]);
