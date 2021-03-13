"use strict"

var express = require("express");
var bodyParser = require("body-parser");
var userRoutes = require("./routes/user.route");
var categoryRoutes = require("./routes/categoria.route");
var productRoutes = require("./routes/producto.route");
var cartRoutes = require("./routes/carrito.route");
var billRoutes = require("./routes/factura.route");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",cartRoutes);
app.use("/api",billRoutes);

module.exports = app;