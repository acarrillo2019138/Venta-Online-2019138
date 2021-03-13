"use strict"

var express = require("express");
var categoriaController = require("../controllers/categoria.controller");
var api = express.Router();
var md_authenticated = require("../middlewares/authenticated");

api.post("/AgregarCategoria",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],categoriaController.AgregarCategoria);
api.get("/ObtenerCategoria",md_authenticated.ensureUser,categoriaController.ObtenerCategoria);
api.put("/ActualizarCategoria/:id",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],categoriaController.ActualizarCategoria);
api.delete("/EliminarCategoria/:id",[md_authenticated.ensureUser,md_authenticated.ensureAdmin],categoriaController.EliminarCategoria);
api.get("/BuacarCategoria",md_authenticated.ensureUser,categoriaController.BuacarCategoria);

module.exports = api;

