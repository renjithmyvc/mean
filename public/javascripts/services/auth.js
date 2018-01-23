app.factory('Auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
  var auth = {};

  auth.getRole = function() {
    return $window.location.hash.includes('scribers') ? 'scribers' : 'doctors';
  }

  auth.saveToken = function (token){
    $window.localStorage['auth-token'] = token;
    $rootScope.$broadcast('authTokenChanged', {token: token});
  };

  auth.getToken = function (){
    return $window.localStorage['auth-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  };

  auth.isTokenExpired = function() {
    var token = auth.getToken();
    if(token){
      var currentUser = JSON.parse($window.atob(token.split('.')[1]));
      return (currentUser.exp <= (Date.now() / 1000));
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload;
    }
  };

  auth.getUserToken = function() {
    if (auth.currentUser()) {
      return $http.post('/api/' + auth.getRole() + '/me').then(function(data) {
        auth.saveToken(data.data.token);
      });
    }
  };

  auth.register = function(user){
    return $http.post('/api/' + auth.getRole() + '/register', user).then(function(data){
      auth.saveToken(data.data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/api/' + auth.getRole() + '/login', user).then(function(data){
      auth.saveToken(data.data.token);
    });
  };

  auth.forgotPassword = function(email) {
    return $http.post('/api/' + auth.getRole() + '/forgot-password', email).then(function(data){
      return data;
    });
  };

  auth.setPassword = function(userDetails) {
  return $http.post('/api/' + auth.getRole() + '/set-password', userDetails).then(function(data){
      return data;
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('auth-token');
    $rootScope.$broadcast('userLoggedOut');
  };

  auth.updateProfile = function(userDetails) {
    return $http.put('/api/' + auth.getRole() + '/update-profile', userDetails).then(function(data){
      return data.data;
    });
  };

  return auth;
}])