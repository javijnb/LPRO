const mongoose = require("mongoose");
const config = require("../config/database");

// Lobo Schema
const LoboSchema = mongoose.Schema({
    timestamp_algoritmo: {
        type: String,
        required: false
    },
    latitudestimada: {
        type: Number,
        required: false
    },
    longitudestimada: {
        type: Number,
        required: false
    },
    RSSI1: {
        type: Number,
        required: false
    },
    RSSI2: {
        type: Number,
        required: false
    },
    RSSI3: {
        type: Number,
        required: false
    },
    RSSI4: {
        type: Number,
        required: false
    }
});

const Lobo = module.exports = mongoose.model("Lobo", LoboSchema);

module.exports.getCoordenadasLobo = function(callback){
    Lobo.find({},{latitudestimada: 1, longitudestimada: 1, timestamp_algoritmo: 1},callback);
}