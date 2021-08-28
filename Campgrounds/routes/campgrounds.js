var express 	=  require("express"),
	 router 	= express.Router({mergeParams : true}),
	 method_over= require("method-override"),
	 campground = require("../models/campgrounds"),
	 comments   = require("../models/comments"),
	 middlewareObj = require("../middle/index");

router.get("/",(req,res)=>{
	campground.find({},(err,camps)=>{
		if(err){
			console.log("SOMETHING WENT WRONG");
		}
		else{
			res.render("campground/camps",{camps:camps});
			console.log("successful delivery");
		}
	})
});

router.post("/",middlewareObj.isLoggedin,(req,res)=>{
	var name=req.body.name;
	var image=req.body.image;
	var discription=req.body.discription;
	var author = {userName:req.user.username,id:req.user._id};
	var newone={name:name,img:image,discription:discription,author:author};
	console.log(newone);
	campground.create(newone,(err,campground)=>{
		if(err){
		console.log("SOMETHING WENT WRONG");
	}else{req.flash("success","Inserted successfully")}	
	res.redirect("/camps");});
	
	
});

router.get("/new",middlewareObj.isLoggedin,(req,res)=>{
	res.render("campground/new");
});
router.get("/:id",(req,res)=>{
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log("cann't found this ground "+err);
		}else{
			console.log("found this one");
			
			res.render("campground/show",{id:foundcamp});
		}
	})
	
});

router.get("/:id/edit",middlewareObj.isCampAuthorised,(req,res)=>{
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log("cann't found this ground " + err);
		}else{
			console.log("found this one");
			res.render("campground/edit",{id:foundcamp});
		}
	})
	
});


router.put("/:id",(req,res)=>{
	
	var name=req.body.name;
	var image=req.body.image;
	var discription=req.body.discription;
	var newone={name:name,img:image,discription:discription};
	campground.findByIdAndUpdate(req.params.id,newone,function(err,updated){
	if(err) console.log("there is an error in update");
	else{req.flash("success","updated correctly"); 
		 res.redirect("/camps/"+updated._id)}	 })
});


router.delete("/:id",middlewareObj.isCampAuthorised,(req,res)=>{
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){console.log("error in deleting");}
		else{req.flash("success","successfully deleted campground");res.redirect("/camps")}
	})
});


module.exports = router;