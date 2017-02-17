var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema();

var blogSchema = mongoose.Schema({
	stories: {
		title: String,
		text: String,
		created: {type: Date, default: Date.now},
		image: String
	},
	instructions: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Blog", blogSchema);