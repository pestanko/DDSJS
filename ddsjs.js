/**
 * Created by Peter Stanko on 18.2.16.
 * USAGE:
 *      ddsjs.js (start|stop|add|rm|list|info) containerName
 *
 * OPTIONS:
 *      - add containerName moduleName configFile
 *      - start containerName
 *      - stop containerName
 *      - list
 *      - info constainerName
 *      - rm containerName
 */




var WebSocket = require('ws');
var log = require('winston');


// Configuration
var ws = new WebSocket('ws://localhost:10110');

ws.on('open', function open() {
        log.info("Connected to remote host.");
});

ws.on('message', function(data, flags) {

});




