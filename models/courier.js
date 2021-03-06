var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var User = require('../models/user');
var Driver = require('../models/driver');
var Origin = require('../models/origin');
var Destintion = require('../models/destination');
var Item = require('../models/item');


var courierSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    wayBillNr : {type: Number},
    origin : {type: Schema.Types.ObjectId, ref: 'Origin'},
    destination : {type: Schema.Types.ObjectId, ref: 'Destination'},
    item : {type: Schema.Types.ObjectId, ref: 'Item'},
    price : {type: String},
    weight : {type: String},
    status : {type: String},
    duration : { type: String},
    distance : { type : String},
    time : { type : Date, default: Date.now },
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    driver : {type: Schema.Types.ObjectId, ref: 'Driver'}
});


autoIncrement.initialize(mongoose.connection);
courierSchema.plugin(autoIncrement.plugin, { model: 'Courier', field: 'wayBillNr', startAt: 07640000001, });

module.exports = mongoose.model('Courier', courierSchema);

