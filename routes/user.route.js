"use strict"

var express = require("express");
var userController = require("../controllers/user.controller");
var api = express.Router();
var md_authenticated = require("../middlewares/authenticated");

api.post("/login",userController.login);
api.post("/cliente",userController.cliente);
api.put("/ActualizarUser/:id",md_authenticated.ensureUser,userController.ActualizarUser);
api.delete("/EliminarUser/:id",md_authenticated.ensureUser,userController.EliminarUser);

module.exports = api;


