const db = require('../models');
const EstadoSolicitudTutorFijo = db.EstadoSolicitudTutorFijo;

const EstadoSolicitudTutorFijoServices = {
    async createEstadoSolicitudTutorFijo({ nombre, descripcion }) {
        return await EstadoSolicitudTutorFijo.create({ nombre, descripcion, esActivo: true });
    },

    async getAllEstadoSolicitudTutorFijos() {
        return await EstadoSolicitudTutorFijo.findAll();
    },

    async getEstadoSolicitudTutorFijoById(id) {
        return await EstadoSolicitudTutorFijo.findByPk(id);
    },

    async updateEstadoSolicitudTutorFijo(id, updateData) {
        const estadoSolicitudTutorFijo = await EstadoSolicitudTutorFijo.findByPk(id);
        if (!estadoSolicitudTutorFijo) {
            return null;
        }
        await estadoSolicitudTutorFijo.update(updateData);
        return estadoSolicitudTutorFijo;
    },

    async deleteLogicalEstadoSolicitudTutorFijo(id) {
        const estadoSolicitudTutorFijo = await EstadoSolicitudTutorFijo.findByPk(id);
        if (!estadoSolicitudTutorFijo) {
            return null;
        }
        await estadoSolicitudTutorFijo.update({ esActivo: false });
        return estadoSolicitudTutorFijo;
    }
};

module.exports = EstadoSolicitudTutorFijoServices;
