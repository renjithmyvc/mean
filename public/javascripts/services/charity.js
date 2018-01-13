app.factory('Charity', ['$resource', function($resource, $rootScope) {
  return $resource("api/charities/:slug",
  {
    slug: '@slug'
  },
  {}
  );
}]);