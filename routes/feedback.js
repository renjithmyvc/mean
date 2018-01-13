var express = require('express');
var router = express.Router();
var config = require('../config/config');


router.post('/', function(req, res, next){
  if(!req.body.type || !req.body.comments){
    return res.status(400).json({message: 'Type and comments are required'});
  }

  res.mailer.send('../views/emails/feedback', {
      to: config.admin.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
      subject: req.body.subject || 'New Feedback', // REQUIRED.
      req: req.body
    }, function (err) {
      if (err) {
        // handle error
        
        res.status(500).json({message: err});
        return;
      }
      res.json({message: 'Thanks for your feeback.'});
    });
  
});

module.exports = router;
