var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Partner = require('../models/partner');

var itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name : {type : String},
    category : {type : String},
    description : {type : String},
    image : {type : String},
    price : {type : Number},
    partner : {type: Schema.Types.ObjectId, ref: 'Partner'}
});

module.exports = mongoose.model('Item', itemSchema);
