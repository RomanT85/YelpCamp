var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema();

var adminGroupSchema = mongoose.Schema({
	_id: {type: String},
	name: {type: String, default: ''},
	premissions: [{name: String, premit: Boolean}]
});
adminGroupSchema.index({name: 1}, {unique: true});

module.exports = mongoose.model('adminGroup', adminGroupSchema);