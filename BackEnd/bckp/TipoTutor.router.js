const router = require('express').Router();

const TipoTutor = require('../models/TipoTutorModel')

router.get('/tipotutor', (req, res) =>{
    res.send("estoy en tipos de tutor");
});

router.post('/tipoTutor', async(req, res) =>{    
    const { nombre, descripcion, es_activo } = req.body;
    try {
        await TipoTutor.sync();
        const createEstadoCompromiso = await TipoTutor.create({
            nombre,
            descripcion,
            es_activo,
        });
    
        res.status(201).json({
            ok: true,
            status: 1,
            message: "Tipo Tutor creado",
            data: createTipoTutor, // Opcional: devolver los datos creados
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al crear el Tipo Tutor",
            error: error.message, // Nunca en producción, solo para depuración
        });
    }
});

router.put('/tipoTutor', (req, res) =>{
    res.send("i am app router version PUT");
});

router.delete('/tipoTutor', (req, res) =>{
    res.send("i am app router version DELETE");
});


module.exports = router;

