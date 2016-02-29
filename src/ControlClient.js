/**
 * Created by Wermington on 29.2.16.
 */


exports.ControlClient = function()
{
        var _this = this;
        this.wrp = null;

        exports.ControlClient.ErrorCodes = {
                CONNECTION_CLOSED: 101,
                CONTAINER_NOT_FOUND: 200,
                CONTAINER_ALREADY_RUNNING: 201,
                CONTAINER_ALREADY_ADDED: 202,

                MODULE_NOT_FOUND: 300,
                UNDEFINED_ERROR: 10

        };
        var errCodes = exports.ControlClient.ErrorCodes;

        this.init = function(wrp)
        {
                this.wrp = wrp;
        };

        this.error = function(ws, id, message)
        {
                var msg = {
                        type: "out",
                        out: "error",
                        message: message,
                        id: id
                };

                this.wrp.conControl.sendMessage(ws, msg);

        };

        this.error = function (ws, message)
        {
                this.error(ws, 10, message); // Undefined error
        };

        this.message = function(ws, message)
        {
                var msg = {
                        type: "out",
                        out: "message",
                        message: message
                };

                this.wrp.conControl.sendMessage(ws, msg);
        };

        this.receivedMessage = function(ws, message)
        {
                switch (message.type)
                {
                        case "command":
                                this.execute(ws, message.command);
                                break;
                        case "command-text":
                                this.executeParse(ws, message);
                }
        };

        this.execute = function (ws, command)
        {
                switch (command.name)
                {
                        case "add":
                                this.execAddCommand(ws, command);
                                break;
                        case "start":
                                this.execStartCommand(ws, command);
                                break;
                        case "stop":
                                this.execStopCommand(ws, command);
                                break;
                        case "list":
                                this.execListCommand(ws, command);
                                break;
                        case "info":
                                this.execInfoCommand(ws, command);
                                break;
                        case "rm":
                                this.execRMCommand(ws, command);
                                break;
                }
        };

        this.executeParse =function(ws, message)
        {
                // TODO
                var command = {};

                var text = message.text()
        };

        this.execAddCommand = function(ws, command)
        {
                var contName = command.containerName;
                var modName = command.moduleName;
                var config = command.confiFile;

                try {
                        var ret = this.containers.add(contName, modName, config);
                } catch (e)
                {

                }
        };

        this.execStartCommand = function(ws, command)
        {
                // TODO
                var contName = command.containerName;
                var cont = this.wrp.containers.get(contName);
                if(!cont)
                {
                        this.error(ws, errCodes.CONTAINER_NOT_FOUND , "Cannot find container with name: " + contName);
                        return;
                }
                cont.start();
                this.message(ws, "Container [" + contName + "] started." );
        };

        this.execStopCommand = function(ws, command)
        {
                // TODO
        };

        this.execListCommand = function(ws, command)
        {
                // TODO
        };
        this.execInfoCommand = function(ws, command)
        {
                // TODO
        };

        this.execRMCommand = function(ws, command)
        {
                // TODO
        };
};