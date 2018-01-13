app.controller('ResetPasswordCtrl', ['$routeParams', 'Auth', function ($routeParams, Auth) {
  this.token = $routeParams.token;

  this.user = {};

  this.setPassword = function() {
    this.errors = {};
    var valid = true;
    if (!this.token) {
      return;
    }
    if (!this.user.email) {
      this.errors['email'] = {message: 'Please fill email'};
      valid = false;
    }
    if (!this.user.password || this.user.password.length < 6) {
      this.errors['password'] = {message: 'Password must be atleast 6 characters'};
      valid = false;
    }
    if (!valid) {
      return;
    }
    this.user.token = this.token;
    Auth.setPassword(this.user).then(function(res){
      this.passwordResetSuccess = true;
      this.message = res.data.message;
    }.bind(this)).catch(function(res){
      this.errors = res.errors;
    }.bind(this));
  };
}]);
