var express         = require('express'),
    async           = require('async'),
    nodeGeoCoder    = require('node-geocoder'),
    router          = express.Router();

//require Schemas and middleware
var Campground      = require("../models/campground.js"),
    middlewareObj   = require("../middleware/index.js");

//Setup geocoder
var options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: 'your api key goes here',
        formatter: null
    };

var geoCoder = nodeGeoCoder(options);

//routes to Add Campgrounds location
router.get('/campgrounds/:id/location/add', middlewareObj.checkCampgroundOwnership, function(req, res, next) {
    Campground.findById(req.params.id, function(err, Campground) {
        if(err) {
            console.error(err);
            return next(err);
        } else {
            res.render('campgrounds/addLocation', {
                Campground: Campground,
                error: err
            });
        }
    });
});

router.post('/campgrounds/:id/location', middlewareObj.checkCampgroundOwnership, function(req, res, next) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.error(err);
            return next(err);
        } else {
           //Setup GeoCoder
            geoCoder.geocode(req.body.location, function(err, resdata) {
                if(err){
                    console.error(err);
                    return(err);
                } else {
                    console.log(resdata);
                    campground.street = resdata[0].formattedAddress;
                    var long = resdata[0].longitude;
                    var lat = resdata[0].latitude;
                    campground.location = {"type": "Point", "coordinates": [long, lat]};
                    campground.save(function(err) {
                        if(err) { 
                            console.error(err);
                            return next(err);
                        } else {
                            req.flash('success', 'You have successfully added location to the ' +campground.name+' campground.');
                            res.redirect('/campgrounds/'+campground._id);
                        }
                    });       
                }
            });
        }
    });   
});

module.exports = router;