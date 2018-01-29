var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var destinationSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    name : {type : String},
    phone :{type : String},
    route : {type : String},
    streetNumber :{type : String},
    locality : {type : String},
    postalCode : {type : String},
    text : { type: String}
});



module.exports = mongoose.model('Destination', destinationSchema);