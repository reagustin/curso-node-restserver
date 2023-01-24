const { Usuario, Role, Categoria, Producto } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    };
}

const emailExiste = async(correo = '') => {

    // Verificar que el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado`)        
    }
}

const existeUsuarioPorId = async(id) => {
    // Verificar que el id existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`)        
    }
}

const existeCategoriaPorId = async(id) => {
    // Verificar que la categoria existe mediante su id
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria: ${id} no existe`)        
    }
}

const existeProductoPorId = async(id) => {
    // Verificar que la categoria existe mediante su id
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto: ${id} no existe`)        
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}