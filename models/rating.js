var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

var ratingSchema = new mongoose.Schema({

	rating: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Rating", ratingSchema);