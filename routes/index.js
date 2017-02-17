var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var multer 		= require('multer');
var User 		= require("../models/user.js");
var Campground 	= require('../models/campground');
var middlewareObj = require("../middleware/index.js");
var passportConf = require('../config/passport');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/avatars');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('image');


//===================================================
//ROOT ROUTE
//===================================================

function paginate(req, res, next) {
	var perPage = 4;
	var page = req.params.page || 1;
	var output = {
		data: null,
		pages: {
			current: page,
			prev: 0,
			hasPrev: false,
			next: 0,
			hasNext: false,
			total: 0
		},
		items: {
        	begin: ((page * perPage) - perPage) + 1,
        	end: page * perPage,
        	total: 0
      	}
	};
	Campground
	.find()
	.where('author.id').equals(req.user.id)
	.skip((page - 1) * perPage)
    .limit(perPage)
    .sort('desc')	
    .exec(function(err, foundCampgrounds) {
      	if(err) return next(err);

      	Campground.count().where('author.id').equals(req.user.id).exec(function(err, count) {
      		if(err) return next(err);
      		output.items.total = count;
      		output.data = foundCampgrounds;
        	output.pages.total = Math.ceil(output.items.total / perPage);
      		if(output.pages.current < output.pages.total) {
      			output.pages.next = Number(output.pages.current) + 1;
      		} else {
      			output.pages.next = 0;
      		}      
      		output.pages.hasNext = (output.pages.next !== 0);
      		output.pages.prev = output.pages.current - 1;
     	 	output.pages.hasPrev = (output.pages.prev !== 0);
      		if (output.items.end > output.items.total) {
        		output.items.end = output.items.total;
      		}
      		console.log(output);
      		res.render("profile/profilepage", {
    			campgrounds: foundCampgrounds,
    			output: output
    		});
      	});
    });
}

router.get("/", function(req, res){
	res.render("landing");
});

router.get("/profile", passportConf.isAuthenticated, middlewareObj.loggedInStatus, function(req, res, next){
	paginate(req, res, next);
});

router.get('/profile/page/:page', function(req, res, next){
	paginate(req, res, next);
});

// Edit Profile

router.get("/profile/:id/edit", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/profile");
		} else {
			res.render("profile/edit", {"User": foundUser});
		}
	});
});

router.put("/profile/:id", function(req, res){

	User.findByIdAndUpdate(req.params.id, req.body.User, function(err, updatedUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Dear user " + currentUser.username + "Your account has been updated!");
			res.redirect("/profile");
		}
	});
});

//Image upload
router.get('/profile/:id/upload', function(req, res) {
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/profile");
		} else {
			res.render("profile/upload", {"User": foundUser});
		}
	});
});

router.post('/profile/:id', function(req, res, next) {
	upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
 	User.findById(req.params.id, function(err, foundUser) {
 		var user = foundUser;
 		user.image = '/images/avatars/' + req.file.filename;
 		user.save();
 		req.flash("success", "Image has been added!");
 		res.redirect('/profile');
 	});
 });
});

router.post("/profile/:id/changepassword", function(req, res, next) {
	var password = req.body.cpassword;
	var newPassword = req.body.password;
	var confPassword = req.body.confpassword;
	User.findOne(req.params.id, function(err, user) {
		if(err) {
			req.flash('error', err);
			res.redirect('back');
		}
		if(!user.comparePassword(password)) {
			req.flash("error", "Wrong Password");
			res.redirect('back');
		}
		if(newPassword !== confPassword) {
			req.flash('error', 'password and confirm password do not match!');
			res.redirect('back');
		}
		else {
			user.password = newPassword;
			user.save(function(err, updtUser) {
				if(err) {
					req.flash('error', err);
					res.redirect('back');
				}
				else {
					req.flash('success', "You have successfully changed your password!");
					res.redirect("/profile");
				}
			});
		}
	});
});

//DELETE ROUTE

router.delete("/profile/:id", function(req, res){
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "You account has been removed!");
			res.redirect("/campgrounds");
		}
	});
});

//===================================================
//AUTHENTICATION ROUTES
//===================================================

//SIGN UP

router.get("/signin", function(req, res){
	res.render("register", {
    message: req.flash('errors')
  });
});

//LOG IN

router.post('/login', passport.authenticate('local-login',{
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get("/logout", middlewareObj.loggedInStatus, function(req, res){
	req.logout();
	req.flash("success", "Goodbye, Welcome back again!");
	res.redirect("/campgrounds");
});

//===================================================
//EXPORTS
//===================================================

module.exports = router;