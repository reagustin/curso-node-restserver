const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId, esRoleValido } = require('../helpers/db-validators');

const router = Router();

/// Nota: {{url}}/api/categorias

router.get('/', obtenerCategorias);

// Obtener CATEGORIA POR ID - publico - CREAR middleware que valide el id
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId), // si la categoria no existe arroja un error - crearlo dentro de DBValidators
    validarCampos
],obtenerCategoria)

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],crearCategoria)

// Actualizar - privado - cualquier con token valido
router.put('/:id', [    
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria)

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),    
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria)


module.exports = router;