/**
 * Created by Wermington on 17.2.16.
 */


var ConnectionManager = require("./ConnectionManager.js").ConnectionManager;
var ModulesManager = require("./Modules.js").ModulesManager;
var ContainerManager = require("./Container.js").ContainerManager;
var ControlManager = require("./ConnectionManager.js").ControlConnectionManager;
var ControlClient = require("./ControlClient.js").ControlClient;

GLOBAL.UserException = function(message)
{
        this.msg = message;

        this.message = function()
        {
                return this.msg();
        }
};

// GLOBAL VARIABLE
GLOBAL.internLibs = {
        fs: require('fs'),
        path: require('path'),
        winston: require('winston'),
        printObject: function (obj)
        {
                return JSON.stringify(obj);
        },
        JSONConfigLoader: {
                loadSystemJSON: function (name)
                {
                        var sysdir = "config/";
                        var json = this.loadJSONFile(sysdir + name + ".json");
                        return json;
                },
                loadJSONFile: function (file)
                {
                        var data = JSON.parse(internLibs.fs.readFileSync(file));
                        internLibs.winston.debug("Loaded JSON file: " + internLibs.printObject(data));
                        return data;
                }
        }


};


exports.System = function ()
{
        internLibs.winston.level = 'debug';
        var log = internLibs.winston;
        const CONFIG_PATH = "./config/";
        this.wrp = {
                connection: new ConnectionManager(),
                modules: new ModulesManager(),
                containers : new ContainerManager(),
                conControl : new ControlManager(),
                control : new ControlClient(),
                system : this,
                config: {
                        main: null
                }
        };


        this.loadConfig = function ()
        {
                var data = internLibs.JSONConfigLoader.loadSystemJSON("main");
                log.debug("Loaded config: " + internLibs.printObject(data));
                this.wrp.config.main = data;
        };

        this.start = function ()
        {

                this.loadConfig();

                this.wrp.connection.init(this.wrp);
                this.wrp.modules.init(this.wrp);
                this.wrp.containers.init(this.wrp);
                this.wrp.conControl.init(this.wrp);
                this.wrp.control.init(this.wrp);

                this.wrp.connection.listen();
                log.info("Server started");

        }

};