var campground = require("../models/campgrounds");
var comments = require("../models/comments");
var middelwareObj = {};

middelwareObj.isLoggedin = function(req,res,next){
	if(req.isAuthenticated()) 
		{
			return next();
		}
	
		else 
		{
			req.flash("error","You need to login to do that");
			res.redirect("/login");
		}
}

middelwareObj.isCampAuthorised = function(req,res,next){
	if(req.isAuthenticated())
	{
		campground.findById(req.params.id,(err,foundcamp)=>{
			if(err){console.log("error in authorization");}
			else
			{
			 if(foundcamp.author.id.equals(req.user._id))
				 {
					 return next();
				 }
				else
				{ 
					req.flash("error","You are not allowed to do that");
					res.redirect("/camps/"+req.params.id);
					console.log("you are not authorized");
				}
			}
		})
	}
	else
		{
			req.flash("error","You need to login to do that");
			res.redirect("/login")
		}
	
}


middelwareObj.isCommentAuthorised = function(req,res,next){
	if(req.isAuthenticated())
		{
			comments.findById(req.params.comment_id,(err,comment)=>{
				if(err){console.log(err+"error in finding comment");}
				else
					{
						if(comment.author.id.equals(req.user._id))
							{
								return next();
							}
						else
						{
							req.flash("error","You are not allowed to do that");
							res.redirect("/camps/"+req.params.id);
							console.log("you are not authorised to do that");
						}
					}
			})
		}
	else {req.flash("error","You need to login to do that");res.redirect("/login");}
};


module.exports = middelwareObj;