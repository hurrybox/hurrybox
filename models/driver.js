var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var driverSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {type: String, required:true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: Number},
    photo: {type: String},
    vahicle: {type : String},
    licensePlate : { type : String}
});

driverSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

driverSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);