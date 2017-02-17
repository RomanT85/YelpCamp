var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comments.js");
var User = require("../models/user.js");
var middlewareObj = require("../middleware/index.js");
var passportConf = require('../config/passport');

//===================================================
//COMMENT ROUTES
//===================================================

router.get("/new", passportConf.isAuthenticated, function(req, res){
	Campground.findById(req.params.id, function(err, Campground){
		if(err){
			req.flash("error", err.message);
			console.log(err);
		} else {
			res.render("comments/new", {Campground: Campground});
		}
	});
});

router.post("/", passportConf.isAuthenticated, function(req, res){
	Campground.findById(req.params.id, function(err, Campground){
		if(err){
			req.flash("error", err.message);
			console.error(err);
			redirect("/campgrounds");
		} else {
			console.log(req.body.Comment);
			Comment.create(req.body.Comment, function(err, Comment){
				if(err){
					req.flash("error", err.message);
					console.log(err);
				} else {
					Comment.author.id = req.user._id;
					Comment.author.username = req.user.username;
					Comment.author.image = req.user.image;
					Comment.save();
					Campground.comments.push(Comment);
					Campground.save();
					req.flash("success", "New comment added successfully!");
					res.redirect("/campgrounds/" + Campground._id);
				}
			});
		}
	});
});

//Edit Comment routes

router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.render("comments/edit", {Campground_id: req.params.id, Comment: foundComment});
		}
	});
});

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.Comment, function(err, updatedComment) {
		if(err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			updatedComment.author.image = req.user.image;
			updatedComment.save();
			req.flash("success", "Comment is now updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Delete Comment Route

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
Comment.findByIdAndRemove(req.params.comment_id, function(err){
	if(err) {
		req.flash("error", err.message);
		res.redirect("back");
	} else {
		req.flash("success", "Comment deleted!");
		res.redirect("/campgrounds/" + req.params.id);
	}
});
});

module.exports = router;