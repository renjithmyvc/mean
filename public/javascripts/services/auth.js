app.factory('Auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
  var auth = {};

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
      return $http.post('/api/me').then(function(data) {
        auth.saveToken(data.data.token);
      });
    }
  };

  auth.register = function(user){
    return $http.post('/api/register', user).then(function(data){
      auth.saveToken(data.data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/api/login', user).then(function(data){
      console.log(data);
      auth.saveToken(data.data.token);
    });
  };

  auth.providerUser = function(facebookUserId, provider){
    var data = {};
    data['facebookUserId'] =  facebookUserId;
    return $http.post('/api/' + provider + '/user', data).then(function(data){
      auth.saveToken(data.data.token);
    });
  };

  auth.registerWithFacebook = function(user) {
    return $http.post('/api/login/facebook', user).then(function(data){
      auth.saveToken(data.data.token);
    });
  }

  auth.invite = function(inviteDetails) {
    return $http.post('/api/invite', inviteDetails).then(function(data){
      return data;
    });
  };

  auth.forgotPassword = function(email) {
    return $http.post('/api/forgot-password', email).then(function(data){
      return data;
    });
  };

  auth.setPassword = function(userDetails) {
  return $http.post('/api/set-password', userDetails).then(function(data){
      return data;
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('auth-token');
    $rootScope.$broadcast('userLoggedOut');
  };

  auth.updateProfile = function(userDetails) {
    return $http.put('/api/update-profile', userDetails).then(function(data){
      return data.data;
    });
  };

  return auth;
}])