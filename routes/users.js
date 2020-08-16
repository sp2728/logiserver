var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../config');
var passport = require('passport');

var router = express.Router();

router.use(bodyParser.json());

var User = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      res.json({ success: false, status: 'Login Unsuccessful' });
    }
    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
      else {
        res.json({ success: true, status: 'You are successfully logged in!' });
      }
    })
  })(req, res, next);
});

router.post('/signup', (req, res, next) => {
  console.log(req.body)
  User.create(req.body, (err, user) => {
    if (err) {
      next(err);
    }
    else if(user) {
      res.json({ success: true, status: 'Registration Successful!' });
    }
    else{
      res.json({ success: false, status: 'Registration Unsuccessful!' });
    }
  })
});

router.get('/profile/:username', (req, res, next) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      next(err);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'User Retrieved Successfully!', user: user });
  })
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true, status: 'Logout Successful!' });
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
