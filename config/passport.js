var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
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
