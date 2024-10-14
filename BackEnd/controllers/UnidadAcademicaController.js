const UnidadAcademicaService = require('../services/UnidadAcademicaServices');
const db = require('../models');
const UnidadAcademica = db.UnidadAcademica;
const Usuario = db.Usuario;
const logError  = require('../utils/loggingErrors');  // Import logError function from loggingErrors.js

const UnidadAcademicaController = {
    async crearUnidadAcademica(req, res) {
        const unidadData = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaUnidad = await UnidadAcademicaService.insertar(unidadData, performedBy);
            res.status(201).json({
                message: "Unidad Académica creada con éxito",
                nuevaUnidad
            });
        } catch (error) {
            console.error("Error al crear la Unidad Académica", error);

            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            res.status(500).json({ error: 'Ya existe una unidad académica con el mismo nombre, siglas o correo de contacto.' });
        }
    },

    async obtenerTodos(req, res) {
        try {
            const unidades = await UnidadAcademicaService.obtenerTodos();
            res.status(200).json({
                message: "Lista de Unidades Académicas obtenida con éxito",
                unidades
            });
        } catch (error) {
            console.error("Error al obtener las Unidades Académicas", error);

            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async obtenerPorId(req, res) {
        const id = req.params.id;
        try {
            const unidad = await UnidadAcademicaService.obtenerPorId(id);
            if (!unidad) {
                res.status(404).json({ error: 'Unidad Académica no encontrada' });
            } else {
                res.status(200).json({
                    message: "Unidad Académica obtenida con éxito",
                    unidad
                });
            }
        } catch (error) {
            console.error("Error al obtener la Unidad Académica", error);

            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async listarPaginacion(req, res) {
        const { page = 1 } = req.params;
        const { 
            pageSize = 9, 
            sortBy = 'nombre', 
            sortOrder = 'ASC', 
            searchCriterias = []
            //status = [] 
        } = req.body;
        console.log("body request: ", searchCriterias);

        try {
            const result = await UnidadAcademicaService.listarPorPaginacion(
                page, 
                pageSize, 
                sortBy, 
                sortOrder,
                searchCriterias
                //status
            );
            res.status(200).json({
                message: "Unidades Académicas listadas con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar unidades académicas:', error);

            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async cargaMasivaUnidadesAcademicas(req, res) {
        const unidades = req.body;
        const performedBy = req.user.id;
        try {
            const result = await UnidadAcademicaService.cargaMasivaUnidadesAcademicas(unidades, performedBy);
            res.status(200).json({
                resultado: result
            });
        } catch (error) {

            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            res.status(500).json({ error: error.message });
        }
    },
    async deleteUnidadAcademica(req, res) {
        try {
          const { id_unidad_academica } = req.body;
          const performedBy = req.user.id;
          if (!id_unidad_academica) {
            return res.status(400).json({ message: 'id_unidad_academica is required' });
          }
          const result = await UnidadAcademicaService.deleteUnidadAcademica(id_unidad_academica, performedBy);
          res.status(200).json(result);
        } catch (error) {
          console.error('Error deleting UnidadAcademica:', error);
          await logError(error, req.user.id, req.originalUrl, req.method, req.body);

          res.status(500).json({ message: 'Internal server error' });
        }
    },
    async editUnidadAcademica(req, res) {
        try {
          const { id_unidad_academica, nombre, siglas, correoDeContacto, esActivo } = req.body;
          const performedBy = req.user.id;
          if (!id_unidad_academica) {
            return res.status(400).json({ error: 'id_unidad_academica is required' });
          }
          const result = await UnidadAcademicaService.editUnidadAcademica({
            id_unidad_academica,
            nombre,
            siglas,
            correoDeContacto,
            esActivo,
            performedBy
          });
          res.status(200).json({
            message: "Unidad Académica editada con éxito",
            data: result});
        } catch (error) {
          console.error('Error al editar UnidadAcademica:', error);

          await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          
          if(error.message === "Existe otra Unidad Académica con el mismo nombre, siglas o correo"){
            res
                .status(409)
                .json({ error: "Existe otra Unidad Académica con el mismo nombre, siglas o correo" });
          }else{
            res.status(500).json({ error: error.message || "Error interno del servidor" });
          }

          
        }
    },
    async activarUnidadAcademica(req, res) {
        try {
            const id_unidad_academica = req.body.id_unidad_academica;
            const performedBy = req.user.id;
            const result = await UnidadAcademicaService.activarUnidadAcademica(id_unidad_academica, performedBy);
            return res.status(200).json( {message: "Unidad academica activada con exito"} );
        }
        catch(error) {
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);

            return res.status(500).json( { message: error.message } );
        }
    }
};

module.exports = UnidadAcademicaController;
