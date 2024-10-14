const AsignacionTutorAlumnoServices = require('../services/AsignacionTutorAlumnoServices');
const TipoTutoriaService = require('../services/TipoTutoriaServices');
const logError = require('../utils/loggingErrors');

const AsignacionTutorAlumnoController = {

    // Controlador para asignar tipo de tutoría con el Tutor a un alumno
    async asignarTutorAlumno(req, res) {
        const { codigoAlumno, codigoTutor, nombreTipoTutoria ,id_solicitud} = req.body;
        const performedBy = req.user.id;
        try {
            const result = await AsignacionTutorAlumnoServices.asignarTipoTutoriaAAlumno(codigoAlumno, 
                codigoTutor, nombreTipoTutoria,id_solicitud, performedBy);
            res.status(200).json(result);
        } catch (error) {
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(400).json({ error: error.message });
        }
    },

    async createAsignacionTutorAlumno(req, res) {
        const { fid_alumno, fid_tutor, fid_tipoTutoria, fid_solicitud } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaAsignacionTutorAlumno = await AsignacionTutorAlumnoServices.createAsignacionTutorAlumno({ fid_alumno,
                 fid_tutor, fid_tipoTutoria, fid_solicitud, performedBy });
            res.status(201).json({
                message: 'AsignacionTutorAlumno creada con éxito',
                nuevaAsignacionTutorAlumno
            });
        } catch (error) {
            console.error("Error creando la AsignacionTutorAlumno.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllAsignacionTutorAlumnos(req, res) {
        try {
            const asignacionTutorAlumnos = await AsignacionTutorAlumnoServices.getAllAsignacionTutorAlumnos();
            res.status(200).json(asignacionTutorAlumnos);
        } catch (error) {
            console.error("Error obteniendo las AsignacionTutorAlumno.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAsignacionTutorAlumnoById(req, res) {
        const { id } = req.params;
        try {
            const asignacionTutorAlumno = await AsignacionTutorAlumnoServices.getAsignacionTutorAlumnoById(id);
            if (!asignacionTutorAlumno) {
                return res.status(404).json({ error: 'AsignacionTutorAlumno no encontrada' });
            }
            res.status(200).json(asignacionTutorAlumno);
        } catch (error) {
            console.error("Error obteniendo la AsignacionTutorAlumno.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateAsignacionTutorAlumno(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const performedBy = req.user.id;
        try {
            const asignacionTutorAlumnoActualizada = await AsignacionTutorAlumnoServices.updateAsignacionTutorAlumno(id, updateData, performedBy);
            if (!asignacionTutorAlumnoActualizada) {
                return res.status(404).json({ error: 'AsignacionTutorAlumno no encontrada' });
            }
            res.status(200).json({
                message: "AsignacionTutorAlumno actualizada con éxito",
                asignacionTutorAlumnoActualizada
            });
        } catch (error) {
            console.error("Error actualizando la AsignacionTutorAlumno.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalAsignacionTutorAlumno(req, res) {
        const { id } = req.params;
        const performedBy = req.user.id;
        try {
            const result = await AsignacionTutorAlumnoServices.deleteLogicalAsignacionTutorAlumno(id, performedBy);
            if (!result) {
                return res.status(404).json({ error: 'AsignacionTutorAlumno no encontrada' });
            }
            res.status(200).json({
                message: "AsignacionTutorAlumno eliminada con éxito",
                result
            });
        } catch (error) {
            console.error("Error eliminando la AsignacionTutorAlumno.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async assignMultipleStudentsToTutoria(req, res) {
        const { alumnos, fid_tutor, fid_tipoTutoria, fid_solicitud } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevasAsignaciones = await AsignacionTutorAlumnoServices.assignMultipleStudentsToTutoria(alumnos, 
                fid_tutor, fid_tipoTutoria, fid_solicitud, performedBy);
            res.status(201).json({
                message: 'Alumnos asignados con éxito a la tutoría',
                nuevasAsignaciones
            });
        } catch (error) {
            console.error("Error asignando alumnos a la tutoría.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async listUsersByTutoriaPaginated(req, res) {
        const { page = 1 } = req.params;
        const { fid_tipoTutoria, pageSize = 10, sortBy = 'fechaCreacion', sortOrder = 'DESC' } = req.body;
        
        if (!fid_tipoTutoria) {
            return res.status(400).json({
                message: "Debe proporcionar el id del tipo de tutoría",
                data: []
            });
        }

        try {
            const result = await AsignacionTutorAlumnoServices.listUsersByTutoriaPaginated(fid_tipoTutoria, page, pageSize, sortBy, sortOrder);
            res.status(200).json({
                message: "Usuarios listados con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar usuarios por tipo de tutoría:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async asignarAlumnosMasivoTipoTutoria(req, res){
        const performedBy = req.user.id;
        //nombre tipo tutoria
        const {idTipoTutoria, usuarios} = req.body;
        if(!usuarios || !usuarios.length) {
            return res.status(204).json({
                message: "no hay usuarios"
            });
        }
        //const idTipoTutoria = await TipoTutoriaService.obtenerIdPorNombre(tipoTutoriaNombre);
        if(!idTipoTutoria){
            return res.status(400).json({
                message: 'Tipo de tutoria no encontrado'
            });
        }
        try{
            const result = await AsignacionTutorAlumnoServices.asignarAlumnosMasivoTipoTutoria(idTipoTutoria, usuarios, performedBy);
            return res.status(201).json({
                message: 'Usuarios insertados correctamente',
                usuarios: result
            });
        }
        catch(error){
            console.error(error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            return res.status(500).json({
                error: 'No se pudo insertar los usuarios al tipo de tutoria'
            });
        }
    },

    async buscarGrupoDeAlumnosPorCodigo(req, res) {
        const { usuarios } = req.body;
        if(!usuarios || !usuarios.length) {
            return res.status(204).json({
                message: "no hay usuarios"
            });
        }
        try {
            const result = await AsignacionTutorAlumnoServices.buscarGrupoDeAlumnosPorCodigo(usuarios);
            return res.status(201).json({
                message: "Usuarios encontrados con exito",
                usuarios: result
            })
        }
        catch(error) {
            console.error(error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            return res.status(500).json({
                error: "No se pudo devolver los alumnos"
            })
        }
    },
    async getAlumnosAsignados(req, res) {
        const { id_tipoTutoria, id_tutor, inputSearch, page, pageSize } = req.body;

        try {
            const result = await AsignacionTutorAlumnoServices.listarAlumnosPorTutor(id_tipoTutoria, id_tutor, inputSearch, page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error al listar alumnos asignados:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ message: 'Error al listar alumnos asignados.' });
        }
    },
    async listTutoresPorTipoTutoriaYAlumnoPaginado(req, res) {
        const { fid_tipoTutoria,page = 1, pageSize = 9, sortBy = 'fechaCreacion', sortOrder = 'DESC', searchCriterias = [] } = req.body;
        
        const fid_alumno = req.user.id;
        if (!fid_alumno || !fid_tipoTutoria) {
            return res.status(400).json({
                message: "Debe proporcionar el ID del alumno y el ID del tipo de tutoría."
            });
        }
    
        try {
            const result = await AsignacionTutorAlumnoServices.listTutoresPorTipoTutoriaYAlumnoPaginado(
                fid_alumno,
                fid_tipoTutoria,
                page,
                pageSize,
                sortBy,
                sortOrder,
                searchCriterias
            );
    
            if (!result || result.tutores.length === 0) {
                return res.status(404).json({
                    message: "No se encontraron tutores para los criterios proporcionados."
                });
            }
    
            res.status(200).json({
                message: "Tutores encontrados con éxito.",
                data: result
            });
        } catch (error) {
            console.error('Error al listar tutores:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ message: 'Error interno del servidor al listar tutores.' });
        }
    },
    async listarTiposTutoriaAsignados(req, res) {
        const { idAlumno, idTutor } = req.body;
    
        try {
          const result = await AsignacionTutorAlumnoServices.listarTiposTutoriaAsignados(idAlumno, idTutor);
          res.status(200).json({
            message: 'Tipos de tutoría listados con éxito',
            data: result
          });
        } catch (error) {
          console.error('Error al listar tipos de tutoría:', error);
          await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({ error: 'Error al listar tipos de tutoría' });
        }
      }
    
    
};

module.exports = AsignacionTutorAlumnoController;
