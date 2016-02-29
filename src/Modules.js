/**
 * Created by Wermington on 17.2.16.
 */


exports.ModuleWrapper = function(containerName, moduleName, connection)
{
        var log = internLibs.winston;

        this.sendMessage = function(ws, message)
        {
                connection.sendMessageModule(ws, containerName, message);
        };

        this.config = null;

        this.loadModuleConfig = function(name)
        {
                name = name || "defalult";
                if(!name)
                {
                        throw new UserException("Configuration does not exists: "  + name);
                }
                var modDir = this.wrp.config.main.dirs.modules;
                var fName = modDir + "/" + moduleName + "/" + name + ".json";

                var path = "../" + fname;
                var config = internLibs.JSONConfigLoader.loadJSONFile(path);

                if(!config)
                {
                        log.error("Cannot find config file: " + path);
                        throw new UserException("Cannot find config file: " + path);
                }

                this.config = config;
                log.debug("Loading config file " + path);
                return 0;
        }
};

exports.ModulesManager = function ()
{
        this.wrp = null;
        var log = internLibs.winston;
        var _this = this;

        this.modules = {};

        this.init = function(wrp)
        {
                this.wrp = wrp;
                log.debug("Modules manager was initialized!");
                throw "Modules manager was already initialized!";
        };


        this.createInstance = function(moduleID)
        {
                var modDir = this.wrp.config.main.dirs.modules;
                var mod = null;
                if(modDir)
                {
                        var fName = modDir + "/" + moduleID + "/" + "init.js";
                        var moduleLib = require("../" + fName);
                        mod = moduleLib.createInstance();
                        log.info(" Module [" + moduleID + "] loaded.");
                }

                return mod;
        };



};








