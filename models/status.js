var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema;

var statusSchema = new Schema({
	 _id: { type: String },
    pivot: { type: String, default: '' },
    name: { type: String, default: '' }
});
	statusSchema.index({ pivot: 1 });
  	statusSchema.index({ name: 1 });

module.exports = mongoose.model('Status', statusSchema);