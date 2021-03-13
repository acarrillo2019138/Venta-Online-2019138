"use strict"

var Producto = require("../models/producto.model");
var Categoria = require("../models/categoria.model");

function AgregarProducto(req,res){
    var categoriaId = req.params.id;
    var params = req.body;

    if(params.name && params.price && params.stock){
        Categoria.findById(categoriaId,(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                Producto.findOne({name: params.name},(err,productFind)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar producto"});
                    }else if(productFind){
                        return res.send({message: "Producto ya existente"});
                    }else{
                        var product = new Producto();
                        product.name = params.name;
                        product.price = params.price;
                        product.stock = params.stock;
                        product.save((err,productSaved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al agregar"});
                            }else if(productSaved){
                                Categoria.findByIdAndUpdate(categoriaId,{$push:{products:productSaved._id}},{new: true},(err,categoryUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al agregar producto a categoría"});
                                    }else if(categoryUpdated){
                                        return res.send({message: "Producto agregado a la categoría exitosamente",categoryUpdated});
                                    }else{
                                        return res.status(404).send({message: "No se agregó el producto a categoría"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se guardó"});
                            }
                        })
                    }
                })
            }else{
                return res.status(403).send({message: "Categoría inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre, precio y cantidad)"});
    }
}

function ObtenerProducto(req,res){
    Producto.find({}).exec((err,productos)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar"});
        }else if(productos){
            return res.send({message: "Productos: ",productos});
        }else{
            return res.status(403).send({message: "No se encontraron productos"});
        }
    })
}

function ActualizarProducto(req,res){
    var categoriaId = req.params.idC;
    var productoId = req.params.idP;
    var update = req.body;

    if(update.stock){
        Producto.findById(productoId,(err,productFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar producto"});
            }else if(productFind){
                Categoria.findOne({_id:categoriaId,products:productoId},(err,categoryFind)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar categoría"});
                    }else if(categoryFind){
                        Producto.findByIdAndUpdate(productoId,update,{new:true},(err,productUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al actualizar producto"});
                            }else if(productUpdated){
                                return res.send({message: "Producto actualizado exitosamente",productUpdated});
                            }else{
                                return res.status(404).send({message: "No se actualizó"});
                            }
                        })
                    }else{
                        return res.status(403).send({message: "ID de categoría inexistente"});
                    }
                })
            }else{
                return res.status(403).send({message: "ID de producto no existente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (cantidad)"});
    }
}

function EliminarProducto(req,res){
    var categoriaId = req.params.idC;
    var productoId = req.params.idP;

    Categoria.findOneAndUpdate({_id:categoriaId,products:productoId},{$pull:{products:productoId}},{new:true},(err,categoryUpdated)=>{
        if(err){
            return res.status(500).send({message: "Error al eliminar de categoría"});
        }else if(categoryUpdated){
            Producto.findByIdAndRemove(productoId,(err,productRemoved)=>{
                if(err){
                    return res.status(500).send({message: "Error al eliminar producto"});
                }else if(productRemoved){
                    return res.send({message: "Producto eliminado exitosamente"});
                }else{
                    return res.status(403).send({message: "No se eliminó"});
                }
            })
        }else{
            return res.status(404).send({message: "Producto inexistente o ya fue eliminado"});
        }
    })
}

function BuscarProducto(req,res){
    var params = req.body;

    if(params.search){
        Producto.find({name: params.search},(err,resultSearch)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar coincidencias"});
            }else if(resultSearch){
                return res.send({message: "Coincidencias encontradas: ",resultSearch});
            }else{
                return res.status(403).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Producto.find({}).exec((err,productos)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(productos){
                return res.send({message: "Productos: ",productos});
            }else{
                return res.status(403).send({message: "No se encontraron productos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el campo de búsqueda (search)"});
    }
}

function CantidadProductos(req,res){
    Producto.find({stock: 0},(err,resultSearch)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos agotados"});
        }else if(resultSearch){
            if(resultSearch != ""){
                return res.send({message: "Productos agotados: ",resultSearch});
            }else{
                return res.status(404).send({message: "No se encontraron productos agotados"});
            }
        }else{
            return res.status(404).send({message: "No se encontraron productos agotados"});
        }
    })
}

module.exports = {
    AgregarProducto,
    ObtenerProducto,
    ActualizarProducto,
    EliminarProducto,
    BuscarProducto,
    CantidadProductos
}