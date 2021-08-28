var express         	  = require("express"),
	app             	  = express(),
	mongoose 			  = require("mongoose"),
	bodyParser 			  = require("body-parser"),
	comments 		      = require("./models/comments"),
	campground 			  = require("./models/campgrounds"),
	flash				  = require("connect-flash"),
	method_over 	      = require("method-override"),
	passport 		      = require("passport"),
	LocalStratagy 		  = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User 				  = require("./models/user.js");

var campgroundRoutes = require("./routes/campgrounds"),
	commentsRoutes   = require("./routes/comments"),
	authRoutes		 = require("./routes/auth");

mongoose.connect("mongodb://localhost/grounds",{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true
}).then(()=>{
	console.log("Connected");
}).catch(err=>{
	console.log("Error",err.message);
});

app.use(require("express-session")({
		secret : "second secret",
		resave : false,
		saveUninitialized : false
		}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));



passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(method_over("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");


app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	console.log(req.user);
	next();
});

app.use("/camps",campgroundRoutes);
app.use("/camps/:id/comments",commentsRoutes);
app.use(authRoutes);
app.get("/",(req,res)=>{
	res.render("landing");
});

app.listen(9000,()=>{console.log("server has started")})