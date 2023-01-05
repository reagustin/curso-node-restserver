const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;
    
    try {
        // verificar si el email existe
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - correo'
            })
        }

        // verificar si user esta activo    
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - estado:false'
            })
        }

        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - password'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token          
        })        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    login
}