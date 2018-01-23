var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');
var Scriber = mongoose.model('Scriber');
var User = Doctor;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    if (req.baseUrl.includes('doctor')) {
      User = Doctor;
    } else {
      User = Scriber;
    }
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { errors: {email: {message: 'Email not found.' }}});
      }
      if (!user.validPassword(password)) {
        return done(null, false, { errors: {password: { message: 'Email and password does\'nt match.' }}});
      }
      return done(null, user);
    });
  }
));
