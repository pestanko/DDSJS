/**
 * Created by Wermington on 17.2.16.
 */

var libs = {
        fs : require('fs'),
        path: require('path')
};



var System = require("./src/System.js").System;

var sysInst = new System();
sysInst.start();







