app.controller('CharitiesCtrl', ['Charity', function(Charity) {
  Charity.query({}, function(res) {
    this.charities = res;
  }.bind(this));
}]);
