const jwt = require("jsonwebtoken");
const db = require("../models/");
const { Sequelize, Op, where } = require("sequelize");
const sequelize = db.sequelize;

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { es } = require("date-fns/locale");
const { at } = require("lodash");
const e = require("express");
const Usuario = db.Usuario;
const Encuesta = db.Encuesta;
const EstadoEncuestaMaestra = db.EstadoEncuestaMaestra;
const Facultad = db.Facultad;
const Programa = db.Programa;
const EncuestaMaestra = db.EncuestaMaestra;
const Rol = db.Rol;
const AlumnoSesionCita = db.AlumnoSesionCita;
const SesionCita = db.SesionCita;
const Pregunta = db.Pregunta;
const Opcion = db.Opcion;


const EncuestaMaestraService = {
  async registrarEncuestaMaestra(idCoord, performedBy) {
    try {
      const coordinador = await Usuario.findByPk(idCoord, {
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { es_activo: true },
            through: { attributes: [] },
          },
        ],
      });

      if (!coordinador) {
        throw new Error("Coordinador no encontrado");
      }

      const esCoordinadorFacultad = coordinador.Roles.some((rol) =>
        rol.nombre.includes("Coordinador de Facultad")
      );

      let whereConditions = { esActivo: true };
      let facultad = null;
      if (esCoordinadorFacultad) {
        facultad = await Facultad.findOne({where: {fid_usuario: idCoord, esActivo: true}})
        whereConditions.fid_facultad = facultad.id_facultad;
      }

      // Buscar la fecha de Creacion de la ultima encuesta Vigente
      const ultimaEncuestaVigente = await EncuestaMaestra.findOne({
        attributes: [`id_encuesta_maestra`, `fid_facultad`, `titulo`, `fechaCreacion`, `fechaActualizacion`, `esActivo`, `fid_estado_encuesta_maestra`],
        where: {
          fid_facultad: facultad.id_facultad,
          fid_estado_encuesta_maestra: 1,
        },
        order: [['fechaCreacion', 'DESC']],
      });

      const fechaUltimaEncuestaVigente = ultimaEncuestaVigente
        ? ultimaEncuestaVigente.fechaCreacion
        : null;

      console.log(fechaUltimaEncuestaVigente);

      const alumnos = await Usuario.findAll({
        where: whereConditions,
        include: [
          {
            model: Rol,
            as: "Roles",
            where: {
              nombre: "Alumno",
              es_activo: true,
            },
            through: { attributes: [] },
          },
          {
            model: AlumnoSesionCita,
            as: "AlumnoSesionCitas",
            required: true,
            include: [
              {
                model: SesionCita,
                as: "SesionCita",
                where: {
                  fid_resultado: { [Op.ne]: null },
                  fechaCreacion: fechaUltimaEncuestaVigente
                    ? { [Op.gt]: fechaUltimaEncuestaVigente }
                    : { [Op.ne]: null },
                },
              },
            ],
          },
          {
            model: Programa,
            as: "Programa",
            attributes: ["nombre"],
          },
        ],
        distinct: true,
      });

      console.log("Alumnos:", alumnos);

      if (!alumnos || alumnos.length === 0) {
        return {
          message: "No hay alumnos para enviar encuestas",
          status: "error",
          data: { message: "No hay alumnos para enviar encuestas" },
          status: "error",
        };
      }

      if (ultimaEncuestaVigente) {
        await ultimaEncuestaVigente.update({ fid_estado_encuesta_maestra: 2 }, 
            { performedBy, individualHooks: true }); // 2 para estado Finalizado
      }

      const encuestaMaestra = await EncuestaMaestra.create({
        titulo: "Encuesta: " + new Date().toLocaleDateString("es-PE"),
        fid_facultad: facultad.id_facultad,
        fid_estado_encuesta_maestra: 1,
      }, { performedBy, individualHooks: true });

      // Las encuestas a cada alumno:
      alumnos.map(async (alumno) => {
        // Crear encuesta para cada alumno y estas encuestas se relacionan con la encuesta maestra
        let encu = await Encuesta.create({
          fid_alumno: alumno.id_usuario, // id del alumno,
          fid_estado_encuesta: 1,
          fid_encuesta_maestra: encuestaMaestra.id_encuesta_maestra,
        }, { performedBy, individualHooks: true });
        return encu;
      });

      return {
        message: "Encuesta creada exitosamente",
        status: "success",
        data: encuestaMaestra,
      };
    } catch (error) {
      console.error("Error en registrarEncuestaMaestra:", error);
      return {
        message: "Error en registrarEncuestaMaestra",
        status: "error",
        error: error.message,
      };
    }
  },

  async listarEncuestasMaestra(inputSearch, estadoEncuesta, page, pageSize, sortBy, sortOrder, idCoord) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;
  
    const facultad = await Facultad.findOne({ where: { fid_usuario: idCoord, esActivo: true } });
    let whereConditions = { fid_facultad: facultad.id_facultad, esActivo: true }; // Filtrar por coordinador
    let estadoConditions = { esActivo: true };
  
    if (inputSearch) {
      // Filtrar por búsqueda en título de la encuesta maestra
      whereConditions.titulo = { [Op.like]: `%${inputSearch}%` };
    }
  
    // Filtrar por estado de la encuesta maestra
    if (estadoEncuesta !== "Todos") {
      estadoConditions.nombre = estadoEncuesta;
    } else {
      estadoConditions.nombre = ["Vigente", "Finalizado"];
    }
  
    try {
      // Fetch all relevant data first
      const encuestasMaestras = await EncuestaMaestra.findAll({
        attributes: ['id_encuesta_maestra', 'titulo', 'fechaCreacion', 'fechaActualizacion', 'fid_estado_encuesta_maestra'],
        where: whereConditions,
        include: [
          {
            model: EstadoEncuestaMaestra,
            as: "EstadoEncuestaMaestra",
            attributes: ["nombre"],
            where: estadoConditions,
          },
          {
            model: Encuesta,
            as: "Encuestas",
            attributes: ["id_encuesta", "fid_estado_encuesta"],
          },
        ],
      });
  
      // Apply pagination after filtering
      const paginatedEncuestasMaestras = encuestasMaestras.slice(offset, offset + limit);
  
      const formattedEncuestasMaestras = paginatedEncuestasMaestras.map((encuestaMaestra) => {
        const encuestas = encuestaMaestra.Encuestas || [];
  
        const cant_Alumnos = encuestas.length;
        const cant_Alumnos_pendiente = encuestas.filter((encuesta) => encuesta.fid_estado_encuesta === 1).length;
        const cant_Alumnos_respondido = encuestas.filter((encuesta) => encuesta.fid_estado_encuesta === 2).length;
  
        return {
          id_encuesta_maestra: encuestaMaestra.id_encuesta_maestra,
          titulo: encuestaMaestra.titulo,
          cant_Alumnos: cant_Alumnos,
          cant_Alumnos_pendiente: cant_Alumnos_pendiente,
          cant_Alumnos_respondido: cant_Alumnos_respondido,
          fechaCreacion: encuestaMaestra.fechaCreacion,
          fechaActualizacion: encuestaMaestra.fechaActualizacion,
          estado_encuesta_maestra: encuestaMaestra.EstadoEncuestaMaestra.nombre
        };
      });
  
      return {
        message: "Encuestas maestras listadas con éxito",
        data: {
          totalPages: Math.ceil(encuestasMaestras.length / limit),
          currentPage: parseInt(page),
          totalEncuestasMaestras: encuestasMaestras.length,
          encuestasMaestras: formattedEncuestasMaestras,
        },
      };
    } catch (error) {
      console.error("Error al listar encuestas maestras:", error);
      return {
        message: "Error al listar encuestas maestras",
        status: "error",
        error: error.message,
      };
    }
  },
  
};

module.exports = EncuestaMaestraService;
