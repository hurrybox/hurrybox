var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Shop = require('./shop');

var partnerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {type: String, required:true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: Number},
    // shop : {type: ObjectId, ref: 'Shop'}
});

partnerSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

partnerSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Partner', partnerSchema);