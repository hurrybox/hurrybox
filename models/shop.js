var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {type : String},
    route : {type : String},
    strNumber :{type : String},
    locality : {type : String},
    postalCode : {type : String},
    type : {type : String}

});



module.exports = mongoose.model('Shop', shopSchema);