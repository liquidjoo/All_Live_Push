var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = mongoose.Schema({

    deviceName:String,
    deviceId:String,
    registrationId:String

});

mongoose.connect("mongodb://52.79.139.38:27017/sosoPush");

module.exports = mongoose.model('device',deviceSchema);
