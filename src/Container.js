/**
 * Created by Wermington on 29.2.16.
 */


exports.ModuleContainer = function (name, module, args)
{
        var _this = this;
        this.module = module;
        this.name = name;
        this.id = name;
        this.args = args;

        exports.ModuleContainer.states = {
                RUNNING: 1,
                STOPPED: 0,
                STALLED: 2,
                INIT: 100,
                CREATED: 101
        };

        var log = internLibs.winston;
        var states = exports.ModuleContainer.states;


        this.currentState = exports.ModuleContainer.states.CREATED;

        this.start = function (args)
        {
                switch (this.currentState) {
                        case states.STALLED:
                        case states.RUNNING:
                                log.warn("Container already running!");
                                return;

                        case states.CREATED:
                                log.error("Container was created but not initialized!");
                                return;

                }

                this.currentState = states.RUNNING;
                this.module.start(args);
        };

        this.stop = function ()
        {
                switch (this.currentState) {
                        case states.STOPPED:
                                log.warn("Container already stopped!");
                                return;
                }

                this.currentState = states.STOPPED;
                this.module.stop();
        };

        this.init = function (name, module)
        {
                if (this.currentState != states.CREATED) {
                        log.error("Container was already initialized !");
                        return;
                }
                this.name = name;
                this.module = module;
                this.currentState = states.INIT;
        }

};

exports.ContainerManager = function ()
{
        var _this = this;
        var log = internLibs.winston;
        this.containers = {};
        this.wrp = null;
        this.config = null;

        this.init = function (wrp)
        {
                this.wrp = wrp;
        };

        this.add = function (name, moduleName, config)
        {
                var module = this.get(name);

                if (!this.get(name)) {
                        module = this.wrp.modules.createInstance(moduleName);
                        if(!module)
                        {
                                log.error("Module not found!");
                        }
                        this.containers[name] = module;
                }


                var Wrap = require("./Modules.js").ModuleWrapper;
                var w = new Wrap(name);
                module.init();
                return 0;
        };


        this.get = function (name)
        {
                var cont = this.containers[name];

                if (cont) {
                        return cont;
                } else {
                        log.error("Container with name: [" + name + "] cannot be found!");
                        return null;
                }
        };

        this.start = function (name, args)
        {
                var cont = this.get(name);
                if (!cont) return;

                cont.start(args);
        };

        this.stop = function (name)
        {
                var cont = this.get(name);
                if (!cont) return;

                cont.stop();
        };

        this.delete = function (name)
        {
                var cont = this.get(name);
                if(cont)
                {
                        cont.stop();
                        delete this.modules[name];
                }
        }
};

