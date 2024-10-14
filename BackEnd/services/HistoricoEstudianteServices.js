const db = require('../models');
const HistoricoEstudiante = db.HistoricoEstudiante;

const HistoricoEstudianteServices = {
    async insert(data, performedBy){
        return await HistoricoEstudiante.create(data, { performedBy, individualHooks: true });
    },

    async getAll(){
        return await HistoricoEstudiante.findAll();
    },

    async getById(id){
        return await HistoricoEstudiante.findByPk(id);
    },

    async update(id, updateData, performedBy){
        const historico = await HistoricoEstudiante.findByPk(id);
        if (!historico) {
            return null;
        }
        await historico.update(updateData, { performedBy, individualHooks: true });
        return historico;
    },

    async deleteLogical(id, performedBy){
        const historico = await HistoricoEstudiante.findByPk(id);
        if (!historico) {
            return null;
        }
        await historico.update({ esActivo: false }, { performedBy, individualHooks: true });
        return historico;
    },

    async getByAlumno(idAlumno){
        return await HistoricoEstudiante.findOne({ where: { fid_alumno: idAlumno } });
    },
};

module.exports = HistoricoEstudianteServices;
