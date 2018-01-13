app.controller('ReceiptCtrl', ['$http', '$routeParams', '$location',
    function($http, $routeParams, $location) {
  var receiptNumber = $routeParams.receiptNumber;
  if (!receiptNumber) {
    $location.path('/stores');
    return;
  }
  this.donation;
  $http.get('/api/donations/' + receiptNumber + '/receipt').then(function(res) {
    this.donation = res.data;
  }.bind(this), function(res) {

  });
}]);
