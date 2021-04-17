# NodeMQTT

## COMANDOS

Iniciar broker en Linux:

> mosquitto -v

Iniciar broker persistente: 

> nodemon broker

Ver si el broker está escuchando:

> sudo lsof -i -P -n | grep LISTEN

Enviar mensajes de prueba al broker:

> mosquitto_pub -d -h localhost -p 1883 -t "LUADA/gateway1/Lobo2/RSSI" -m "-110"

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

## INICIAR LA APLICACIÓN FRONTEND

> cd angular-src

> ng serve

## NOTAS

Puertos abiertos:
83.55.97.99:1883 - Comunicación con el broker MQTT Mosquitto
83.55.97.99:9000 - Servidor página principal
83.55.97.99:4200 - Frontend
