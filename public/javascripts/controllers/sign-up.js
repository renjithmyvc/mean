app.controller('SignUpCtrl', ['$location', '$scope', '$window', '$routeParams', "Auth", "Facebook",
    function ($location, $scope, $window, $routeParams, Auth, Facebook) {
  var self = this;
  // load Facebook
  Facebook.load();
  this.hideFbLoginBtn = false;
  this.user = {};
  this.errors = null;
  this.user.inviteCode = $routeParams.inviteCode;
  this.fields = ['firstName', 'lastName', 'email', 'password', 'inviteCode', 'recaptcha'];

  this.authMode = ($location.path().indexOf('sign-up') > -1) ? 'sign-up' : 'login';

  this.showHelp = false;

  $scope.$on('showLoginForm', function() {
    this.authMode = 'login';
  }.bind(this));

  this.recaptcha = {};

  /**
   * Recaptcha
   */
  this.initRecaptcha = function() {
    this.recaptcha.response = null;
    this.recaptcha.widgetId = null;
    this.recaptcha.verified = false;
  }
  
  this.initRecaptcha();

  this.recaptcha.key = "6LdP-SYTAAAAADZRHw0YdojBIjsEhjZv6Dk-MiSO";
  
  this.recaptcha.setResponse = function (response) {
    self.recaptcha.response = response;
    self.recaptcha.verified = true;
  };
  this.recaptcha.setWidgetId = function (widgetId) {
    self.recaptcha.widgetId = widgetId;
  };
  this.recaptcha.cbExpiration = function() {
    vcRecaptchaService.reload(self.recaptcha.widgetId);
    //self.recaptcha.response = null;
  };


  /**
   * SignIn calls either login or register based on user selection.
   */
  this.signIn = function() {
    if (!this.user.password || this.user.password.length < 6) {
      this.errors = {password: {message: 'Password should contain atleast 6 characters.'}};
      this.form.passwordField.$invalid = true;
      return;
    } else{
      this.form.passwordField.$invalid = false;
      this.errors = null;
    }
    if (this.form.$invalid) {
      return;
    }
    if (this.authMode == 'sign-up') {
      this.register();
    } else {
      this.logIn();
    }
  }

  /**
   * Register user.
   */
  this.register = function(){
    Auth.register(this.user).then(function(){
      $location.url('/account');
    }).catch(function(res){
      this.errors = res.errors;
      console.log(this.errors);
    }.bind(this));
  };

  /**
   * Logs in user.
   */
  this.logIn = function(){
    this.user.firstName = undefined;
    this.user.lastName = undefined;
    this.user.inviteCode = undefined;
    Auth.logIn(this.user).then(function(){
      $location.url('/account');
    }).catch(function(res){
      this.errors = res.errors;
    }.bind(this));
  };

  /**
   * Facebook callback after login popup closed.
   */
  this.fbLoginResponse = function(response) {
    if (response.authResponse.accessToken) {
      self.authMode = 'facebook';
      self.user.accessToken = response.authResponse.accessToken;
      var facebookUserId = response.authResponse.userID;
      Auth.providerUser(facebookUserId, 'facebook').then(function() {
        $location.url('/account');
      }).catch(function(res) {
        this.hideFbLoginBtn = true;
      }.bind(this));
      $scope.$apply();
    }
  };

  /**
   * Opens consent popup of Facebook.
   */
  this.showFbLogin = function() {
    Facebook.login('fbLoginResponse', this);
  };

  /**
   * Registers user with Invite Code.
   */
  this.registerWithFacebook = function() {
    if (!this.user.inviteCode) {
      this.errors = {password: {message: 'Enter Invite Code to Register.'}};
      return;
    } else {
      this.errors = null;
    }
    Auth.registerWithFacebook(this.user).then(function(){
      $location.url('/account');
    }).catch(function(res){
      this.errors = res.errors;
    }.bind(this));
  };

  /**
   * Sends an email to the admin that user has requested for an invite code.
   */
  this.sendInvite = function() {
    this.sendingInvite = true;
    this.message = null;
    this.error = null;
    Auth.invite(this.invite).then(function(res){
      this.invite = {};
      this.message = res.data.message;
      this.sendingInvite = false;
    }.bind(this)).catch(function(res){
      this.error = res.message;
      this.sendingInvite = false;
    }.bind(this));
  };

  /**
   * Sends an email to the user with instructions to reset his password.
   */
  this.forgotPassword = function() {
    this.sendingInstructions = true;
    this.message = null;
    this.error = null;
    Auth.forgotPassword(this.forgot).then(function(res){
      this.forgot = {};
      this.message = res.data.message;
      this.sendingInstructions = false;
    }.bind(this)).catch(function(res){
      this.error = res.message;
      this.sendingInstructions = false;
    }.bind(this));
  };

}]);
