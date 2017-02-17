var express 		= require('express'),
	router 			= express.Router({mergeParams: true}),
	Campground 		= require('../models/campground'),
	Rating 			= require('../models/rating'),
	middlewareObj 	= require('../middleware');

	router.post('/', middlewareObj.isLoggedIn, middlewareObj.checkRatingExists, function(req, res, next){
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err) {
				return next(err);
				res.redirect('back');
			} 
			else if(req.body.rating){
				Rating.create(req.body.rating, function(err, rating) {
					if(err) {
						req.flash('error', err.message);
						res.redirect('back');
					}
					else {
						rating.author.id = req.user._id;
						rating.author.username = req.user.username;
						rating.save();
						foundCampground.ratings.push(rating);
						foundCampground.save();
						req.flash('success', "Successfully added rating.");
					}
				});
			}
			else {
				req.flash('error', "Please select a rating!");
			}
			res.redirect("/campgrounds/"+foundCampground._id);
		});
	});

module.exports = router;