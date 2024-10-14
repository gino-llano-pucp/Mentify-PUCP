const express = require("express");
const router = require("express").Router();
const EncuestaMaestraController = require("../controllers/EncuestaMaestraController");
const {
  verifyToken,
  refreshToken,
  verifyTokenAdmin,
  verifyTokenCoordAdmin,
} = require("../middleware/authMiddleware");
const Usuario = require("../models/Usuario");

router.use(verifyToken);

router.post("/", EncuestaMaestraController.registrarEncuestaMaestra);

//Ruta para listar las solicitudes de encuestas maestras
router.post("/listarEncuestasMaestras", EncuestaMaestraController.listarEncuestasMaestra);

module.exports = router;
