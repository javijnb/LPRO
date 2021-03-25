//TIMESTAMPS
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();





//EXPRESS
var express = require('express');
const app = express();
const port = process.env.PORT || 9000;
app.use(express.static("public"));
app.listen(port,()=>{
    console.log("Servidor Node.js con broker MQTT en puerto "+port);
});





// MQTT
var mqtt = require('mqtt');
var Topic = 'LUADA/#'; //subscribe to all topics
var Broker_URL = 'mqtt://127.0.0.1';

var options = {
	clientId: 'MiBrokerMosquitto',
	port: 1883,
	keepalive : 60
};

var client = mqtt.connect(Broker_URL, {
    username: "Javi",
    password: "gafas1442" 
  });

//var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect()
{
    console.log("Conexión MQTT establecida");
    console.log("Broker iniciado: "+date+ "-" +month+ "-" +year+ " " +hours+ ":" +minutes+ ":" +seconds);
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
	//Nada
}

function mqtt_messsageReceived(topic, message, packet)
{
    var datetime = new Date();
    console.log("--------------------------------------------------------------------------------------");
    console.log('Topic: ' +  topic);
    console.log('Mensaje recibido: ' + message);
    console.log("Timestamp: "+datetime)
	//console.log('Timestamp: ' +date+"-"+month+"-"+year+"  "+hours+":"+minutes+":"+seconds)
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