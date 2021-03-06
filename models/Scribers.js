var crypto = require('crypto');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var ScriberSchema = new mongoose.Schema({
  address: {type: String},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, lowercase: true, unique: true},
  phoneNumber: {type: String},
  provider: {type: String},
  facebook_id: {type: String},
  hash: String,
  salt: String,
  resetPasswordToken: {type: String},
  profileImage: {type: String}
});

ScriberSchema.methods.setResetPasswordToken = function() {
  this.resetPasswordToken = crypto.randomBytes(8).toString('hex').toUpperCase();
};

ScriberSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};


ScriberSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

  return this.hash === hash;
};

ScriberSchema.methods.generateJWT = function() {

  // set expiration to 10 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 10);

  return jwt.sign({
    _id: this._id,
    address: this.address,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
    phoneNumber: this.phoneNumber
  }, 'SECRET');
};

mongoose.model('Scriber', ScriberSchema);
