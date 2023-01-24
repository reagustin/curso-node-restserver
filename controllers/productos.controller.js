const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async(req, res = response) => {
    const{limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.status(201).json({
        total,
        productos
    });
}

// obtenerProducto - populate {}
const obtenerProducto = async(req, res = response) => {
    const {id} = req.params;
    
    const producto = await Producto.findById( id )
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre');
    
    if(producto.estado === false) {
        return res.status(400).json({
            msg: `El producto ${producto.nombre} ha sido eliminado`
        })
    }

    res.status(201).json(producto);
}


const crearProducto = async(req, res = response) => {
    const {estado, usuario, ...body} = req.body;
    const nombre = body.nombre.toUpperCase();
        
    const productoDB = await Producto.findOne({nombre});

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    
    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.json(producto);

}

// actualizarProducto
const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;
    const { estado, usuario, ...data} = req.body;    // TODO: que necesito aca?

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new: true} );

    res.json(producto);
}

// borrarProducto - estado: false (necesito el id y lo tengo que verificar)
const borrarProducto = async(req, res = response) => {
    const {id} = req.params;    

    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true} );

    res.status(201).json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}