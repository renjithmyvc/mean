app.controller('AccountCtrl', ['Auth', '$http', function(Auth, $http) {

  this.currentUser = Auth.currentUser();

  this.updateProfile = function() {
    Auth.updateProfile(this.currentUser).then(function(data) {
      Auth.saveToken(data.token);
      this.message = 'User details updated successfully.';
    }.bind(this)).catch(function(err) { 
      this.message = '';
      alert(err);
    }.bind(this));
  };

}]);
