var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  url: {type: String},
  caption: {type: String}
});

var PersonSchema = new mongoose.Schema({
  name: {type: String},
  designation: {type: String},
  email: {type: String}
});

var CharitiesSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  abbreviation: {type: String},
  slug: {type: String, unique: true},
  imageUrl: {type: String},
  description: {type: String},
  lat: {type: String},
  lng: {type: String},
  contact: {type: String},
  website: {type: String},
  images: {type: [ImageSchema], default: []},
  persons: {type: [PersonSchema], default: []}
});

mongoose.model('Charity', CharitiesSchema);
