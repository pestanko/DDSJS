/**
 * Created by Wermington on 17.2.16.
 */


var WSServer = require('ws').Server;


exports.ConnectionManager = function()
{
        this.wrp = null;
        this.wss = null;
        var _this = this;
        var log = internLibs.winston;

        this.init = function(config)
        {

                this.wrp = config;
                log.debug("Connection manager was initialized");
        };

        this.listen = function ()
        {
                var port = this.wrp.config.main.port;
                log.info("Listening on port: " + port);

                if(port)
                {
                        this.wss = new WSServer({port: port});
                }else{
                        return;
                }

                this.wss.on('connection', function (ws)
                {
                        ws.on('message', function incoming(message) {
                                _this.parseMessage(message, ws);
                        });

                });
        };

        this.parseMessage = function(message, ws)
        {
                var msg = JSON.parse(message);
                var msgModule = msg.container;
                var data = msg.data;

                if(!msgModule)
                {
                        log.error("[ERROR] Message does not contains module name.");
                        throw new UserException("Message does not contains module name.");
                }

                var module = this.wrp.containers.get(msgModule);

                if(module)
                {
                        console.log("[INFO] Calling module: %s", msgModule);
                        module.receivedMessage(ws, data);
                }
                else
                {
                        console.log("[WARN] Module not found: %s", msgModule);
                }
        };


        this.sendMessage = function(ws, message)
        {
                var data = JSON.stringify(message);
                ws.send(data);
        };

        this.sendMessageModule = function(ws, module, message)
        {
                var msg = {};
                msg.module = module;
                msg.data = message;
                this.sendMessage(ws, message);
        }
};


exports.ControlConnectionManager = function()
{

        this.wrp = null;
        this.wss = null;
        var _this = this;
        var log = internLibs.winston;

        this.init = function (config)
        {
                this.wrp = config;
                log.debug("Control connection manager was initialized.");
        };

        this.listen = function ()
        {
                var port = this.wrp.config.main.controlPort;
                log.info("Listening on port: " + port);

                if (port) {
                        this.wss = new WSServer({port: port});
                } else {
                        return;
                }

                this.wss.on('connection', function (ws)
                {
                        ws.on('message', function incoming(message)
                        {
                                _this.parseMessage(message, ws);
                        });

                });
        };

        this.parseMessage = function (message, ws)
        {
                var msg = JSON.parse(message);
                this.wrp.control.parseMessage(ws, message);
        };


};



