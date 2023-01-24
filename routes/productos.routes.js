const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos.controller');
const { existeCategoriaPorId ,existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/// Nota: {{url}}/api/categorias

router.get('/', obtenerProductos);

// Obtener producto POR ID - publico - CREAR middleware que valide el id
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId), // TODO: arreglar aca
    validarCampos
],obtenerProducto)

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('categoria','No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoriaPorId), 
        validarCampos
    ],crearProducto)

// Actualizar - privado - cualquier con token valido
router.put('/:id', [    
    validarJWT,  
    // check('id','No es un id de Mongo').isMongoId(),  
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto)

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),    
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)


module.exports = router;