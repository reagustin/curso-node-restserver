const { response } = require("express");
const {Categoria} = require("../models");

const obtenerCategorias = async(req, res = response) => {
    const{limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])

    res.status(201).json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req, res = response) => {
    const {id} = req.params;
    
    const categoria = await Categoria.findById( id ).populate('usuario','nombre');
    // esta validacion de existencia Fernando no la incluyo
    if(categoria.estado === false) {
        return res.status(400).json({
            msg: `La categoria ${categoria.nombre} ha sido eliminada`
        })
    }

    res.status(201).json(categoria);
}


const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    console.log('ACA LLEGUE');
    const categoriaDB = await Categoria.findOne({nombre});
    // console.log('QUE HAY EN CATEGORIA',categoriaDB);
    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const { estado, usuario, ...data} = req.body;    

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} );

    res.status(201).json(categoria);
}

// borrarCategoria - estado: false (necesito el id y lo tengo que verificar)
const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;    

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true} );

    res.status(201).json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}