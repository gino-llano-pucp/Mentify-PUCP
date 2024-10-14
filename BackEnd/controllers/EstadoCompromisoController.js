const EstadoCompromisoService = require('../services/EstadoCompromisoServices')

const EstadoCompromisoController = {
    async crearEstadoCompromiso(req, res){
        const estadoCompromisoData = req.body; 
        try{
            const nuevoEstadodoCompromiso = await EstadoCompromisoService.insertar(estadoCompromisoData);
            res.status(201).json({
                message: "Estado compromiso creado",
                nuevoEstadodoCompromiso
            });
        }catch(err){
            console.error("Error al insertar estado compromiso", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async obtenerTodos(req, res){
        try{
            const tipos = await EstadoCompromisoService.obtenerTodos();
            res.status(200).json({
                message: "Se obtuvieron los datos con exito",
                tipos
            });
        }catch(err){
            console.error("Error al obtener tipos de compromisos", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async obtenerPorId(req, res){
        const tipoId = req.params.id;
        try{
            const tipo = await EstadoCompromisoService.obtenerPorId(tipoId);
            if(!tipo){
                return res.status(404).json({ error: 'Tipo no econtrado' });
            }
            res.status(200).json({
                message: "Se obtuvo el tipo solicitado con exito",
                tipo
            });
        }catch(err){
            console.error('Error obteniendo tipo:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async actualizar(req, res){
        const tipoId = req.params.id;
        const tipoData = req.body;
        try{
            const actualizarTipo = await EstadoCompromisoService.actualizar(tipoId, tipoData);
            if(!actualizarTipo){
                return res.status(404).json({ error: 'Tipo no econtrado' });
            }
            res.status(200).json({
                message: "Actualizado con exito",
                actualizarTipo
            });
        }catch(err){
            console.error('Error actualizando tipo:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async eliminar(req, res){
        const tipoId = req.params.id;
        try{
            const actualizarTipo = await EstadoCompromisoService.eliminar(tipoId);
            if(!actualizarTipo){
                return res.status(404).json({ error: 'Tipo no econtrado' });
            }
            res.status(200).json({
                message: "Eliminado con exito",
                actualizarTipo
            });
        }catch(err){
            console.error('Error eliminando tipo:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = EstadoCompromisoController;