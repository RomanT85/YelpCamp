//======================================
// DATABE SCHEMA SETUP
//======================================
var mongoose = require("mongoose"),
	Schema 	= mongoose.Schema;

var campgroundSchema = new Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog"
	}],
	street: String,
	location:{ 
        type: {type: String, default: "Point"},
		coordinates: {type: [Number], default: [0,0]}
    },
	created: {type: Date, default: Date.now},
	comments: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}
	],
	ratings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Rating"
		}
	],
	rating: {
		type: Number,
		default: 0
	}
});
campgroundSchema.index({location: 1});
campgroundSchema.index({name: 1});
campgroundSchema.index({location: '2dsphere'});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;