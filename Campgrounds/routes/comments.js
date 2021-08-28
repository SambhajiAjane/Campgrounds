var express    =  require("express"),
    router     = express.Router({mergeParams : true}),
	campground = require("../models/campgrounds"),
	comments   = require("../models/comments"),
	middlewareObj = require("../middle/index");
	
router.get("/new",middlewareObj.isLoggedin,(req,res)=>{
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log("cann't found this ground");
		}else{
			console.log("found this one");
			res.render("comments/new",{campground:campground});
		}
	})
	
});

router.post("/",(req,res)=>{	
	campground.findById(req.params.id,(err,grounds)=>{
		if(err){console.log("err in finding campground "+err)}
		else
			{
				
				comments.create({text:req.body.text},(err,comment)=>{
					if(err){console.log("err in making comment "+ err)}
					else
					{
						comment.author.id = req.user._id;
						comment.author.userName  = req.user.username;
						comment.save();
					grounds.comments.push(comment);
					console.log("comment = "+comment);
					grounds.save();
					console.log(grounds);
					req.flash("success","successfully added comment");
					res.redirect("/camps/"+grounds._id);
					}
				})
			 
			}
	})
});

router.get("/:comment_id/edit",middlewareObj.isCommentAuthorised,(req,res)=>{
	comments.findById(req.params.comment_id,(err,comment)=>{
		if(err){console.log("error in finding comment");}
		else
			{
				console.log("comment id ="+req.params.comment_id);
				console.log("campground id ="+req.params.id);
				res.render("comments/edit",{campground_id:req.params.id,comments:comment});
			}
	})
})

router.put("/:comment_id",(req,res)=>{
	
	var updatedComment = {text:req.body.text};
	console.log(updatedComment);
	comments.findByIdAndUpdate(req.params.comment_id,updatedComment,function(err,commented){
		if(err){console.log(err+"error in comment upadation");}
		else{
			req.flash("success","successfully edited comment");
			res.redirect("/camps/"+req.params.id);
		}
	})
})

router.delete("/:comment_id",middlewareObj.isCommentAuthorised,(req,res)=>{
	comments.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){console.log(err+"error in deletion of comment");}
		else
			{
				req.flash("success","comment deleted successfully");
				res.redirect("/camps/"+req.params.id);
			}
	})
})

module.exports = router;