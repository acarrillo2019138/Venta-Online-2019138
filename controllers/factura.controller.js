"use strict"

var Fact = require("../models/factura.model");
var User = require("../models/user.model");
var Carrito = require("../models/carrito.model");
var Producto = require("../models/producto.model");

function AgregarFact(req,res){
    var userId = req.user.sub;

    Carrito.findOne({owner: userId},(err,carritoFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar su carrito"});
        }else if(carritoFind){
            if(carritoFind.products != ""){
                let cantidad = carritoFind.stock;
                let producto = carritoFind.products;
                let i = 0;
                let j = 0;
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            if(stockP<cantidad[i]){
                                i++;
                                return res.send({message: "Cantidad de carrito (stock) ahora no es válida"});
                            }else{
                                i++;
                            }
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            let stockT = stockP - cantidad[j];
                            j++;
                            Producto.findByIdAndUpdate(element,{stock:stockT},{new:true},(err,stockUpdated)=>{
                                if(err){
                                    res.status(500).send({message: "Error al actualizar stock"});
                                }else if(stockUpdated){
                                    console.log("El stock del producto se actualizó exitosamente");
                                }else{
                                    res.status(500).send({message: "No se actualizó"});
                                }
                            })
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                var Fact = new Fact();
                Fact.name = req.user.name;
                Fact.products = producto;
                Fact.save((err,FactSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al guardar factura"});
                    }else if(FactSaved){
                        User.findByIdAndUpdate(userId,{$push:{Facts:FactSaved._id}},{new:true},(err,userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al conectar factura con usuario"});
                            }else if(userUpdated){
                                Carrito.findOneAndRemove({owner: userId},(err,carritoRemoved)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al eliminar carrito"});
                                    }else if(carritoRemoved){
                                        var carrito = new Carrito();
                                        carrito.owner = req.user.sub;
                                        carrito.save((err,carritoSaved)=>{
                                            if(err){
                                                return res.status(500).send({message: "Error al limpiar carrito"});
                                            }else if(carritoSaved){
                                                return res.send({message: "Carrito listo para otra compra",FactSaved});
                                            }else{
                                                return res.status(404).send({message: "No se limpió el carrito"});
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: "Carrito no existente"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se conectó la factura con el usuario"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Factura no creada"});
                    }
                })
            }else{
                return res.status(403).send({message: "No tiene productos en su carrito"});
            }
        }else{
            return res.status(403).send({message: "No se encontró su carrito"});
        }
    })
}

function ObtenerFacts(req,res){
    var userId = req.user.sub;

    if(req.user.role == "ROLE_ADMIN"){
        Fact.find({}).exec((err,Facts)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener facturas"});
            }else if(Facts){
                return res.send({message: "Todas las facturas: ",Facts});
            }else{
                return res.status(403).send({message: "No hay facturas por mostrar"});
            }
        })
    }else{
        User.findOne({_id : userId}).populate("Facts").exec((err,user)=>{
            if(err){
                console.log(err);
                return res.status(500).send({message: "Error al obtener datos"});
            }else if(user){
                var facturas = user.Facts;
                return res.send({message: "Facturas: ",facturas});
            }else{
                return res.status(403).send({message: "No hay registros"});
            }
        })
    }
}

function ObtenerProductosFact(req,res){
    var FactId = req.params.id;

    Fact.findById({_id:FactId}).populate("products").exec((err,FactFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar factura"});
        }else if(FactFind){
            var productos = FactFind.products;
            return res.send({message: "Los productos de la factura son: ",productos});
        }else{
            return res.status(403).send({message: "ID de factura inexistente"});
        }
    })
}

function ObtenerMasProductos(req,res){
    Fact.find({}).populate("products").exec((err,Facts)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos"});
        }else if(Facts){
            let productos = [];
            Facts.forEach(element => {
                if(productos.includes(element.products)){
                    //No hace nada
                }else{
                    productos.push(element.products);
                }
            });
            return res.send({message: "Los productos más vendidos: ",productos});
        }else{
            return res.status(403).send({message: "No hay productos por mostrar"});
        }
    })
}

module.exports = {
    AgregarFact,
    ObtenerFacts,
    ObtenerProductosFact,
    ObtenerMasProductos
}