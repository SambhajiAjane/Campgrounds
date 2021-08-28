var mongoose = require("mongoose");
var comments = require('./comments');
var campgroundscheme = new mongoose.Schema({
	name:String,
	img:String,
	discription:String,
	author:{
		userName:String,
		id:{
			type:mongoose.Schema.Types.ObjectId,
		 ref:"user"
		}
	},
	comments:[
		{type:mongoose.Schema.Types.ObjectId,
		 ref:"comments"}
	]
	
});

module.exports =  mongoose.model("campground",campgroundscheme);