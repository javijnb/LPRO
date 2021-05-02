const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/user");
const Gateway = require("../models/gateway");
const Lobo = require("../models/lobo");



// DAR DE ALTA UN USUARIO PARA ACCEDER A LA PLATAFORMA:  /users/register
router.post("/register", (req, res, next)=> {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:"Failed to register user"});
        }else{
            res.json({success: true, msg: "User registered"});
        }
    });
});

// LOGIN:   /users/authenticate
router.post("/authenticate", (req, res, next)=> {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "User not found"});
        }

        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;

            if(isMatch){
                const token = jwt.sign({data:user}, config.secret, {
                   expiresIn: 604800 //1 week 
                });

                res.json({
                    success: true,
                    token: "JWT "+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: "Wrong password"});
            }
        });
    });
});


router.post("/listarGateways",(req,res,next)=>{

    Gateway.getAllGateways((err,gateway)=>{

        if(err){
            res.json({
                success: false,
                msg:"Error al obtener la info de los gateways",
            });
        }else{
            res.json({
                success: "Exito recuperando todos los gateways",
                msg: gateway,
            });
        }
    })
});

router.post("/longitudGanado",(req, res, next)=>{
    Gateway.getLongitudGanado((err,item_vaca)=>{

        //console.log("item: ", item_vaca);

        if(err){
            res.json({
                success: false,
                msg:"Error al obtener la coordenada longitud del ganado",
            });
        }else{
            res.json({
                success: true,
                msg: item_vaca.longitudGanado,
            });
        }
    })
});

router.post("/latitudGanado",(req, res, next)=>{
    Gateway.getLongitudGanado((err,item_vaca)=>{

        if(err){
            res.json({
                success: false,
                msg:"Error al obtener la coordenada latitud del ganado",
            });
        }else{
            res.json({
                success: true,
                msg: item_vaca.latitudGanado,
            });
        }
    })
});

router.post("/coordenadasLobo",(req, res, next)=>{
    Lobo.getCoordenadasLobo((err,item_lobo)=>{

        if(err){
            res.json({
                success: false,
                msg: "Error al obtener las coordenadas de todos los lobos",
            });
        }else{
            res.json({
                success: true,
                info: "Éxito llamando a /users/coordenadasLobo",
                msg: item_lobo,
            });
        }

    })
});




module.exports = router;
