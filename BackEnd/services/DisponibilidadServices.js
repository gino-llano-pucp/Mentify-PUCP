const db = require('../models');
const Disponibilidad = db.Disponibilidad;
const moment = require('moment-timezone');

const DisponibilidadServices = {
    async createOrUpdateDisponibilidad({ id, fid_tutor, fechaHoraInicio, fechaHoraFin, performedBy }) {
        /* console.log("fecha hora ini: ", fechaHoraInicio);
        console.log("fecha hora fin: ", fechaHoraFin); */
        console.log("fid del tutor dentro del servicio", fid_tutor);
        // Convertir las fechas a UTC
        const fechaHoraInicioUTC = moment.tz(fechaHoraInicio, 'America/Lima').utc().format();
        const fechaHoraFinUTC = moment.tz(fechaHoraFin, 'America/Lima').utc().format();
        
        // Verificar si la disponibilidad existe
        const existingDisponibilidad = await Disponibilidad.findOne({ where: { id_disponibilidad: id, fid_tutor: fid_tutor } });

        if (existingDisponibilidad) {
             // Actualizar disponibilidad existente
            await Disponibilidad.update({
                fechaHoraInicio: fechaHoraInicioUTC,
                fechaHoraFin: fechaHoraFinUTC
            }, {
                where: { id_disponibilidad: id },
                performedBy,
                individualHooks: true
            });

            // Devolver la disponibilidad actualizada
            return await Disponibilidad.findOne({ where: { id_disponibilidad: id } });
        }

        // Crear nueva disponibilidad si no existe
        const nuevaDisponibilidad = await Disponibilidad.create({
            fid_tutor: fid_tutor,
            fechaHoraInicio: fechaHoraInicioUTC,
            fechaHoraFin: fechaHoraFinUTC,
            esActivo: true
        }, { performedBy, individualHooks: true});

        // Devolver la nueva disponibilidad creada
        return nuevaDisponibilidad;
    },

    async deleteDisponibilidades(ids, performedBy) {
        return await Disponibilidad.destroy({ // es disponibilidad, no una entidad mas "fuerte" destruirlo nomas
          where: { id_disponibilidad: ids },
            performedBy,
            individualHooks: true
        });
    },

    async getDisponibilidadesByTutor (fid_tutor) {
        return await Disponibilidad.findAll({
          where: { fid_tutor, esActivo: true }
        });
    },

    async getAll(){
        return await Disponibilidad.findAll();
    },

    async getById(id){
        return await Disponibilidad.findByPk(id);
    },

    async update(id, updateData, performedBy){
        const disponibilidad = await Disponibilidad.findByPk(id);
        if (!disponibilidad) {
            return null;
        }
        await disponibilidad.update(updateData, { performedBy, individualHooks: true });
        return disponibilidad;
    },

    async deleteLogical(id, performedBy){
        const disponibilidad = await Disponibilidad.findByPk(id);
        if (!disponibilidad) {
            return null;
        }
        await disponibilidad.update({ esActivo: false }, { performedBy, individualHooks: true });
        return disponibilidad;
    },

    async obtenerDisponibilidadTutor(idTutor) {
        const disponiblidades = await Disponibilidad.findAll({
            where: {
                fid_tutor: idTutor
            },
            attributes: ['id_disponibilidad', 'fechaHoraInicio', 'fechaHoraFin']
        })
        if(!disponiblidades) {
            return null;
        }
        return disponiblidades
    }
};

module.exports = DisponibilidadServices;
