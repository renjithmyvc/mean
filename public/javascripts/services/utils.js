app.service('Utils', function() {
  var utils = {};

  utils.keys = function(obj) {
    return Object.keys(obj);
  };

  return utils;
});
