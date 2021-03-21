var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://192.168.1.42",{clientId:"publisherID"});

client.on('connect', function () {
    client.subscribe('Prueba', function (err) {
      if (!err) {
        client.publish('Prueba', 'Hello');
        console.log("Mensaje enviado")
      }
    })
  })


  /*
client.on("connect", function(){


    setInterval(function(){
        client.publish("topicoPrueba", "Hola esto es un mensaje de prueba");
        console.log("Mensaje de tópico enviado");
    }, 5000);
    
    if (client.connected==true){
        client.publish("Prueba", "Mensaje de perra prueba");
        console.log("Mensaje enviado al broker");
    }

});

var message="Mensaje de prueba publisher";
var topic="Prueba";
//publish every 5 secs
var timer_id=setInterval(function(){publish(topic,message);},5000);
//publish function
function publish(topic,msg){
    console.log(msg);
    if (client.connected == true){
        client.publish(topic,msg);
    }
};
*/