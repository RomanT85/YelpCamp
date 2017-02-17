var express = require('express'),
	router 	= express.Router(),
	multer 	= require('multer');

var Blog 			= require('../models/blog'),
	Campground 		= require('../models/campground'),
	User 			= require('../models/user'),
	middlewareObj   = require("../middleware/index.js");
	

//Setup multer here
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('image');

router.post("/campgrounds/:id/blogs", middlewareObj.checkCampgroundOwnership, function(req, res, next) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) { 
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			upload(req,res,function(err) {
        		if(err) {
            		return res.end("Error uploading file.");
        		} else {
					var blog = new Blog();
					blog.stories.title = req.body.title;
					blog.stories.text = req.body.text;
					blog.stories.image = '/images/uploads/' + req.file.filename;
					blog.stories.created = Date.now();
					blog.author = {
						id: req.user._id,
						username: req.user.username
					};
					blog.save(function(err) {
						if(err) {
							req.flash('error', err.message);
							res.redirect('back');
						} else {
							campground.blogs.push(blog);
							campground.save(function(err) {
								if(err) {
									req.flash('error', err.message);
									res.redirect('back');
								} else {
									req.flash('success', "You have succesfully added blog to "+campground.name+".");
									res.redirect("/campgrounds/" + req.params.id);
								}
							});
						}
					});
				}
			});
		}
	});
});

router.put("/campgrounds/:id/blogs/:id", middlewareObj.checkCampgroundOwnership, function(req, res, next) {
	Blog.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, updatedBlog) {
		if(err) {
			req.flash('error', req.flash(err.message));
			res.redirect('back');
		} else {
			updatedBlog.save();
			req.flash("success", "Yuo have successfully updated blog");
			res.redirect('back');
		}
	});
});

router.post("campgrounds/:id/blogs/:id/image", middlewareObj.checkCampgroundOwnership, function(req, res, next) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			upload(req,res,function(err) {
        		if(err) {
            		return res.end("Error uploading file.");
        		} else {
					fondBlog.stories.image = '/images/uploads/' + req.file.filename;
					foundBlog.save(function(err) {
						if(err) {
							req.flash('error', err.message);
							res.redirect('back');
						} else {
							req.flash('success', "Yuo have successfully updated image for the blog "+foundBlog.stories.title+".");
							res.redirect('/campgrounds/' + req.params.id);
						}
					});
				}
			});
		}
	});
});

router.delete('/campgrounds/:id/blogs/:id', middlewareObj.checkCampgroundOwnership, function(req, res, next) {
	Blog.findByIdAndDelete(req.params.id, function(err) {
		if(err) {
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			req.flash('success', "You have successfully deleted blog.");
			res.redirect('back');
		}
	})
})

module.exports = router;