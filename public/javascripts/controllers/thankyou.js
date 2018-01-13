app.controller('ThankyouCtrl', ['$routeParams', function($routeParams) {
  this.MESSAGE = {
    feedback: 'Thanks for your feedback.',
    donation: 'Thanks for your donation'
  };
  this.message = this.MESSAGE[$routeParams.type];
}]);
