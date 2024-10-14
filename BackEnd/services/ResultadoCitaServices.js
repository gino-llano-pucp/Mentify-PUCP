const db = require('../models');
const { ResultadoCita, CompromisoCita, SesionCita, EstadoCompromisoCita, AsistenciaCita, TipoTutoria, sequelize } = db;

const ResultadoCitaServices = {
    async registrarResultadoCita(idSesionCita, idTutor, resultados, compromisos, performedBy) {
        return sequelize.transaction(async (t) => {
            const sesionCita = await SesionCita.findByPk(idSesionCita, {
                include: [{
                    model: ResultadoCita,
                    as: 'Resultado'
                }, {
                    model: TipoTutoria,
                    as: 'TipoTutoria'
                }]
            });

            if (!sesionCita) {
                throw new Error('Sesión de cita no encontrada');
            }

            if (sesionCita.fid_tutor !== idTutor) {
                throw new Error('El tutor no tiene permiso para registrar resultados en esta sesión de cita');
            }

            // Determinar si la sesión es individual o grupal
            const esIndividual = sesionCita.TipoTutoria.fid_tipoFormato === 1;

            const asistencias = resultados.asistencia; // Suponiendo que esto es un array de objetos con { fid_alumno, asistio }

            // Verificar y actualizar o crear asistencias
            await Promise.all(asistencias.map(async asistencia => {
                const asistenciaExistente = await AsistenciaCita.findOne({
                    where: {
                        fid_sesionCita: idSesionCita,
                        fid_alumno: asistencia.fid_alumno
                    },
                    transaction: t
                });

                if (asistenciaExistente) {
                    return asistenciaExistente.update({
                        asistio: asistencia.asistio
                    }, { transaction: t , performedBy, individualHooks: true});
                } else {
                    return AsistenciaCita.create({
                        fid_sesionCita: idSesionCita,
                        fid_alumno: asistencia.fid_alumno,
                        asistio: asistencia.asistio
                    }, { transaction: t , performedBy, individualHooks: true});
                }
            }));

            // El resto del código permanece igual
            const nuevoResultado = await ResultadoCita.create({
                fid_sesionCita: idSesionCita,
                asistencia: true,
                es_derivado: resultados.es_derivado,
                detalleResultado: resultados.detalleResultado,
                es_activo: true
            }, { transaction: t, performedBy, individualHooks: true});

            await Promise.all(compromisos.map(async compromiso => {
                const estadoCompromiso = await EstadoCompromisoCita.findOne({
                    where: { nombre: compromiso.tipo },
                    transaction: t
                });

                if (!estadoCompromiso) {
                    throw new Error(`Estado de compromiso '${compromiso.tipo}' no encontrado`);
                }

                const compromisoExistente = await CompromisoCita.findOne({
                    where: {
                        nombre: compromiso.descripcion,
                        fid_sesionCita: idSesionCita
                    },
                    attributes: ['id_compromiso', 'nombre', 'fid_estado_compromiso'],
                    transaction: t
                });

                if (compromisoExistente) {
                    return compromisoExistente.update({
                        fid_estado_compromiso: estadoCompromiso.id_estado_compromiso,
                        es_activo: true
                    }, { transaction: t , performedBy, individualHooks: true});
                } else {
                    return CompromisoCita.create({
                        nombre: compromiso.descripcion,
                        es_activo: true,
                        fid_estado_compromiso: estadoCompromiso.id_estado_compromiso,
                        fid_sesionCita: idSesionCita
                    }, { transaction: t, performedBy, individualHooks: true});
                }
            }));

            await sesionCita.update({
                fid_resultado: nuevoResultado.id_resultado,
                fid_estado_cita: 2 // Estado completado
            }, { transaction: t, performedBy, individualHooks: true});

            return {
                sesionCitaActualizada: sesionCita,
                resultadoCita: nuevoResultado,
                compromisosCreados: compromisos
            };
        });
    },
};


module.exports = ResultadoCitaServices;
