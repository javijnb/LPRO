//TIMESTAMPS
let date_ob = new Date();

// IMPORTS:
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const {spawn} = require('child_process');


// VARIABLES:
var latitudGanado;
var longitudGanado;

/*
Gateway001: 42,170026 -8,688612
Gateway002: 42,170097 -8,688528
Gateway003: 42,169680 -8,688384
Gateway004: 42,169826 -8,688358
*/

const latGW1 = 42.170026;
const lngGW1 = -8.688612;
const latGW2 = 42.170097;
const lngGW2 = -8.688528;
const latGW3 = 42.169680;
const lngGW3 = -8.688384;
const latGW4 = 42.169826;
const lngGW4 = -8.688358;

var ficheromallado = "malla.json";





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

app.use("/users", users); //Redirigir las rutas que sean /users/XXXXX

app.listen(port,()=>{
    console.log("Servidor Node.js conectado a TTN en el puerto "+port);
});



// Mostrar en /Gateways todo el contenido de la colección Gateways
app.get("/Gateways", function(req, res){

    MongoClient.connect(urlCol, function(err, db){
        if(err){
            throw err;
        }
        db.collection("gateways").find().toArray(function(err, result){
            if(err){
                throw err;
            }
            //console.log(result);
            res.send(result);
        });
    });
    
});


// PYTHON
function llamadaScript(RSSI_1, RSSI_2, RSSI_3, RSSI_4, timestamp_script){

    // Cuando llega mensaje /LUADA/gateway2/LOBO001/RSSI : -56dBm

    // RECOGIDA DE DATOS:
    // recibir el RSSI (-56)
    // buscar los RSSI más recientes del gateway1, gateway3 y gateway4
    // ya tenemos los datos

    // MALLA DE PUNTOS:
    // cargamos el fichero de malla de puntos

    // argumentos de entrada: 
    // python3 algoritmo.py RSSI_1 RSSI_2 RSSI_3 RSSI_3 RSSI_4 ficheromallado.json latGW1 longGW1 latGW2 longGW2 latGW3 longGW3 latGW4 longGW4

    console.log("********************************************************");
    console.log("Has llamado al script de python");
    console.log("Parámetros introducidos: RSSI_1: ", RSSI_1, "/ RSSI_2: ", RSSI_2, "/ RSSI_3: ", RSSI_3, "/ RSSI_4: ", RSSI_4);
    console.log("Fichero de mallas: ", ficheromallado);


    var output;
    var coordenada1;
    var coordenada2;

    const python = spawn('python3', ['algoritmo_localizacion_banner_4_parametros.py',RSSI_1, RSSI_2, RSSI_3, RSSI_4, ficheromallado, latGW1, lngGW1, latGW2, lngGW2, latGW3, lngGW3, latGW4, lngGW4]);

    python.stdout.on('data', function (data) {
        output = data.toString();
        console.log("OUTPUT: ", output);
        
        coordenada1 = output.substring(
            output.lastIndexOf("[")+1, output.lastIndexOf(","));

        coordenada2 = output.substring(
            output.lastIndexOf(",")+1, output.lastIndexOf("]"));

        console.log("Coordenada1: ", coordenada1);
        console.log("Coordenada2: ", coordenada2);

        var objlobo;
        objlobo = {"timestamp_algoritmo": timestamp_script, "latitudestimada": parseFloat(coordenada1), "longitudestimada": parseFloat(coordenada2), "RSSI1": parseInt(RSSI_1), "RSSI2": parseInt(RSSI_2), "RSSI3": parseInt(RSSI_3), "RSSI4": parseInt(RSSI_4)};
        console.log("Objeto lobo a guardar: ", objlobo);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("LUADA");
            dbo.collection("lobos").insertOne(objlobo, function(err, res) {
            if (err) throw err;
            console.log("--- Se ha añadido un nuevo lobo a la base de datos Lobos ---");
            db.close();
            });
        });

        console.log("********************************************************");
    });

    
    

    python.on('close', (code) => {
        console.log(`Proceso de python finalizado con código: ${code}`);
    });

    

}



// MQTT
var mqtt = require('mqtt');
const { use } = require('passport');
const { param } = require('./routes/users');
var Topic = 'LUADA/#'; //subscribe to all topics
var Broker_URL = 'mqtt://192.168.1.37';

var options = {
	clientId: 'NodeMQTT',
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

function mqtt_messsageReceived(topic, message, packet, llamadaScript){
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
    const timestamp_server = "" +year+ "/" +month+ "/" +day+ " " +hours+ ":" +minutes+ ":" +seconds;
    console.log("Timestamp: "+timestamp_server);

    var messString = message.toString();
    var topicSplit = String(topic).split("/");
    var gatewayID  = String(topicSplit[1]);
    var animalID   = String(topicSplit[2]);
    var parametro  = String(topicSplit[3]);

    

    /////////////////////////////////////////////////////////
    //                                                     //
    //   AQUI HAY QUE PONER UNOS VALORES DE LONG-LAT       //
    //       FIJOS SEGUN QUÉ GATEWAY NOS LLEGUE            //
    //                                                     //
    /////////////////////////////////////////////////////////

    // GW1: ROTONDA:  lat: 42.17242766052489, lng: -8.676862545159361,
    // GW2: DEPORTES: lat: 42.17284113386385,  lng: -8.683870620349603,
    // GW3: CITEXVI:  lat: 42.16733853541521, lng: -8.682424371415232,
    // GW4: TELECO:   lat: 42.1700644489694,  lng: -8.688578430207395,

    var objeto;
    var RSSI_script;
    var RSSIrecienteA;
    var RSSIrecienteB;
    var RSSIrecienteC;
    var gatewayA;
    var gatewayB;
    var gatewayC;

    // Compruebo si el mensaje es del formato /LUADA/gateway2/LOBO001/RSSI
    if(parametro=="RSSI" && animalID=="LOBO001"){
        RSSI_script = parseInt(messString);

        if(gatewayID=="Gateway001"){
            gatewayA="Gateway002";
            gatewayB="Gateway003";
            gatewayC="Gateway004";
        }else if(gatewayID=="Gateway002"){
            gatewayA="Gateway001";
            gatewayB="Gateway003";
            gatewayC="Gateway004";
        }else if(gatewayID=="Gateway003"){
            gatewayA="Gateway001";
            gatewayB="Gateway002";
            gatewayC="Gateway004";
        }else if(gatewayID=="Gateway004"){
            gatewayA="Gateway001";
            gatewayB="Gateway002";
            gatewayC="Gateway003";
        }

        
        // Buscamos valor más reciente para RSSI_A
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("LUADA");
            dbo.collection("gateways").findOne({gatewayID: gatewayA, AnimalID: "LOBO001"}, null, {sort:{timestamp_server: -1}}, function(err, result){
              if (err) throw err;
              RSSIrecienteA = result.RSSI;
              console.log("RSSI más reciente para GWA: ", RSSIrecienteA);
              db.close();
            });
        });

        // Buscamos valor más reciente para RSSI_B
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("LUADA");
            dbo.collection("gateways").findOne({gatewayID: gatewayB, AnimalID: "LOBO001"}, null, {sort:{timestamp_server: -1}}, function(err, result){
              if (err) throw err;
              RSSIrecienteB = result.RSSI;
              console.log("RSSI más reciente para GWB: ", RSSIrecienteB);
              db.close();
            });
        });

        // Buscamos valor más reciente para RSSI_C
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("LUADA");
            dbo.collection("gateways").findOne({gatewayID: gatewayC, AnimalID: "LOBO001"}, null, {sort:{timestamp_server: -1}}, function(err, result){
              if (err) throw err;
              RSSIrecienteC = result.RSSI;
              console.log("RSSI más reciente para GWC: ", RSSIrecienteC);
              db.close();
            });
        });

        //Nos aseguramos de que se llame correctamente al script
        setTimeout(function(){
            if(gatewayID=="Gateway001"){
                llamadaScript(RSSI_script, RSSIrecienteA, RSSIrecienteB, RSSIrecienteC, timestamp_server);
            }else if(gatewayID=="Gateway002"){
                llamadaScript(RSSIrecienteA, RSSI_script, RSSIrecienteB, RSSIrecienteC, timestamp_server);
            }else if(gatewayID=="Gateway003"){
                llamadaScript(RSSIrecienteA, RSSIrecienteB, RSSI_script, RSSIrecienteC, timestamp_server);
            }else if(gatewayID=="Gateway004"){
                llamadaScript(RSSIrecienteA, RSSIrecienteB, RSSIrecienteC, RSSI_script, timestamp_server);
            }
        }, 50);

        
    }


    // Comprobamos si es un mensaje de ganado transmitiendo sus coordenadas para parsearlas
    if(parametro=="Coordenadas"){
        var msgSplit = String(messString).split(",");
        var latitudGanadoS  = String(msgSplit[0]);
        var longitudGanadoS = String(msgSplit[1]);
        latitudGanado = parseFloat(latitudGanadoS);
        longitudGanado = parseFloat(longitudGanadoS);
        
    }

    // Para cada GW ponemos sus coordenadas, y si era un mensaje de ganado, con sus respectivos campos:
    if(gatewayID=="Gateway001"){

        if(animalID=="GANDO001"){
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW1, "longitud": lngGW1, "timestamp_server": timestamp_server, "latitudGanado": latitudGanado, "longitudGanado": longitudGanado};
        }else{
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW1, "longitud": lngGW1, "timestamp_server": timestamp_server};
        }
        
    }else if(gatewayID=="Gateway002"){
        
        if(animalID=="GANDO001"){
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW2, "longitud": lngGW2, "timestamp_server": timestamp_server, "latitudGanado": latitudGanado, "longitudGanado": longitudGanado};
        }else{
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW2, "longitud": lngGW2, "timestamp_server": timestamp_server};
        }
        
    }else if(gatewayID=="Gateway003"){

        if(animalID=="GANDO001"){
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW3, "longitud": lngGW3, "timestamp_server": timestamp_server, "latitudGanado": latitudGanado, "longitudGanado": longitudGanado};        
        }else{
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW3, "longitud": lngGW3, "timestamp_server": timestamp_server};        
        }
        
    }else if(gatewayID=="Gateway004"){

        if(animalID=="GANDO001"){
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW4, "longitud": lngGW4, "timestamp_server": timestamp_server, "latitudGanado": latitudGanado, "longitudGanado": longitudGanado};                
        }else{
            objeto = {"gatewayID": gatewayID, "AnimalID": animalID, [parametro] : messString, "latitud": latGW4, "longitud": lngGW4, "timestamp_server": timestamp_server};                
        }
        
    }

    
    //console.log(objeto);
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LUADA");
        dbo.collection("gateways").insertOne(objeto, function(err, res) {
          if (err) throw err;
          console.log("--- A new object has been added to the database ---");
          db.close();
        });
    });

}

function mqtt_close(){
	console.log("Cerrando conexión MQTT");
}
