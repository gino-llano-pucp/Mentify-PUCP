const express = require('express');
const router = require('express').Router();
const ProgramaController = require('../controllers/ProgramaController')
const db = require('../models');
const Programa = db.Programa;
const {verifyTokenCoordAdmin, verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken)

// Ruta para registrar un nuevo Programa
router.post('/register', ProgramaController.crearPrograma);

router.post('/registrar',ProgramaController.agregarOAsignarCoordinador);
//Ruta para eliminar logicamente Programa
router.delete('/eliminar', ProgramaController.eliminar);

router.put('/activar', ProgramaController.activar);
// Ruta para obtener todos los Programas
router.get('/listar-todos', ProgramaController.obtenerTodos);

// Ruta para obtener una Programa por ID
router.get('/:id', ProgramaController.obtenerPorId);

//Ruta para actualizar por id
router.put('/:id', ProgramaController.actualizar);

//Ruta para listar paginacion
router.post('/listar-paginacion/:page', ProgramaController.listarPaginacion);

router.post('/editar', verifyTokenCoordAdmin,ProgramaController.editar);

// New route for listing programs by user ID
router.post('/listar-programas-usuario', ProgramaController.listarProgramasPorUsuario);

//obtener programa de un coordinador
router.post("/obtener-programa-coordinador",ProgramaController.obtenerProgramaCoordinador);

module.exports = router;