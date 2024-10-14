const express = require('express');
const router = require('express').Router();
const RolesUsuarioController = require('../controllers/RolesUsuarioController')
const { verifyToken, refreshToken } = require('../middleware/authMiddleware');

router.use(verifyToken);
//se inserta un rol a un usuario
router.post('/rol-usuario', RolesUsuarioController.insertarEnUsuario);

// crear los cruds para agregar un rol a un usuario,
// eliminar un rol a un usuario, listar todos los roles del usuario, editar uno de los roles de usuario

// agregar usuario con un rol inicial -> agregar usuario + insertar rol en usuario

module.exports = router;