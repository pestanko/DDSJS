/**
 * Created by Wermington on 17.2.16.
 */

exports.createInstance = function()
{
        var mod = new exports.ExampleModule();
        return mod;
};

exports.ExampleModule = function()
{
        this.wrp = null;
        this.id = "example"; // REQUIRED

        this.name = "Example module"; // OPTIONAL
        this.description = "Example desc!"; // OPTIONAL
        var log = internLibs.winston;


        this.init = function(wrp)
        {
                log.debug("[MODULE] - Example: Module init.");
                if(wrp)
                {
                        this.wrp = wrp;
                }

        };

        this.start = function(args)
        {
                log.debug("[MODULE] - Example: Module stated with args." + internLibs.printObject(args));
        };

        this.stop = function()
        {
                log.debug("[MODULE] - Example: Module stopped.");

        };

        this.receivedMessage = function(ws, message)
        {
                console.log("Received message called !");
                switch (message.type)
                {
                        case 'ping':
                                this.wrp.sendMessage(ws, message);
                                break;
                }
        }
};

