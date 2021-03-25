# NodeMQTT

## COMANDOS
Iniciar broker persistente: 
> nodemon broker

Ver si el broker está escuchando:
> sudo lsof -i -P -n | grep LISTEN

Enviar mensajes de prueba al broker:
> mosquitto_pub -d -h localhost -p 1883 -t "LUADA/gateway1/Lobo2/RSSI" -m "11"
> mosquitto_pub -d -P "gafas1442" -u "Javi" -t "LUADA/gateway1/Lobo2/RSSI" -m "22"


## NOTAS
Eliminar *publisher.js* y *subscriber.js*, no se usan