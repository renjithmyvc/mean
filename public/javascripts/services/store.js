app.factory('Store', ['$resource', function($resource, $rootScope) {
  return $resource("api/stores/:id",
  {
    id: '@id'
  },
  {}
  );
}]);
