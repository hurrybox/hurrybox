var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var originSchema = new Schema({
        // _id: Schema.Types.ObjectId,        
        name : {type : String},
        phone :{type : String},
        route : {type : String},
        streetNumber :{type : Number},
        locality : {type : String},
        postalCode : {type : String},
        text : {type : String}
});




module.exports = mongoose.model('Origin', originSchema);