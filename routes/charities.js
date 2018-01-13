var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('../config/config');
// models
var Charity = mongoose.model('Charity');

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    Charity.find({}, '_id name slug imageUrl', function(err, charities) {
      if (err) { return res.status(500).json(err); }

      return res.json(charities);
    });
  });

router.route('/:slug')
  .get(function(req, res, next) {
    Charity.findOne({slug: req.param('slug')}, function(err, charity) {
      if (err) { return res.status(500).json(err); }

      return res.json(charity);
    });
  });

module.exports = router;
