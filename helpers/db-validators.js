const Usuario = require('../models/usuario');
const Role = require('../models/role');

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

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}