"use strict";
const UsuarioService = require("../services/UsuarioService");
const db = require("../models/");
const Usuario = db.Usuario;
const Roles_Usuario = db.Roles_Usuario;
const sequelize = db.sequelize;
const Rol = db.Rol;
const Facultad = db.Facultad;
const Programa = db.Programa;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const EstadoEncuestaService = require("../services/EstadoEncuestaServices");

const EstadoEncuestaController = {
  async listarEstadoEncuestas(req, res) {
    try {
      const estadoEncuestas = await EstadoEncuestaService.listarEstadoEncuestas();
      return res.status(200).json(estadoEncuestas);
    } catch (error) {
      return res.status(500).send({
        message: "Error al obtener los estados de las encuestas",
      });
    }
  },
};

module.exports = EstadoEncuestaController;
