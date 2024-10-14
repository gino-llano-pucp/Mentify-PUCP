const router = require('express').Router();
const tipoSolicitudService = require('./services/tipoSolicitudService'); 

router.get('/tipoSolicitud', async (req, res) => {
    try {
        const tipos = await tipoSolicitudService.obtenerTodos();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/tipoSolicitud/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tipo = await tipoSolicitudService.obtenerPorId(id);
        if (tipo) {
            res.status(200).json(tipo);
        } else {
            res.status(404).json({ message: 'Tipo de solicitud no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/tipoSolicitud', async (req, res) => {
    try {
        const nuevaTipo = await tipoSolicitudService.insertar(req.body);
        res.status(201).json({
            message: 'Tipo de solicitud creado exitosamente',
            data: nuevaTipo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/tipoSolicitud/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const tipoActualizado = await tipoSolicitudService.actualizar(id, req.body);
        if (tipoActualizado) {
            res.status(200).json({
                message: 'Tipo de solicitud actualizado exitosamente',
                data: tipoActualizado
            });
        } else {
            res.status(404).json({ message: 'Tipo de solicitud no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/tipoSolicitud/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const resultado = await tipoSolicitudService.eliminar(id);
        if (resultado) {
            res.status(200).json({ message: 'Tipo de solicitud desactivado exitosamente' });
        } else {
            res.status(404).json({ message: 'Tipo de solicitud no encontrado para desactivar' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
