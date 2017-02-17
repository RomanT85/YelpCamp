var express   = require('express'),
    app 	    = express(),
    User 	    = require("../models/user.js");


app.post("/compareuname", function(req, res, next) {
	User.find({username: req.body.username}, function(err, existingUser) {
		  if(err) res.send(err.message);
      if(existingUser.length > 0) {
        res.send("taken");
      }
      else {
        res.send('success');
      }
  });
});

app.post("/compareemail", function(req, res, next) {
  User.find({email: req.body.email}, function(err, existingUser) {
    if(err) res.send(err.message);
    if(existingUser.length > 0) {
      res.send('taken');
    }
    else {
      res.send('success');
    }
  });
});

app.post('/register', function(req, res, next) {
	var user = new User();
  user.email = req.body.email;
  user.name.firstname = req.body.firstname;
  user.name.lastname = req.body.lastname;
  user.username = req.body.username;
  user.password = req.body.password;
   
  user.save(function(err, user) {
      if (err) return next(err);
      req.logIn(user, function(err) {
          if (err) return res.send(err.message);
          res.send('success');
      });
  });
});

module.exports = app;