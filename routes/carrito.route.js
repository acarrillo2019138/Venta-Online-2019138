"use strict"

var express = require("express");
var carritoController = require("../controllers/carrito.controller");
var api = express.Router();
var md_authenticated = require("../middlewares/authenticated");

api.put("/AgregarCarrito/:id",md_authenticated.ensureUser,carritoController.AgregarCarrito);

module.exports = api;