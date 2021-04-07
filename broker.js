//TIMESTAMPS
let date_ob = new Date();

// IMPORTS:
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");




// MONGO:
const mongoose = require("mongoose");
const config = require("./config/database");

mongoose.connect(config.database);

mongoose.connection.on("connected", ()=>{
    console.log("Connected to database "+config.database);
});

mongoose.connection.on("error", (error)=>{
    console.log("Database error "+error);
});


// MONGODB
var url = "mongodb://localhost:27017/";
var urlCol = "mongodb://127.0.0.1/LUADA";
var MongoClient = require("mongodb").MongoClient;




// EXPRESS
const app = express();
const users = require("./routes/users");
const port = 9000;

app.use(cors()); //CORS Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/users", users); //Redirigir las rutas que sean /investigadores/XXXXX

app.listen(port,()=>{
    console.log("Servidor Node.js con broker MQTT en puerto "+port);
});





app.get("/Gateways", function(req, res){

    MongoClient.connect(urlCol, function(err, db){
        if(err){
            throw err;
        }
        db.collection("Gateways").find().toArray(function(err, result){
            if(err){
                throw err;
            }
            //console.log(result);
            res.send(result);
        });
    });
    
});






// MQTT
var mqtt = require('mqtt');
const { use } = require('passport');
var Topic = 'LUADA/#'; //subscribe to all topics
var Broker_URL = 'mqtt://192.168.1.45';

var options = {
	clientId: 'MiBrokerMosquitto',
	port: 1883,
	keepalive : 60
};

var client = mqtt.connect(Broker_URL, options);

client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect(){
    console.log("Conexión MQTT establecida");
    console.log("Broker iniciado: "+date_ob);
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted){
    console.log("Suscrito a " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err){
    console.log("Reconectando...");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err){
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish(){
	//Nada
}

function mqtt_messsageReceived(topic, message, packet){
    var datetime = new Date();

    console.log("--------------------------------------------------------------------------------------");
    console.log('Topic: ' +  topic);
    console.log('Mensaje recibido: ' + message);

    const day = ("0" + datetime.getDate()).slice(-2);
    const month = ("0" + (datetime.getMonth() + 1)).slice(-2);
    const year = datetime.getFullYear();
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();
    const timestamp_server = "" +day+ "/" +month+ "/" +year+ " " +hours+ ":" +minutes+ ":" +seconds;
    console.log("Timestamp: "+timestamp_server);

    var messString = message.toString();
    var topicSplit = String(topic).split("/");
    var gatewayID  = String(topicSplit[1]);
    var animalID   = String(topicSplit[2]);
    var parametro  = String(topicSplit[3]);

    var objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": "42.17007", "longitud": "-8.685945", "timestamp_server": timestamp_server, "timestamp_senal": timestamp_server};
    //console.log(objeto);
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LUADA");
        dbo.collection("Gateways").insertOne(objeto, function(err, res) {
          if (err) throw err;
          console.log("--- A new object has been added to the database ---");
          db.close();
        });
    });

}

function mqtt_close(){
	console.log("Cerrando conexión MQTT");
}