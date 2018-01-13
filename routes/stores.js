var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var config = require('../config/config');
// models
var Store = mongoose.model('Store');

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    Store.find({}, function(err, stores) {
      if (err) { return res.status(500).json(err); }

      return res.json(stores);
    });
  });


module.exports = router;
