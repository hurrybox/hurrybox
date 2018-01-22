var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');
var Driver = require('../models/driver');
var Origin = require('../models/origin');

var userDriversSchema = new Schema({
    
    driver : {type: ObjectId, ref: 'Driver'},
    user : {type: ObjectId, ref: 'User'},
});


module.exports = mongoose.model('UserDrivers', userDriversSchema);