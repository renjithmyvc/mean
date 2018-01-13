app.controller('StoresCtrl', ['Store', 'Auth', function(Store, Auth) {
  Store.query({}, function(res) {
    this.stores = res;
  }.bind(this));

  var currentUser = Auth.currentUser();

  this.getUserRedirectUrl = function(url) {
    return url.replace("[user]", currentUser ? currentUser._id : '');
  };
}]);