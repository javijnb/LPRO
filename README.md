# NodeMQTT

## COMANDOS
Iniciar broker en Linu:
> mosquitto -v

Iniciar broker persistente: 
> nodemon broker

Ver si el broker está escuchando:
> sudo lsof -i -P -n | grep LISTEN

Enviar mensajes de prueba al broker:
> mosquitto_pub -d -h localhost -p 1883 -t "LUADA/gateway1/Lobo2/RSSI" -m "11"


## NOTAS

Puertos abiertos:
83.55.97.99:1883 - Comunicación con el broker MQTT Mosquitto
83.55.97.99:9000 - Servidor página principal
