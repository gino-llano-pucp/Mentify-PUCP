const AsignacionTipoTutoriaServices = require('../services/AsignacionTipoTutoriaServices');
const logError = require('../utils/loggingErrors');

const AsignacionTipoTutoriaController = {

    // Controlador para asignar tipo de tutoría a un tutor
    async asignarTipoTutoriaATutor(req, res) {
        const { codigoUsuario, nombreTipoTutoria } = req.body;
        const performedBy = req.user.id;
        try {
            const result = await AsignacionTipoTutoriaServices.asignarTipoTutoria(codigoUsuario, nombreTipoTutoria, performedBy);
            res.status(200).json(result);
        } catch (error) {
            console.log('Error al asignar tipo de tutoría a tutor:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(400).json({ error: error.message });
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
            const result = await AsignacionTipoTutoriaServices.listUsersByTutoriaPaginated(fid_tipoTutoria, page, pageSize, sortBy, sortOrder);
            /* console.log("resultado es: ", result); */
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

    async listarAlumnosPorTipoTutoria(req, res) {
        const { page = 1 } = req.params;
        const { idTipoDeTutoria, pageSize = 10, sortBy = 'nombres', sortOrder = 'ASC', searchCriterias = [] } = req.body;
        const userId = req.user.id;

        // Validación de parámetros necesarios
        if (!idTipoDeTutoria) {
            return res.status(400).json({ error: { message: 'Faltan parámetros necesarios: idTipoDeTutoria' } });
        }

        try {
            const alumnos = await AsignacionTipoTutoriaServices.listarAlumnosPorTipoTutoria({
                userId,
                idTipoDeTutoria,
                page,
                pageSize,
                sortBy,
                sortOrder,
                searchCriterias,
            });
            res.status(200).json({
                message: 'Alumnos listados con éxito',
                data: alumnos
            });
        } catch (error) {
            console.error("Error al listar los alumnos por tipo de tutoría", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    async listarAlumnosPorTipoTutoriaTodos(req, res) {
        const { page = 1 } = req.params;
        const { idTipoDeTutoria, pageSize = 10, sortBy = 'nombres', sortOrder = 'ASC', searchCriterias = [] } = req.body;
        const userId = req.user.id;

        // Validación de parámetros necesarios
        if (!idTipoDeTutoria) {
            return res.status(400).json({ error: { message: 'Faltan parámetros necesarios: idTipoDeTutoria' } });
        }

        try {
            const alumnos = await AsignacionTipoTutoriaServices.listarAlumnosPorTipoTutoriaTodos({
                idTipoDeTutoria,
                page,
                pageSize,
                sortBy,
                sortOrder,
                searchCriterias,
            });
            res.status(200).json({
                message: 'Alumnos listados con éxito',
                data: alumnos
            });
        } catch (error) {
            console.error("Error al listar los alumnos por tipo de tutoría", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async listarTutoresPorTipoTutoria(req, res) {
        const { page = 1 } = req.params;
        const { idTipoDeTutoria, pageSize = 10, sortBy = 'nombres', sortOrder = 'ASC', searchCriterias = [] } = req.body;
        const userId = req.user.id;
        
        // Validación de parámetros necesarios
        if (!idTipoDeTutoria) {
            return res.status(400).json({ error: { message: 'Faltan parámetros necesarios: idTipoDeTutoria' } });
        }

        try {
            const tutores = await AsignacionTipoTutoriaServices.listarTutoresPorTipoTutoria({
                userId,
                idTipoDeTutoria,
                page,
                pageSize,
                sortBy,
                sortOrder,
                searchCriterias,
            });
            res.status(200).json({
                message: 'Tutores listados con éxito',
                data: tutores
            });
        } catch (error) {
            console.error("Error al listar los tutores por tipo de tutoría", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async createAsignacionTipoTutoria(req, res) {
        const { fid_usuario, fid_tipoTutoria } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaAsignacionTipoTutoria = await AsignacionTipoTutoriaServices.createAsignacionTipoTutoria({ fid_usuario, fid_tipoTutoria, performedBy });
            res.status(201).json({
                message: 'AsignacionTipoTutoria creada con éxito',
                nuevaAsignacionTipoTutoria
            });
        } catch (error) {
            console.error("Error creando la AsignacionTipoTutoria.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    async listarTiposTutoriaPorTutor(req, res) {
        const userId = req.user.id;
        console.log("id es este de aqui: ", userId);
        const { page = 1 } = req.params;
        const { pageSize = 10, sortBy = 'nombre', sortOrder = 'ASC', searchCriterias = [] } = req.body;
        console.log("body del request: ", req.body);
        
        try {
            const nuevaAsignacionTipoTutoria = await AsignacionTipoTutoriaServices.listarTiposTutoriaPorTutor({ 
                userId, 
                page,
                pageSize, 
                sortBy, 
                sortOrder, 
                searchCriterias
            });
            res.status(201).json({
                message: 'Listado de tipos de tutoria con éxito',
                nuevaAsignacionTipoTutoria
            });
        } catch (error) {
            console.error("Error al listar los tipos de tutoría por tutor", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    async listarTiposTutoriaIndividuales(req, res) {
        const userId = req.user.id;
        console.log("id es este de aqui: ", userId);
        const { page = 1 } = req.params;
        const { pageSize = 10, sortBy = 'fechaCreacion', sortOrder = 'DESC', searchCriterias = [] } = req.body;
        console.log("body del request: ", req.body);
    
        try {
            const data = await AsignacionTipoTutoriaServices.listarTiposTutoriaIndividuales({ 
                userId, 
                page,
                pageSize, 
                sortBy, 
                sortOrder, 
                searchCriterias
            });
            res.status(201).json({
                message: 'Listado de tipos de tutoría opcionales e individuales con éxito',
                data
            });
        } catch (error) {
            console.error("Error al listar los tipos de tutoría opcionales e individuales", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    

    async getAllAsignacionTipoTutorias(req, res) {
        try {
            const asignacionTipoTutorias = await AsignacionTipoTutoriaServices.getAllAsignacionTipoTutorias();
            res.status(200).json(asignacionTipoTutorias);
        } catch (error) {
            console.error("Error obteniendo las AsignacionTipoTutoria.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAsignacionTipoTutoriaById(req, res) {
        const { id } = req.params;
        try {
            const asignacionTipoTutoria = await AsignacionTipoTutoriaServices.getAsignacionTipoTutoriaById(id);
            if (!asignacionTipoTutoria) {
                return res.status(404).json({ error: 'AsignacionTipoTutoria no encontrada' });
            }
            res.status(200).json(asignacionTipoTutoria);
        } catch (error) {
            console.error("Error obteniendo la AsignacionTipoTutoria.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateAsignacionTipoTutoria(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const performedBy = req.user.id;
        try {
            const asignacionTipoTutoriaActualizada = await AsignacionTipoTutoriaServices.updateAsignacionTipoTutoria(id, updateData, performedBy);
            if (!asignacionTipoTutoriaActualizada) {
                return res.status(404).json({ error: 'AsignacionTipoTutoria no encontrada' });
            }
            res.status(200).json({
                message: "AsignacionTipoTutoria actualizada con éxito",
                asignacionTipoTutoriaActualizada
            });
        } catch (error) {
            console.error("Error actualizando la AsignacionTipoTutoria.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalAsignacionTipoTutoria(req, res) {
        const { id } = req.params;
        const performedBy = req.user.id;
        try {
            const result = await AsignacionTipoTutoriaServices.deleteLogicalAsignacionTipoTutoria(id, performedBy);
            if (!result) {
                return res.status(404).json({ error: 'AsignacionTipoTutoria no encontrada' });
            }
            res.status(200).json({
                message: "AsignacionTipoTutoria eliminada con éxito",
                result
            });
        } catch (error) {
            console.error("Error eliminando la AsignacionTipoTutoria.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async eliminarAsignacionTipoTutoria(req, res) {
        const { id_usuario, id_tutoringType } = req.body;
        const performedBy = req.user.id;

        if (!id_usuario || !id_tutoringType) {
            return res.status(400).json({
                message: "Debe proporcionar el id del usuario y el id del tipo de tutoría",
                data: []
            });
        }

        try {
            const result = await AsignacionTipoTutoriaServices.eliminarAsignacionTipoTutoria(id_usuario, id_tutoringType, performedBy);
            res.status(200).json({
                message: "Asignación de tipo de tutoría eliminada con éxito",
                result
            });
        } catch (error) {
            console.error('Error al eliminar asignación de tipo de tutoría:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
};

module.exports = AsignacionTipoTutoriaController;
