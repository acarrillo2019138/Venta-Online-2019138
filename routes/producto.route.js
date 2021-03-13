"use strict"

var express = require("express");
var productoController = require("../controllers/producto.controller");
var api = express.Router();
var md_authenticated = require("../middlewares/authenticated");

api.put("/AgregarProducto/:id",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],productoController.AgregarProducto);
api.get("/ObtenerProducto",md_authenticated.ensureUser,productoController.ObtenerProducto);
api.put("/ActualizarProducto/:idP",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],productoController.ActualizarProducto);
api.put("/EliminarProducto/:idP",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],productoController.EliminarProducto);
api.get("/BuscarProducto",md_authenticated.ensureUser,productoController.BuscarProducto);
api.get("/CantidadProductos",md_authenticated.ensureUser,productoController.CantidadProductos);

module.exports = api;
