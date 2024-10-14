const DerivacionService = require('../services/DerivacionServices');
const db = require('../models');
const logError = require('../utils/loggingErrors');
const Derivacion = db.Derivacion;
const Usuario = db.Usuario;
const UnidadAcademica = db.UnidadAcademica;
const TipoTutoria = db.TipoTutoria;
const SesionCita = db.SesionCita;

const DerivacionController = {
    async listarDerivaciones(req, res) {
        const { idTutor, page = 1, pageSize = 10, sortBy = 'fecha_derivacion', sortOrder = 'DESC' } = req.body;
        try {
            const result = await DerivacionService.listarDerivaciones(idTutor, page, pageSize, sortBy, sortOrder);
            res.status(200).json({
                message: "Derivaciones listadas con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar derivaciones:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async editarDerivacion(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const performedBy = req.user.id;
        try {
            const derivacionActualizada = await DerivacionService.editarDerivacion(id, updateData, performedBy);
            if (!derivacionActualizada) {
                return res.status(404).json({ error: 'Derivación no encontrada' });
            }
            res.status(200).json({
                message: "Derivación actualizada con éxito",
                data: derivacionActualizada
            });
        } catch (error) {
            console.error('Error al actualizar derivación:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async registrarDerivacion(req, res) {
        const { fid_tutor, fid_alumno, fid_unidad_academica, fid_tipoTutoria, observaciones, motivo, antecedentes, comentarios } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaDerivacion = await Derivacion.create({
                fid_tutor,
                fid_alumno,
                fid_unidad_academica,
                fid_tipoTutoria,
                observaciones,
                motivo,
                antecedentes,
                comentarios,
                esActivo: true,
                fechaCreacion: new Date()
            }, { performedBy, individualHooks: true });

            res.status(201).json({
                message: 'Derivación registrada con éxito',
                derivacion: nuevaDerivacion
            });
        } catch (error) {
            console.error('Error registrando la derivación:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async listarDerivacionesPorTutor(req, res) {
        const { idTutor } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'fecha_actualizado', sortOrder = 'DESC' } = req.body;
        
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        try {
            const derivaciones = await Derivacion.findAndCountAll({
                where: { fid_tutor: idTutor, esActivo: true },
                limit: limit,
                offset: offset,
                order: [[sortBy, sortOrder]],
                include: [
                    {
                        model: Usuario,
                        as: 'Alumno',
                        attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo']
                    },
                    {
                        model: UnidadAcademica,
                        as: 'UnidadAcademica',
                        attributes: ['nombre']
                    },
                    {
                        model: TipoTutoria,
                        as: 'TipoTutoria',
                        attributes: ['nombre']
                    }
                ]
            });

            const formattedDerivaciones = derivaciones.rows.map(derivacion => ({
                idDerivacion: derivacion.id_derivacion,
                nombreAlumno: `${derivacion.Alumno.nombres} ${derivacion.Alumno.primerApellido} ${derivacion.Alumno.segundoApellido}`,
                emailAlumno: derivacion.Alumno.email,
                codigoAlumno: derivacion.Alumno.codigo,
                unidadAcademica: derivacion.UnidadAcademica.nombre,
                tipoTutoria: derivacion.TipoTutoria.nombre,
                observaciones: derivacion.observaciones,
                motivo: derivacion.motivo,
                antecedentes: derivacion.antecedentes,
                comentarios: derivacion.comentarios,
                fechaCreacion: derivacion.fechaCreacion,
                fechaActualizado: derivacion.fecha_actualizado
            }));

            res.status(200).json({
                totalPages: Math.ceil(derivaciones.count / limit),
                currentPage: parseInt(page),
                totalDerivaciones: derivaciones.count,
                derivaciones: formattedDerivaciones
            });
        } catch (error) {
            console.error('Error listando derivaciones:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = DerivacionController;
