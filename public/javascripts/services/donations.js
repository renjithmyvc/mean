app.factory('Donation', ['$resource', function($resource, $rootScope) {
  return $resource("api/donations/:id",
  {
    id: '@id'
  },
  {}
  );
}]);
