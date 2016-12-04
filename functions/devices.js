var mongoose = require('mongoose');
var request = require('request');
var device = require('../models/device');
var constants = require('../constants/constants.json');

exports.listDevices = function (callback) {

    device.find({},{

        _id:false,
        __v:false
    },function (err, devices) {

        if (!err){
            callback(devices)
        }

    });
}

exports.listDevicesId = function (callback) {

    device.find({},{
        _id:false,
        __v:false,
        deviceName:false,
        deviceId:false
    },function (err,devices) {

        if (!err){
            callback(devices)
        }
    })

}