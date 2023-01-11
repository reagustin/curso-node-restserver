const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { DefaultTransporter } = require('google-auth-library');

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

const googleSignin = async(req, res = response) => {
    const { id_token } = req.body;

    try {        
        const {nombre, img, correo} = await googleVerify(id_token);
        
        // generar la referencia para verificar si el correo ya existe en la DB
        let usuario = await Usuario.findOne({correo});
        // hacemos el manejo ahora
        if(!usuario) {
            const data = {
                nombre,
                correo,
                password: '=P',
                rol: 'USER_ROLE', 
                img,               
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        // verificar el estado del usuario en la dDB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {        
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignin
}