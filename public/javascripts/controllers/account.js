app.controller('AccountCtrl', ['Donation', 'Auth', '$http', function(Donation, Auth, $http) {
  this.donations;
  this.invite = {};
  this.userTopDonation = null;
  this.currentUser = Auth.currentUser();
  Donation.query({}, function(donations) {
    this.donations = donations;
  }.bind(this));

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
