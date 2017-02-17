var express 	= require('express'),
	router 		= express.Router(),
	async		= require('async');

var User 		= require('../models/user.js'),
	Admin 		= require('../models/admin.js'),
	Campground	= require('../models/campground.js'),
	adminGroup 	= require('../models/adminGroups.js');

router.get('/adminpage', function(req, res, next) {
	User.find({}, function(err, allUsers) {
		if(err) return next(err);
		res.render('admin/index', {
			users: allUsers
		});
	});
});

router.get('/user/:id/view', function(req, res, next) {
	User.findById(req.params.id, function(err, foundUser) {
		if(err) throw err;
		res.render('admin/viewuser', {user: foundUser});
	});
});

router.get("/user:id/edit", function(req, res, next) {
	User.findById(req.params.id, function(err, foundUser) {
		if(err) throw err;
		res.render('admin/edituser', {user: foundUser});
	});
});

router.delete("/user/delete", function(req, res, next) {
	User.findByIdAndRemove(req.body.id, function(err) {
		if(err) throw err;
		res.send('success');
	});
});

module.exports = router;