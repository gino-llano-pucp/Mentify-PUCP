const db = require('../models');
const Derivacion = db.Derivacion;

const DerivacionService = {
    async listarDerivaciones(idTutor, page, pageSize, sortBy, sortOrder) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        const result = await Derivacion.findAndCountAll({
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            where: { es_activo: true, fid_tutor: idTutor },
            include: [
                { model: db.Usuario, as: 'Tutor', attributes: ['nombres', 'primerApellido', 'email'] },
                { model: db.Usuario, as: 'Alumno', attributes: ['nombres', 'primerApellido', 'email'] },
                { model: db.UnidadAcademica, as: 'UnidadAcademica', attributes: ['nombre'] }
            ]
        });

        return {
            totalPages: Math.ceil(result.count / limit),
            currentPage: parseInt(page),
            totalDerivaciones: result.count,
            derivaciones: result.rows
        };
    },

    async editarDerivacion(id, updateData, performedBy) {
        const derivacion = await Derivacion.findByPk(id);
        if (!derivacion) {
            return null;
        }
        await derivacion.update(updateData, { performedBy, individualHooks: true });
        return derivacion;
    }
};

module.exports = DerivacionService;
