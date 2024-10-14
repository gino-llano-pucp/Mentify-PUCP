const express = require('express');
const router = require('express').Router();
const FacultadController = require('../controllers/FacultadController')
const db = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');
const Facultad = db.Facultad;

router.use(verifyToken);

// Ruta para registrar un nueva Facultad
/* router.post('/register', FacultadController.crearFacultad); */

router.post('/registrar', FacultadController.agregarOAsignarCoordinador);

//Ruta para eliminar logicamente Facultad
router.delete('/eliminar', FacultadController.eliminar);

router.put('/activar', FacultadController.activar);

//Ruta para editar una Facultada

router.post('/editar', FacultadController.editar);

// Ruta en Express para agregar facultad y asignar/crear coordinador
/*router.post('/registrar', async (req, res) => {
    const { id, code, name, apellidos, email, isSelectedFromSearch, facultadNombre } = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!code || !name || !apellidos || !email || isSelectedFromSearch === undefined || !facultadNombre) {
        return res.status(400).json({ message: "Todos los campos son requeridos."});
    }
    try {
        const result = await FacultadController.agregarOAsignarCoordinador({ id, code, name, apellidos, email, isSelectedFromSearch, facultadNombre });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: error.message || 'Error desconocido al procesar la solicitud.' });
    }
});*/ 

// Ruta para obtener todos las Facultades
router.get('/listar-todos', FacultadController.obtenerTodos);

// Ruta para obtener una Facultad por ID
router.get('/:id', FacultadController.obtenerPorId);

//Ruta para actualizar por id
router.put('/:id', FacultadController.actualizar);

// Ruta para obtener Programas de una Facultad
router.get('/obtenerProgramas/:id', FacultadController.obtenerProgramasDeFacultad);

router.post('/listar-paginacion/:page', FacultadController.listarPaginacion);

router.post(
  "/obtener-facultad-de-coordinador",
  FacultadController.obtenerFacultadDeCoordinador
);


module.exports = router;