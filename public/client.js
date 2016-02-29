/**
 * Created by Wermington on 18.2.16.
 */


function ConnectionManager(config)
{
        this.config = config;
        this.ws = null;
        var _this = this;

        this.callbacks = {
                receivedMessage : function(msg) {}
        };

        this.connect = function(rHost)
        {
                var host = rHost || this.config.host;

                this.ws = new WebSocket(host);

                this.ws.onopen = function()
                {
                        console.log("Connection established with [%s]", host);
                };

                this.ws.onmessage = function(e)
                {
                        var msg = JSON.parse(e.data);

                        if(!msg)
                        {
                                console.log("message is null");
                                return;
                        }

                        if(msg.module == _this.config.containerName)
                        {
                                _this.callbacks.receivedMessage(msg);

                        }else{
                                console.log("Fatal error: ", msg.module);
                        }

                };

                this.ws.onclose = function()
                {
                        console.log("Disconnected!");
                }


        };

        this.sendMessage = function(message)
        {
                var msg = {
                        data: message,
                        container: _this.config.containerName
                };

                var sentData = JSON.stringify(msg);

                var count = 0;

                // Make the function wait until the connection is made...
                function waitForSocketConnection(socket, callback){
                        setTimeout(
                                function () {
                                        count++;
                                        if(count >= 50)
                                        {
                                                console.log("Timeout!");
                                                return;
                                        }
                                        if (socket.readyState === 1) {
                                                console.log("Connection was made");
                                                if(callback != null){
                                                        callback();
                                                        return;
                                                }
                                                return;
                                        } else {
                                                waitForSocketConnection(socket, callback);
                                        }

                                }, 50); // wait 50 millisecond for the connection...
                }


                waitForSocketConnection(this.ws, function(){

                        _this.ws.send(sentData);
                });

        }
}



function DDSJSRemoteConnection(config)
{
        var connection = new ConnectionManager(config);
        this.config = config;


        this.connect = function(rHost)
        {
                rHost = rHost || this.config.host;
                connection.connect(rHost);
        };

        this.onMessage = function(callback)
        {
                if(callback)
                {
                        connection.callbacks.receivedMessage = callback;
                }
        };

        this.sendMessage = function(message)
        {
             connection.sendMessage(message);
        }


}



