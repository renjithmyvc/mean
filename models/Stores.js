var crypto = require('crypto');
var mongoose = require('mongoose');


var StoreSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  imageUrl: {type: String},
  bgColor: {type: String},
  redirectUrl: {type: String}
});

mongoose.model('Store', StoreSchema);
