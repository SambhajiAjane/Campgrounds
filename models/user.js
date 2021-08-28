var mongoose  = require("mongoose");
var passwordLocalmon = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username:String,
	password:String
});
userSchema.plugin(passwordLocalmon);
module.exports = mongoose.model("User",userSchema);