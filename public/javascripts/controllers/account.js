app.controller('AccountCtrl', ['Donation', 'Auth', '$http', function(Donation, Auth, $http) {
  this.donations;
  this.invite = {};
  this.userTopDonation = null;
  this.currentUser = Auth.currentUser();
  Donation.query({}, function(donations) {
    this.donations = donations;
  }.bind(this));

  this.updateProfile = function() {
    Auth.updateProfile(this.currentUser).then(function(data) {
      Auth.saveToken(data.token);
      this.message = 'User details updated successfully.';
    }.bind(this)).catch(function(err) { 
      this.message = '';
      alert(err);
    }.bind(this));
  };

  this.invite = function() {
    if (!Auth.currentUser()) {
      return;
    }
    $http.post('api/userInvite', {email: this.inviteEmail}).then(function(res) {
      this.inviteEmail = null;
      this.inviteSuccess = true;
      Auth.saveToken(res.data.token);
    }.bind(this), function(err) {
      alert(err.message || "There's some error, please try again later.")
    });
  };

}]);
