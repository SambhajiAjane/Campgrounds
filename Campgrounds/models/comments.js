var mongoose = require('mongoose');
var comment = new mongoose.Schema({
	text: String,
	author: {userName : String,
	id: {
	type: mongoose.Schema.Types.ObjectId,
	ref: "user"}
	}
	
});

module.exports = mongoose.model("comments",comment);