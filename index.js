//===================================================
//APPLICATION REQUIREMENTS SETUP
//===================================================

var express 			= require("express"),
	bodyParser 			= require("body-parser"),
    	path 			= require('path'),
	session         	= require('express-session'),
	cookieParser 		= require('cookie-parser'),
	morgan 				= require('morgan'),
	flash           	= require('express-flash'),
	methodOverride 		= require("method-override"),
	mongoose 			= require("mongoose"),
	passport 			= require('passport'),
	MongoStore      	= require('connect-mongo/es5')(session),
	secret				= require('./config/secret'),
	User 				= require("./models/user.js"),
	Comment 			= require("./models/comments.js"),
	Campground 			= require("./models/campground.js");

var app 				= express();

// CONNECTION EVENTS
mongoose.connect(secret.database);
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//===================================================
//PASSPORT CONFIGURATION
//===================================================
app.use(cookieParser());
app.use(require("express-session")({
	secret: secret.secretKey,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ url: secret.database, autoReconnect: true})
}));

app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require("moment");
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/*", function(req, res, next) {
	if(typeof req.cookies['connect.cid'] !== 'undefined') {
		console.log(req.cookies['connect.cid']);
	}
	next();
});

var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	campgroundLocation 	= require("./routes/addLocation"),
	passwordrecovery 	= require('./routes/passwordrecovery'),
	ratingRoutes 		= require('./routes/ratings'),
	blogRoutes 			= require('./routes/blogRoutes'),
	apiRoutes 			= require('./api/index'),
	adminRoutes			= require('./adminApi/index'),
	indexRoutes			= require("./routes/index");

app.use("/", indexRoutes);
app.use("/", passwordrecovery);
app.use(campgroundLocation);
app.use(apiRoutes);
app.use("/admin", adminRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/ratings", ratingRoutes);
app.use(blogRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//===================================================
//SERVER
//===================================================

app.listen(process.env.PORT || secret.portNumber, function(err){
	if(err) {
		console.error(err);
	} else {
		console.log("YelpCamp project has started, on port " + secret.portNumber + "!");
	}
});

//app.listen(process.env.PORT, process.env.IP, function(){
//console.log("The YelpCamp Server has started!");
//});
