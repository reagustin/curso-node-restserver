const jwt = require('jsonwebtoken');


const generarJWT = (uid = '') => {

    return new Promise( (resolve, reject) => {
        // el uid es lo unico que voy a almacenar en el payload del JWT (podemos poner lo que queramos igual)
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKYE, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('no se pudo generar el token')                
            }else{
                resolve(token)
            }
        })

    })

}

module.exports = {
    generarJWT
}