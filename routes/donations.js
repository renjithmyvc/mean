var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
// models
var Store = mongoose.model('Store');
var User = mongoose.model('User');
var Donation = mongoose.model('Donation');

router.get('/', function(req, res, next) {
  var startDate = new Date();
  // Last 30 days.
  startDate.setDate( startDate.getDate() - 300 );
  var currentUser = req.payload;
  Donation.find({date: { $gt: startDate }, _user: currentUser._id}).sort({date: -1}).populate({path: '_charity', select: '_id name slug'}).populate({path: '_user', select: 'firstName lastName'}).exec(function(err, donations) {
    if (err) { return res.status(500).json(err); }

    return res.json(donations);
  });
});

router.get('/:receiptNumber/receipt', function(req, res, next) {
  var currentUser = req.payload;
  Donation.findOne({receiptNumber: req.param('receiptNumber'), _user: currentUser._id}).populate({path: '_charity', select: '_id name slug imageUrl'}).populate({path: '_user', select: 'firstName lastName'}).exec(function(err, donation) {
    if (err) { return res.status(500).json(err); }

    return res.json(donation);
  });
});

router.post('/', function(req, res, next){
  if(!req.body.charityId || !req.body.amount || parseInt(req.body.amount, 10) < 100){
    return res.status(400).json({message: 'Yenom amount is required, minimum of 100'});
  }

  var currentUser = req.payload;
  
  if (currentUser.approvedYenom <= parseInt(req.body.amount, 10)) {
    return res.status(400).json({message: 'You don\'t have suffiecient Yenom amount to donate'});
  }

  var donation = {
    amount: req.body.amount,
    date: Date.now(),
    _user: currentUser._id,
    _charity: req.body.charityId,
    // Generate receipt number
    receiptNumber: crypto.randomBytes(8).toString('hex').toUpperCase()
  };

  var approvedYenom = parseInt(currentUser.approvedYenom, 10) - parseInt(req.body.amount, 10);
  User.findOneAndUpdate({ _id: currentUser._id }, { $set: { approvedYenom: approvedYenom} }, { new: true }, function(err, user) {
    if (err) { return res.status(500).json(err); }
    Donation.create(donation, function(err, donation) {
      if (err) { return res.status(500).json(err); }

      return res.json({donation: donation, token: user.generateJWT()});
    });
  });
  
});

module.exports = router;
