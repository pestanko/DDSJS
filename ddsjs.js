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


function OptionsParser()
{
        this.command = {};
        var _this = this;

        this.actInfo = {
                start: "(CONT_NAME) - Starts the container.",
                stop: " (CONT_NAME) - Stops the container.",
                add: "(CONT_NAME) (MOD_NAME) (MOD_CONF) - Creates new container.",
                help: "Shows help",
                list: "(modules|containers) - Lists avaible containers or modules",
                rm: "(CONT_NAME) - Removes container"
        };


        this.getContName = function (argv, action)
        {
                var cont_name = argv[2];

                if (!cont_name) {
                        _this.showHelp(argv);
                        throw  {message: action + "requires container name!"};
                }
                return cont_name;
        };

        this.getModName = function (argv, action)
        {
                var mod_name = argv[3];

                if (!mod_name) {
                        _this.showHelp(argv);
                        throw  {message: action + "requires module name!"};
                }
                return mod_name;
        };

        this.getConfName = function (argv, action)
        {
                var conf = argv[4];

                if (!conf) {
                        _this.showHelp(argv);
                        throw  {message: action + "requires configuration name!"};
                }
                return conf;
        };


        this.actions = {
                start: function actionStart(argv)
                {
                        var cont_name = _this.getContName(argv);
                        _this.command = {
                                action: "start",
                                container: cont_name
                        }
                },
                stop: function actionStop(argv)
                {
                        var cont_name = _this.getContName(argv);
                        _this.command = {
                                action: "start",
                                container: cont_name
                        }
                },
                help: this.showHelp,
                list: function actionList(argv)
                {
                        var select = argv[2];
                        _this.command.action = "list";

                        if (select == "modules") {
                                _this.command.select = "modules";
                        }
                        else if (select == "containers") {
                                _this.command.select = "containers";
                        }
                        else {
                                _this.command.select = "all";
                        }
                },
                add: function actionAdd(argv)
                {
                        var cont_name = _this.getContName(argv);
                        var mod_name = _this.getModName(argv);
                        var conf_name = _this.getConfName(argv);

                        _this.command = {
                                action: "add",
                                container: cont_name,
                                module: mod_name,
                                config: conf_name
                        }
                },
                rm: function actionRemove(argv)
                {
                        var cont_name = _this.getContName(argv);
                        _this.command = {
                                action: "rm",
                                container: cont_name
                        }
                }
        };


        this.parseOptions = function (argv)
        {
                argv = argv || process.argv;
                var action = argv[0];

                if (!action) {
                        action = "help";
                }

                try {
                        var act = this.actions[action];
                        if (act) {
                                act(argv);
                        } else {
                                this.actions.help(argv);
                        }
                } catch (e) {
                        console.error(e);
                        this.showHelp();
                }

        };


        this.showHelp = function (argv)
        {
                console.info("Usage: node ddsjs.js (ACTION) [CONTAINER_NAME] [MODULE_NAME] [CONFIG]");
                console.info("ACTIONS:");
                for (var act in this.actions) {
                        if (this.actions.hasOwnProperty(act)) {
                                console.info("\t * " + act + " " + this.actInfo[act]);
                        }
                }
        }
}


(function ()
{


        var WebSocket = require('ws');
        var log = require('winston');
        var GetOpt = require('node-getopt');


        // Configuration
        var ws = new WebSocket('ws://localhost:10110');

        ws.on('open', function open()
        {
                log.info("Connected to remote host.");
        });

        ws.on('message', function (data, flags)
        {

        });


})();










