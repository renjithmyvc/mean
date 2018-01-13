app.service('Facebook', [function() {
  var fb = {};

  fb.load = function() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
      fb.init();
    }(document, 'script', 'facebook-jssdk'));
  };

  fb.init = function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '159636114464123',//'179155282512206',//'159636114464123',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
      });
    }
  };

  fb.login = function(callback, scope) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        return scope[callback](response);
      }
      FB.login(scope[callback]);
    });
  };

  return fb;
}]);
