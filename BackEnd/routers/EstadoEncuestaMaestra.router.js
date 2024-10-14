const express = require("express");
const router = require("express").Router();
const EstadoEncuestaMaestraController = require("../controllers/EstadoEncuestaMaestraController");
const {
  verifyToken,
  refreshToken,
  verifyTokenAdmin,
  verifyTokenCoordAdmin,
} = require("../middleware/authMiddleware");
const Usuario = require("../models/Usuario");

router.use(verifyToken);

router.get("/", verifyToken, EstadoEncuestaMaestraController.listarEstadoEncuestasMaestra);

module.exports = router;
