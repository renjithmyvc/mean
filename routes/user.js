var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Client = require('node-rest-client').Client;
var client = new Client();
var mailer = require('express-mailer');
var config = require('../config/config');
// models
var Doctor = mongoose.model('Doctor');
var Scriber = mongoose.model('Scriber');
var User = Doctor;

function setUserModel(req) {
  User = req.baseUrl.includes('doctor') ? Doctor : Scriber;
}

/**
 * Registers user if not exists.
 */
router.post('/register', function(req, res, next) {
  setUserModel(req);
  console.log(User);
  if(!req.body.firstName || !req.body.lastName || !req.body.password || !req.body.email){
    var errors = { errors: {register: {message: 'Please fill out all fields'}}};
    if (req.body.password.length < 6) {
      errors.errors['password'] = {message: 'Password should contain atlease 6 characters'};
    }
    return res.status(400).json(errors);
  }
  
  if (req.body.password.length < 6) {
    var errors = { errors: {}};
    errors.errors['password'] = {message: 'Password should contain atlease 6 characters'};
    return res.status(400).json(errors);
  }

    // Check user with email already exists.
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) { return res.status(500).json(err); }

    if (user) {
      return res.status(402).json({errors: {email: {message: 'Email already exists, please login'}}});
    }
    var user = new User();

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.setPassword(req.body.password);
    user.save(function (err){
      if(err){ return res.status(500).json(err); }
      return res.json({token: user.generateJWT()});
    });
  });
  
});


/**
 * Logs in user if credentials are valid.
 */
router.post('/login', function(req, res, next){
  setUserModel(req);
  if(!req.body.email || !req.body.password){
    return res.status(400).json({ errors: {login: {message: 'Please fill out all fields'}}});
  }

  passport.authenticate('local', {scope: req.baseUrl}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/**
 * Returns current user's updated details.
 */
router.put('/update-profile', auth, function(req, res, next) {
  setUserModel(req);
  var userPayload = req.payload;
  var user = {};
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phoneNumber = req.body.phoneNumber;
  user.address = req.body.address;
  
  if (userPayload) {
    User.findOne({_id: userPayload._id}, function(err, userData) {
      if (req.body.password) {
        userData.setPassword(req.body.password);
        userData.save();
      }
      
      if (err) { return res.status(500).json(err); }
      
      if (req.files) {
        var profileImage = req.files.profileImage;      
        user.profileImage = '/images/user-profiles/' + user._id + '/profile-image.jpg';
        // Use the mv() method to place the file somewhere on your server
        profileImage.mv(user.profileImage, function(err) {
          if (err)
            return res.status(500).send(err);
        });
      }
      User.update({_id: userPayload._id}, user, function(err, u) {
        if (err || !u) {
          return res.status(500).json({ errors: {currentUser: {message: 'User details not updated.'}}})
        }
  
        return res.json({token: userData.generateJWT()})
      });
    });
    
    
  } else {
    return res.status(400).json({ errors: {currentUser: {message: 'User not logged in.'}}});
  }
});


/**
 * Sends Instructions as Forgot password mail.
 */
router.post('/forgot-password', function(req, res, next) {
  setUserModel(req);
  if(!req.body.email){
    return res.status(400).json({ errors: {login: {message: 'Email is required'}}});
  }

  User.findOne({email: req.body.email}, function(err, user) {
    if (err) { return res.status(500).json(err); }
    // if not user found with the given email.
    if (!user) {
      return res.status(500).json({message: "Email does'nt exists in our records. Please, try again or sign up to create an acount."})
    }
    user.setResetPasswordToken();
    user.save(function(err, userData) {
      if (err) { return res.status(500).json(err); }
      res.mailer.send('../views/emails/forgot-password', {
        to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
        subject: 'Reset Password Instructions', // REQUIRED.
        user: userData
      }, function (err) {
        console.log(err);
        if (err) {
          // handle error
          res.status(500).json({message: 'There was an error sending the email'});
          return;
        }
        res.json({message: 'We have sent you the instructions. Please, follow the mail for resetting your password.'});
      });
    });
    
  });

});


/**
 * Resets user password when forgot if request token is valid as send in mail.
 */
router.post('/set-password', function(req, res, next) {
  setUserModel(req);
  if (!req.body.email || !req.body.password || !req.body.token) {
    return res.status(400).json({ errors: {setPassword: {message: 'Please fill all the fields'}}});
  }

  User.findOne({email: req.body.email, resetPasswordToken: req.body.token}, function(err, user) {

    if (err) { return res.status(500).json(err); }
    // if not user found with the given email and token.
    if (!user) {
      return res.status(500).json({errors: {setPassword: {message: "There is some mismatch in the email and token, please request for the password reset instructions again"}}})
    }
    user.setPassword(req.body.password);
    user.resetPasswordToken = null;
    user.save(function(err, userData) {
      if (err) { return res.status(500).json(err); }
      res.json({message: 'Your password reset is successfull, use your new password to login.'});
    });
  });
});


/**
 * Returns current user's updated details.
 */
router.post('/me', auth, function(req, res, next) {
  setUserModel(req);
  var user = req.payload;
  
  if (user) {
    User.findOne({_id: user._id}, function(err, user) {
      if (err || !user) {
        return res.status(500).json({ errors: {currentUser: {message: 'User doesn\'t exists.'}}})
      }

      return res.json({token: user.generateJWT()})
    });
    
  } else {
    return res.status(400).json({ errors: {currentUser: {message: 'User not logged in.'}}});
  }
});

router.post('/upload/profile-image', auth, function(req, res) {
  setUserModel(req);
  console.log(req.files);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  
  var user = req.payload;
 
  var profileImage = req.files.profileImage;
 
  // Use the mv() method to place the file somewhere on your server
  profileImage.mv('/images/user-profiles/' + user._id + '/profile-image.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
      res.status(200);
  });
});

module.exports = router;
