const FacultadService = require('../services/FacultadServices')
const db = require('../models/')
const Usuario = db.Usuario;
const Rol = db.Rol;
const Facultad = db.Facultad;
const sequelize = db.sequelize;

const UsuarioService = require('../services/UsuarioService');
const logError = require('../utils/loggingErrors');

const FacultadController = {
  async crearFacultad(req, res) {
    const FacultadData = req.body;
    const performedBy = req.user.id;
    try {
      const nuevaFacultad = await FacultadService.insertar(FacultadData, performedBy);
      res.status(201).json({
        message: "Facultad creado",
        nuevaFacultad,
      });
    } catch (err) {
      console.error("Error al insertar Facultad", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async obtenerTodos(req, res) {
    try {
      const facultades = await FacultadService.obtenerTodos();
      res.status(200).json({
        message: "Se obtuvieron los datos con exito",
        facultades,
      });
    } catch (err) {
      console.error("Error al obtener datos de la Facultad", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async obtenerPorId(req, res) {
    const tipoId = req.params.id;
    try {
      const tipo = await FacultadService.obtenerPorId(tipoId);
      if (!tipo) {
        return res.status(404).json({ error: "Facultad no econtrado" });
      }
      res.status(200).json({
        message: "Se obtuvo la Facultad solicitada con exito",
        tipo,
      });
    } catch (err) {
      console.error("Error obteniendo Facultad:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async actualizar(req, res) {
    const facultadId = req.params.id;
    const facultadData = req.body;
    const performedBy = req.user.id;
    try {
      const actualizarFacultad = await FacultadService.actualizar(
        facultadId,
        facultadData,
        performedBy
      );
      if (!actualizarFacultad) {
        return res.status(404).json({ error: "Facultad no econtrada" });
      }
      res.status(200).json({
        message: "Actualizado con exito",
        actualizarFacultad,
      });
    } catch (err) {
      console.error("Error actualizando Facultad:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async eliminar(req, res) {
    const facultadData = req.body;
    const performedBy = req.user.id;
    try {
      const eliminarFacultad = await FacultadService.eliminar(facultadData, performedBy);
      if (!eliminarFacultad) {
        return res.status(404).json({ error: "Facultad no econtrado" });
      }
      eliminarFacultad.esActivo = 0;
      res.status(200).json({
        message: "Eliminado con exito",
        eliminarFacultad,
      });
    } catch (err) {
      console.error("Error eliminando facultad:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: { message: err.message} });
    }
  },
  async activar(req, res) {
    const facultadData = req.body;
    const performedBy = req.user.id;
    try {
      const activarFacultad = await FacultadService.activar(facultadData, performedBy);
      if (!activarFacultad) {
        return res.status(404).json({ error: "Facultad no econtrado" });
      }
      activarFacultad.esActivo = 1;
      res.status(200).json({
        message: "Activado con exito",
        activarFacultad,
      });
    } catch (err) {
      console.error("Error activando facultad:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async agregarOAsignarCoordinador(req, res) {
    try {
      const data = req.body;
      const {
        id,
        code,
        name,
        primerApellido,
        segundoApellido,
        email,
        isSelectedFromSearch,
        facultadNombre,
      } = req.body;
      const performedBy = req.user.id;
      console.log("data aqui: ", req.body);
      // Verifica que todos los campos requeridos estén presentes
      if (
        !code ||
        !name ||
        !primerApellido ||
        //!segundoApellido ||
        !email ||
        isSelectedFromSearch === undefined ||
        !facultadNombre
      ) {
        return res.status(400).json({
          error: { message: "Falta uno o más campos requeridos." },
        });
      }
      const resultado = await FacultadService.agregarOAsignarCoordinador(data, performedBy);
      return res.status(200).json(resultado);
    } catch (error) {
      
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      return res.status(500).json({ error: { message: error.message } });
    }
  },
  async editar(req, res) {
    try {
      const data = req.body;
      const performedBy = req.user.id;

      const resultado = await FacultadService.editarFacultad(data, performedBy);
      return res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      return res.status(500).json({ error: error.message });
    }
  },
  async obtenerProgramasDeFacultad(req, res) {
    const facultadId = req.params.id;
    try {
      if (isNaN(facultadId)) {
        // Comprueba si el ID no es un número
        return res
          .status(400)
          .json({ message: "El ID proporcionado es inválido." });
      }
      const resultado = await FacultadService.obtenerProgramas(facultadId);
      return res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      return res.status(500).json({ error: error.message });
    }
  },
  async listarPaginacion(req, res) {
    const { page = 1 } = req.params;
    const {
      pageSize = 9,
      sortBy = "nombre",
      sortOrder = "ASC",
      searchCriterias = [],
    } = req.body;
    console.log("body request: ", req.body);

    try {
      const result = await FacultadService.listarPorPaginacion(
        page,
        pageSize,
        sortBy,
        sortOrder,
        searchCriterias
      );
      res.status(200).json({
        message: "Facultades listadas con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar facultades:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async obtenerFacultadDeCoordinador(req, res) {
    const { idCoord } = req.body;
    try {
      const result = await FacultadService.obtenerFacultadDeCoordinador(
        idCoord
      );
      res.status(200).json({
        message: "Facultad obtenida con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al obtener facultad:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = FacultadController;
