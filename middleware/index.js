var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var Rating = require('../models/rating');
var Blog = require('../models/blog');
var User = require("../models/user");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You don't have premission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You must be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You Don't have premission to do that!");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You must be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkRatingExists = function(req, res, next) {
	Campground.findById(req.params.id).populate("ratings").exec(function(err, foundCampground) {
		if(err) {
			req.flash('error', err.message);
			res.redirect('back');
		}
		for(var i = 0; i < foundCampground.ratings.length; i++) {
			if(foundCampground.ratings[i].author.id.equals(req.user._id)) {
				req.flash('success', "You already have rated this Campground");
				return res.redirect('/campgrounds/'+foundCampground._id);
			}
		}
		next();
	});
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Only users have premission to rate campgrounds.");
    res.redirect("/signin");
}


middlewareObj.loggedInStatus = function(req, res, next) {
	User.findById(req.user.id, function(err, foundUser) {
		if(foundUser.status === false) {
			foundUser.status = true;
		} else {
		foundUser.status = false;
	}
	next();
	});
}

module.exports = middlewareObj;