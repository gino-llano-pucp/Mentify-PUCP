const express = require("express");
const router = require("express").Router();
const EstadoEncuestaController = require("../controllers/EstadoEncuestaController");
const {
  verifyToken,
  refreshToken,
  verifyTokenAdmin,
  verifyTokenCoordAdmin,
} = require("../middleware/authMiddleware");
const Usuario = require("../models/Usuario");

router.use(verifyToken);

router.get("/", EstadoEncuestaController.listarEstadoEncuestas);

module.exports = router;
