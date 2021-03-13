"use strict"

var express = require("express");
var FactController = require("../controllers/factura.controller");
var api = express.Router();
var md_authenticated = require("../middlewares/authenticated");

api.put("/AgregarFact",md_authenticated.ensureUser,FactController.AgregarFact);
api.get("/ObtenerFacts",md_authenticated.ensureUser,FactController.ObtenerFacts);
api.get("/ObtenerProductosFact/:id",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],FactController.ObtenerProductosFact);
api.get("/ObtenerMasProductos",md_authenticated.ensureUser,FactController.ObtenerMasProductos);

module.exports = api;
