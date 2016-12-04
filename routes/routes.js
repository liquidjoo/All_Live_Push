var constants = require('../constants/constants.json');
var registerFunction = require('../functions/register');
var devicesFunction = require('../functions/devices');
var deleteFunction = require('../functions/delete');
var sendFunction = require('../functions/sendmessage');
var alarmFunction = require('../functions/uploadalarm');
var authFunction = require('../functions/authorization');

var json3 = require('../node_modules/json3');

module.exports = function(app,io) {

    io.on('connection', function(socket){

        console.log("Client Connected");
        socket.emit('update', { message: 'Hello Client',update:false });

        socket.on('update', function(msg){

            console.log(msg);
        });
    });

    app.get('/',function(req,res) {

        res.sendFile('index.html');

    });

    app.post('/devices',function(req,res) {

        var deviceName = req.body.deviceName;
        var deviceId   = req.body.deviceId;
        var registrationId = req.body.registrationId;

        if ( typeof deviceName  == 'undefined' || typeof deviceId == 'undefined' || typeof registrationId  == 'undefined' ) {

            console.log(constants.error.msg_invalid_param.message);

            res.json(constants.error.msg_invalid_param);

        } else if ( !deviceName.trim() || !deviceId.trim() || !registrationId.trim() ) {

            console.log(constants.error.msg_empty_param.message);

            res.json(constants.error.msg_empty_param);

        } else {

            registerFunction.register( deviceName, deviceId, registrationId, function(result) {

                res.json(result);

                if (result.result != 'error'){

                    io.emit('update', { message: 'New Device Added',update:true});

                }
            });
        }
    });

    app.post('/alarm',function (req,res) {
        var writer = req.body.writer;

        if (typeof writer =='undefined'){

            console.log(constants.error.msg_invalid_param.message);

            res.json(constants.error.msg_invalid_param);

        } else if (!writer.trim()) {

            console.log(constants.error.msg_empty_param.message);

            res.json(constants.error.msg_empty_param);

        } else {

            authFunction.authorization(writer, function (result) {
                res.json(result);

                devicesFunction.listDevicesId(function (result) {

                    result.forEach(function (jsonObjectData) {

                        sendData(json3.stringify(jsonObjectData),writer);
                    });
                    
                });

            });
        }

    });

    app.get('/devices',function(req,res) {



        devicesFunction.listDevices(function(result) {

            res.json(result);

        });
    });

    app.delete('/devices/:device',function(req,res) {

        var registrationId = req.params.device;

        deleteFunction.removeDevice(registrationId,function(result) {

            res.json(result);

        });

    });

    app.post('/send',function(req,res){

        var message = req.body.message;
        var registrationId = req.body.registrationId;

        sendFunction.sendMessage(message,registrationId,function(result){

            res.json(result);
        });
    });

    app.get('/test',function (req,res) {
        
        authFunction.authorization('aaa','bbb',function (result) {
            res.json(result);
            
        });


    })

    app.get('/alarm',function (req,res) {

        devicesFunction.listDevicesId(function (result) {

            result.forEach(function (jsonObjectData) {

                console.log("dd");
                testData(json3.stringify(jsonObjectData));
            })
            });


        });



    function sendData(data,writer) {
        console.log(data);
        console.log("11");
        console.log(writer);
        var jsonData = json3.parse(data,function (key,value) {

            if (key.toString()=="registrationId"){
                console.log("hi value");
                console.log(value);
                alarmFunction.upload_alarm(writer,value,function (result) {
                    console.log(result);
                })
                console.log("hi value");

            }
        })
    }
}
