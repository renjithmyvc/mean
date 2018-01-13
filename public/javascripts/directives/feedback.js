app.directive('feedBack', ['$http', '$location', function($http, $location) {
  return {
    templateUrl: 'templates/feedback.html',
    scope: {
      email: '='
    },
    link: function(scope, ele, attrs) {
      scope.feedBack = {};
      scope.showForm = false;
      scope.$watch('email', function(val) {
        scope.feedBack.email = scope.email;
      });


      scope.$on('$routeChangeSuccess', function(event, next, prev) {
        scope.showForm = false;
      });


      scope.submitFeedBack = function() {
        scope.helpMessage = '';
        if (!scope.feedBack.type || !scope.feedBack.comments) {
          scope.helpMessage = "Please fill Type and Comments to submit your feedback";
          return;
        }
        scope.error = false;
        scope.submitting = true;
        $http.post('api/feedback', scope.feedBack).success(function(res) {
          scope.submitting = false;
          scope.feedBack.type = null;
          scope.feedBack.comments = null;
          scope.showForm = false;
          $location.path('feedback/thankyou');
        }).error(function(error) {
          scope.submitting = false;
          scope.error = true;
        });
      };
    }
  };
}]);
