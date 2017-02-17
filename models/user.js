var mongoose 	= require("mongoose"),
	bcrypt 		= require('bcrypt-nodejs'),	
	crypto 		= require('crypto'); 	

var UserSchema = new mongoose.Schema({
	email: {type: String, unique: true, lowercase: true, required: true},
	name: {
		firstname: String,
		lastname: String
	},
  campgrounds: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Campground"
            }
  ],
  status: {type: Boolean, default: false},
	username: {type: String, unique: true, required: true},
	password: { type: String, required: true },
  	resetPasswordToken: String,
  	resetPasswordExpires: Date,
	created: {type: Date, default: Date.now},
	image: String
});


// Hash the password before saving it to the database
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.getFullName = function() {
  return this.name.firstname + ' ' + this.name.lastname;
}

//compare password in the database and the one that the user types in
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

//Admin premissions
UserSchema.methods.canPlayRoleOf = function(role) {
  if(role === "admin" && this.roles.admin) {
    return true;
  }
  else {
    return false;
  }
}

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({created: 1});
module.exports = mongoose.model("User", UserSchema);