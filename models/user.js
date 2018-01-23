var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {type: String, required:true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: Number},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);  
  };
  

module.exports = mongoose.model('User', userSchema);

