# NodeMQTT

## MOSQUITTO BROKER

Iniciar broker en Linux:

> mosquitto -v

Iniciar servidor-broker: 

> nodemon

Comprobar si el broker está escuchando:

> sudo lsof -i -P -n | grep LISTEN

Enviar mensajes de prueba al broker (desde otra terminal):

> mosquitto_pub -d -h localhost -p 1883 -t "LUADA/Gateway001/LOBO001/RSSI" -m "-110"

## SI QUEREMOS REGISTRAR USUARIOS

Abrir Postman y ejecutar la siguiente solicitud:

> POST - localhost:9000/users/register - Headers:ContentType:application/json - Body:raw

Y el siguiente objeto JSON:

```yaml
{
    "name": "Javi",
    "email": "javijnb@gmail.com",
    "username": "javijnb",
    "password": "LUADA1405"
}
```

Esta operación no está disponible en frontend, sino que es una operación nativa de backend usada únicamente para dar de alta a usuarios que hayan sido autorizados por los desarrolladores.

## COMPROBAR LA AUTENTICACIÓN DE USUARIOS

Con Postman creamos la siguiente solicitud:

> POST - localhost:9000/users/authentication - Headers:ContentType:application/json - Body:raw

Y el siguiente objeto JSON:

```yaml
{
    "username": "javijnb",
    "password": "LUADA1405"
}
```

Esto es una forma de comprobar el correcto funcionamiento del sistema de login de la aplicación final.

## INICIAR LA APLICACIÓN FRONTEND

> cd angular-src

> ng serve

## NOTAS

Puertos abiertos:

83.55.97.99:1883 - Comunicación con el broker MQTT Mosquitto

83.55.97.99:9000 - Servidor página principal
