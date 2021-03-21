var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://192.168.1.42");

client.on("connect", function(){
    client.subscribe("Prueba");
    console.log("Conectado al topic Prueba")
})

client.on("message", function(topic, message){
    context = message.toString();
    console.log(context);
})