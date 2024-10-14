const router = require('express').Router();
const unidadesAcademicasService = require('./services/unidadesAcademicasService');  // Adjust the path as necessary

router.get('/unidadesAcademicas', async (req, res) => {
    try {
        const unidades = await unidadesAcademicasService.obtenerTodos();
        res.status(200).json(unidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/unidadesAcademicas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const unidad = await unidadesAcademicasService.obtenerPorId(id);
        if (unidad) {
            res.status(200).json(unidad);
        } else {
            res.status(404).json({ message: 'Unidad académica no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/unidadesAcademicas', async (req, res) => {
    try {
        const nuevaUnidad = await unidadesAcademicasService.insertar(req.body);
        res.status(201).json({
            message: 'Unidad académica creada exitosamente',
            data: nuevaUnidad
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/unidadesAcademicas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const unidadActualizada = await unidadesAcademicasService.actualizar(id, req.body);
        if (unidadActualizada) {
            res.status(200).json({
                message: 'Unidad académica actualizada exitosamente',
                data: unidadActualizada
            });
        } else {
            res.status(404).json({ message: 'Unidad académica no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/unidadesAcademicas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const resultado = await unidadesAcademicasService.eliminar(id);
        if (resultado) {
            res.status(200).json({ message: 'Unidad académica desactivada exitosamente' });
        } else {
            res.status(404).json({ message: 'Unidad académica no encontrada para desactivar' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;