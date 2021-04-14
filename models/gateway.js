const mongoose = require("mongoose");
const config = require("../config/database");

// Gateway Schema
const GatewaySchema = mongoose.Schema({

    gatewayID: {
        type: String,
        required: true
    },
    AnimalID: {
        type: String,
        required: true
    },
    RSSI: {
        type: Number,
        required: true
    },
    latitud: {
        type: Number,
        required: true
    },
    longitud: {
        type: Number,
        required: true
    },
    timestamp_sensor: {
        type: String,
        required: true
    },
    timestamp_gateway: {
        type: String,
        required: true
    }
});

const Gateway =  module.exports = mongoose.model("Gateway",GatewaySchema);

module.exports.getAllGateways = function(callback){
    Gateway.find({},callback);
}