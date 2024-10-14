'use strict';
const UsuarioService = require('../services/UsuarioService')
const db = require('../models/')
const Usuario = db.Usuario;
const Roles_Usuario = db.Roles_Usuario;
const sequelize = db.sequelize;
const Rol = db.Rol;
const Facultad = db.Facultad;
const Programa = db.Programa;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logError = require('../utils/loggingErrors');

const EncuestaService = require("../services/EncuestaServices");

const EncuestaController = {
    async registrarEncuesta(req, res) {
        try {
            const { idCoord } = req.body;
            const performedBy = req.user.id;
            const encuesta = await EncuestaService.registrarEncuesta(
              idCoord,
              performedBy
            );
            res.status(200).send(encuesta);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async listarEncuestas(req, res) {
        const {
          inputSearch = '',
          estadoEncuesta,
          page = 1,
          pageSize = 9,
          sortBy = "fechaCreacion",
          sortOrder = "DESC"
        } = req.body;
        try {
          const resultado = await EncuestaService.listarEncuestas(
            inputSearch,
            estadoEncuesta,
            page,
            pageSize,
            sortBy,
            sortOrder,
          );
          res.status(200).json(resultado);
        } catch (error) {
          await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({
            message: "Error al listar encuestas",
            error: error.message,
          });
        }
    
    },
    async listadoPreguntasOpciones(req, res) {
      try {
        const { idEncuesta } = req.body;
        const result = await EncuestaService.listadoPreguntasOpciones(idEncuesta);
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        await logError(error, req.user.id, req.originalUrl, req.method, req.body);
        res.status(500).json({
          message: 'Error al obtener listado de preguntas y opciones',
          error: error.message
        });
      }
    },
    async listarEncuestasAlumno(req, res) {
      const { idAlumno, page, pageSize, searchCriteria } = req.body;
      try {
        const resultado = await EncuestaService.listarEncuestasAlumno(idAlumno, page, pageSize, searchCriteria);
        res.status(200).json(resultado);
      } catch (error) {
        console.error("Error al insertar la sesión de cita", error);
        await logError(error, req.user.id, req.originalUrl, req.method, req.body);
        res.status(500).json({
          message: "Error al listar encuestas",
          error: error.message,
        });
      }
    },
    async registroRespuestas(req, res) {
      try {
        const { idEncuesta, respuestas } = req.body;
        const performedBy = req.user.id;
        const result = await EncuestaService.registroRespuestas(idEncuesta, respuestas, performedBy);
        res.status(200).json({
          message: 'Respuestas registradas exitosamente',
          data: result
        });
      } catch (error) {
        console.log(error);
        await logError(error, req.user.id, req.originalUrl, req.method, req.body);
        res.status(500).json({
          message: 'Error al registrar respuestas',
          error: error.message
        });
      }
    }
};






module.exports = EncuestaController;


