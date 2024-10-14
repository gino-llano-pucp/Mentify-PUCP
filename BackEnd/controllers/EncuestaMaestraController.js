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
const EncuestaMaestraService = require("../services/EncuestaMaestraServices");
const logError = require("../utils/loggingErrors");

const EncuestaMaestraController = {
  async registrarEncuestaMaestra(req, res) {
    try {
      const { idCoord } = req.body;
      const performedBy = req.user.id;
      //let resultado;
      const encuestaMaestra =
        await EncuestaMaestraService.registrarEncuestaMaestra(idCoord, performedBy);
      // Verificar si el resultado es exitoso y agregarlo al arreglo
        if (encuestaMaestra.status !== "error") {
          res.status(200).send(encuestaMaestra);
        } else {
          // Aquí puedes decidir si quieres devolver los errores individuales o solo ignorarlos
          console.log(
            `Error al registrar enceusta maestra: ${encuestaMaestra.message}`
          );
          res.status(500).send(encuestaMaestra);
        }
      
    } catch (error) {
        console.log(`Error al registrar encuesta maestra: ${error}`);
        await logError(error, req.user.id, req.originalUrl, req.method, req.body);
        res.status(400).send(error);
    }
  },
  async listarEncuestasMaestra(req, res) {
    const {
      inputSearch = "",
      estadoEncuesta,
      page = 1,
      pageSize = 9,
      sortBy = "fechaCreacion",
      sortOrder = "DESC",
      idCoord
    } = req.body;
    
    try {
      const resultado = await EncuestaMaestraService.listarEncuestasMaestra(
        inputSearch,
        estadoEncuesta,
        page,
        pageSize,
        sortBy,
        sortOrder,
        idCoord
      );
      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({
        message: "Error al listar encuestas maestras",
        error: error.message,
      });
    }
  },
};

module.exports = EncuestaMaestraController;
