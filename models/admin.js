var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema(),
	User 		= require('./user');

var adminSchema = mongoose.Schema({

	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User"
		},
	name: {
			type: String,
			default: ""
		}
	},
	groups: [{
		type: String,
		ref: "AdminGroup"
	}],
	premissions: [{
		name: String,
		premit: Boolean
	}],
	timeCreated: {
		type: Date,
		default: Date.now
	},
	search: String
});

adminSchema.methods.hasPremissionTo = function(controlAll) {

	var groupHasPremission = false;
	for(var i = 0; i < this.groups.length; i++) {
		for(var j = 0; j < this.groups[i].premissions.length; j++) {
			if(this.groups[i].premissions[j].name === controlAll) {
				if(this.groups[i].premissions[j].premit) {
					groupHasPremission = true;
				}
			}
		}
	}

	//Check for admin groups premissions
	for(var k = 0; k < this.premissions.length; k++) {
		if(this.premissions[k].name === controlAll) {
			if(this.premissions[k].premit) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	return groupHasPremission;
};
	//check for admin membership
	adminSchema.methods.isMemberOf = function(group) {
		for(var i = 0; i < this.groups.length; i++) {
			if(this.groups[i]._id === group) {
				return true;
			}
		}
		return false;
	};
	adminSchema.index({'user.id': 1});
	adminSchema.index({search: 1});

module.exports = mongoose.model("Admin", adminSchema);