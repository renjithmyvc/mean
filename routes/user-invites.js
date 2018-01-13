var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');

router.post('/', function(req, res, next){
  if(!req.body.email){
    return res.status(400).json({message: 'Email is required'});
  }

  var currentUser = req.payload;
  if(req.body.email == currentUser.email){
    return res.status(400).json({message: "You can't invite yourself"});
  }

  if (currentUser.inviteCount > 4) {
    res.status(402).json({message: 'Max limit of invitations 5 for user exceeded.'});
   return;
  }
  var invite = new Invite();
  invite.setInviteCode();
  invite.save(function(err, Invite) {
    var inviteCount = currentUser.inviteCount + 1;
    User.findOneAndUpdate({ _id: currentUser._id }, { $set: { inviteCount: inviteCount} }, { new: true }, function(err, user) {
      res.mailer.send('../views/emails/invite', {
        to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
        subject: 'Yenom Invite Code', // REQUIRED.
        invite: invite,
        currentUser: currentUser
      }, function (err) {
        if (err) {
          // handle error
          
          res.status(500).json({message: err});
          return;
        }
        res.json({message: 'Thanks for inviting.', token: user.generateJWT()});
      });
    });
  });
  
});

module.exports = router;
