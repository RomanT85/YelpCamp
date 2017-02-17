var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comments.js");

var data = [
{name: "Shire", 
image: "/images/shire.jpg",
description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " },

{name: "Red Canyon's Rest", 
image: "/images/Red.canyon's-res.png",
description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.. " },

{name: "Desert Sands", 
image: "/images/desert-sands.png",
description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." }
]



function seedDB(){
	Campground.remove({}, function(err){
	if(err){
		consloe.log(err);
	} else {
	console.log("removed Campgrounds!"); 
	// data.forEach(function(seed){
	// 	Campground.create(seed, function(err, campground){
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			console.log("added a Campground!");
	// 			Comment.create(
	// 			{
	// 				text: "This place is great. I really enjoy it here, but i wish, that here could be an internet.",
	// 				author: "Ronja"
	// 			}, function(err, comment){
	// 				if(err){
	// 					console.log(err);
	// 				} else {
	// 					campground.comments.push(comment);
	// 					campground.save();
	// 					console.log("Created a new comment");
	// 				}
	// 			}
	// 			)
	// 		}
	// 	});
	// });
	}
	});
}

module.exports = seedDB;