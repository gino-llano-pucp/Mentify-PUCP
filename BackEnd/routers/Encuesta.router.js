const express = require("express");
const router = require("express").Router();
const EncuestaController = require("../controllers/EncuestaController");
const {verifyToken,refreshToken,verifyTokenAdmin,verifyTokenCoordAdmin,} = require("../middleware/authMiddleware");
const Usuario = require("../models/Usuario");

router.use(verifyToken);

router.post("/", EncuestaController.registrarEncuesta);

//Ruta para listar las solicitudes de encuestas
router.post("/listarEncuestas", EncuestaController.listarEncuestas);

router.post('/listado-preguntas-opciones', EncuestaController.listadoPreguntasOpciones);

//Ruta para listar las solicitudes de encuestas
router.post("/listarEncuestasAlumno", EncuestaController.listarEncuestasAlumno);

router.post('/registro-respuestas', EncuestaController.registroRespuestas)

module.exports = router;
