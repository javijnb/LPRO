const express = require('express');
var mqtt = require("mqtt");
const app = express();
const port = process.env.PORT || 9000;


app.use(express.static("public"));

app.listen(port,()=>{
    console.log("Servidor con broker MQTT en puerto "+port);

});


var client = mqtt.connect("mqtt://192.168.1.42", {clientId:"brokerID"});
var topic = "Prueba";

client.on('connect', function () {
    client.subscribe(topic, { qos: 2 });
    client.publish(topic, '1000');
});


client.on("messsage", function(topic, message){
    console.log("Mensaje: "+message);
    console.log("Tópico: "+topic);
});

client.on('error', function(){
    console.log("ERROR")
    client.end()
});

client.on('offline', function() {
    console.log("offline");
});

client.on('reconnect', function() {
    console.log("reconnect");
});


