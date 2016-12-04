var constants = require('../constants/constants.json');
var json3 = require('../node_modules/json3');

exports.authorization = function (writer, callback) {

    var authinfo = {

        writer:writer

    };
    callback((authinfo));
}