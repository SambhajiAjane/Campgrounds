var express =  require("express"),
	User 	= require("../models/user.js"),
	camps 	= require("../models/campgrounds.js"),
	passport= require("passport"),
 	router  = express.Router();

router.get("/register",(req,res)=>{
	res.render("register");
});

router.post("/register",(req,res)=>{
	User.register(new User({username :req.body.username}),req.body.password,function(err,user){
		if(err)
			{console.log(err+"error in sign up");return res.render("register");}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Welcome to the campgrounds "+user.username);
			res.redirect("/camps");
		})
		
	})
});

router.get("/login",(req,res)=>{
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect : "/camps",
	failureRedirect : "/login"
}),(req,res)=>{
	
});


router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out");
	
	res.redirect("/camps");
})

module.exports = router;