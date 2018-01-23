app.controller('SignUpCtrl', ['$location', '$scope', '$window', '$routeParams', "Auth",
    function ($location, $scope, $window, $routeParams, Auth) {
  this.role = Auth.getRole();
  this.user = {};
  this.errors = null;
  this.user.inviteCode = $routeParams.inviteCode;
  this.fields = ['firstName', 'lastName', 'email', 'password', 'inviteCode', 'recaptcha'];

  this.authMode = ($location.path().indexOf('sign-up') > -1) ? 'sign-up' : 'login';

  this.showHelp = false;


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
      $location.url(Auth.getRole() + '/account');
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
      $location.url(Auth.getRole() + '/account');
    }).catch(function(res){
      this.errors = res.errors;
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
