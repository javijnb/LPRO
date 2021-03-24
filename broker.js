// CODIGO EN USO
var mqtt = require('mqtt');
var Topic = 'LUADA/#'; //subscribe to all topics
var Broker_URL = 'mqtt://127.0.0.1';

var options = {
	clientId: 'MyMQTT',
	port: 1883,
	keepalive : 60
};

var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect()
{
    console.log("Conexión MQTT establecida");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted)
{
    console.log("Suscrito a " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err)
{
    console.log("Reconectando...");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err)
{
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish()
{
	//do nothing
}

function mqtt_messsageReceived(topic, message, packet)
{
	console.log('Topic: ' +  topic + '  Mensaje recibido:' + message);
}

function mqtt_close()
{
	console.log("Cerrando conexión MQTT");
}


// CODIGO INUTIL
/*
const express = require('express');
var mqtt = require("mqtt");
const app = express();
const port = process.env.PORT || 9000;


app.use(express.static("public"));

app.listen(port,()=>{
    console.log("Servidor con broker MQTT en puerto "+port);

});


var client = mqtt.connect("mqtt://localhost", {clientId:"brokerID"});
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

*/