app.directive('acceptNumber', ['$parse', function($parse){
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var tempValue, modelGetter;
      element.bind('keyup', function(){
        if(tempValue != this.value){
          this.value = this.value.replace(/[^0-9.]/g,'');

          if(this.value.indexOf('.') != this.value.lastIndexOf('.')){
            this.value = this.value.substring(0, this.value.lastIndexOf('.'));
            return false;
          }
          if(this.value.indexOf('.') > -1){
            this.value = this.value.substring(0, this.value.indexOf('.') + 3) // restrict to 2 decimal digits
            return false;
          }
          tempValue = this.value;
          modelGetter = $parse(attrs['ngModel']);
          // This returns a function that lets us set the value of the ng-model binding expression:
          var modelSetter = modelGetter.assign;
          // This is how you can use it to set the value 'bar' on the given scope.
          modelSetter(scope, tempValue);
          if(!scope.$$phase)
            scope.$apply();
        }
      });

    }
  };
}]);
