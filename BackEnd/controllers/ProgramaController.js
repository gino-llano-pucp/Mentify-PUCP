const ProgramaServices = require('../services/ProgramaServices')
const logError = require('../utils/loggingErrors');

const ProgramaController = {
    async crearPrograma(req, res){
        const ProgramaData = req.body; 
        const performedBy = req.user.id;
        try{
            const nuevoPrograma = await ProgramaServices.insertar(ProgramaData, performedBy);
            res.status(201).json({
                message: "Programa creado",
                nuevoPrograma
            });
        }catch(err){
            console.error("Error al insertar Programa", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async obtenerTodos(req, res){
        try{
            const tipos = await ProgramaServices.obtenerTodos();
            res.status(200).json({
                message: "Se obtuvieron los datos con exito",
                tipos
            });
        }catch(err){
            console.error("Error al obtener datos del Programa", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async obtenerPorId(req, res){
        const tipoId = req.params.id;
        try{
            const tipo = await ProgramaServices.obtenerPorId(tipoId);
            if(!tipo){
                return res.status(404).json({ error: 'Programa no econtrado' });
            }
            res.status(200).json({
                message: "Se obtuvo el Programa solicitado con exito",
                tipo
            });
        }catch(err){
            console.error('Error obteniendo Programa:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async actualizar(req, res){
        const programaId = req.params.id;
        const programaData = req.body;
        const performedBy = req.user.id;
        try{
            const actualizarPrograma = await ProgramaServices.actualizar(programaId, programaData, performedBy);
            if(!actualizarPrograma){
                return res.status(404).json({ error: 'Programa  no econtrado' });
            }
            res.status(200).json({
                message: "Actualizado con exito",
                actualizarPrograma
            });
        }catch(err){
            console.error('Error actualizando Programa:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async eliminar(req, res){
        const programaData    = req.body;
        const performedBy = req.user.id;
        try{
            const eliminarPrograma = await ProgramaServices.eliminar(programaData, performedBy);
            if (!eliminarPrograma){
                return res.status(404).json({ error: 'Programa no econtrado' });
            }
            eliminarPrograma.esActivo = 0;
            res.status(200).json({
                message: "Eliminado con exito",
                eliminarPrograma
            });
        }catch(err){
            console.error('Error eliminando Programa:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: err.message} });
        }
    },
    async activar(req, res){
        const programaData    = req.body;
        const performedBy = req.user.id;
        try{
            const activarPrograma = await ProgramaServices.activar(programaData, performedBy);
            if (!activarPrograma){
                return res.status(404).json({ error: 'Programa no econtrado' });
            }
            activarPrograma.esActivo = 0;
            res.status(200).json({
                message: "Eliminado con exito",
                activarPrograma
            });
        }catch(err){
            console.error('Error eliminando Programa:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async agregarOAsignarCoordinador(req, res) {
        try {
            const data = req.body;
            const performedBy = req.user.id;
            //const { id, code, name, apellidos, email, isSelectedFromSearch, facultadNombre } = req.body;
            const resultado = await ProgramaServices.agregarOAsignarCoordinador(data, performedBy);
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
            sortBy = 'nombre',
            sortOrder = 'DESC',
            id_facultad,
            searchCriterias = []  // Asumimos que esto se pasa como un arreglo de objetos con 'field' y 'value'
        } = req.body;
    
        try {
            const result = await ProgramaServices.listarPorPaginacion(page, pageSize, sortBy, sortOrder, id_facultad, searchCriterias);
            res.status(200).json({
                message: "Programas listados con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar programas:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async editar(req, res) {
        try {
            const data = req.body;
            const performedBy = req.user.id;
            const resultado = await ProgramaServices.editarPrograma(data, performedBy);
            return res.status(200).json(resultado);
        } catch (error) {
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            return res.status(500).json({ error: error.message });
        }
    },
    async listarProgramasPorUsuario(req, res) {
        try {
          const { idUsuario } = req.body;
          const programas = await ProgramaServices.listarProgramasPorUsuario(idUsuario);
          res.status(200).json(programas);
        } catch (error) {
            console.error('Error al listar programas por usuario:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({ error: error.message });
        }
    },
    async obtenerProgramaCoordinador(req, res) {
        try {
            const { idCoord } = req.body;
            const programa = await ProgramaServices.obtenerProgramaCoordinador(
              idCoord
            );
            res.status(200).json(programa);
        } catch (error) {
            console.error('Error al obtener programa coordinador:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProgramaController;
