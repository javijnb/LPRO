const mongoose = require("mongoose");
const config = require("../config/database");

// Gateway Schema
const GatewaySchema = mongoose.Schema({

    gatewayID: {
        type: String,
        required: false
    },
    AnimalID: {
        type: String,
        required: false
    },
    RSSI: {
        type: Number,
        required: false
    },
    latitud: {
        type: Number,
        required: false
    },
    longitud: {
        type: Number,
        required: false
    },
    timestamp_sensor: {
        type: String,
        required: false
    },
    timestamp_gateway: {
        type: String,
        required: false
    },
    longitudGanado:{
        type: Number,
        required: false
    },
    latitudGanado:{
        type: Number,
        required: false
    }
    
});



const Gateway =  module.exports = mongoose.model("Gateway",GatewaySchema);


module.exports.getAllGateways = function(callback){
    Gateway.find({},callback);
}

module.exports.getLongitudGanado = function(callback){
    Gateway.findOne({AnimalID: "GANDO001"}, null, {sort:{timestamp_server: -1}}, callback);
}
