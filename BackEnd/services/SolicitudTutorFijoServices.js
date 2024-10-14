const db = require('../models');
const { Sequelize, Op, where } = require('sequelize');
const AsignacionTutorAlumnoServices = require('./AsignacionTutorAlumnoServices');
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const Usuario = db.Usuario;
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const EstadoSolicitudTutorFijo = db.EstadoSolicitudTutorFijo;
const TipoTutoria = db.TipoTutoria;
const Programa = db.Programa;
const Facultad = db.Facultad;
const UsuarioService = require('../services/UsuarioService')

const SolicitudTutorFijoServices = {
    async createSolicitudTutorFijo({ fid_alumno, fid_tutor, fid_tipoTutoria, es_rechazado, motivo_rechazo, fid_estadoSolicitud, fecha_cierre, performedBy}) {
        return await SolicitudTutorFijo.create({ fid_alumno, fid_tutor, fid_tipoTutoria, es_rechazado, 
            motivo_rechazo, fid_estadoSolicitud, fecha_cierre, esActivo: true }, { performedBy, individualHooks: true });
    },

    async getAllSolicitudTutorFijos() {
        return await SolicitudTutorFijo.findAll();
    },

    async getSolicitudTutorFijoById(id) {
        return await SolicitudTutorFijo.findByPk(id);
    },

    async updateSolicitudTutorFijo(id, updateData) {
        const solicitudTutorFijo = await SolicitudTutorFijo.findByPk(id);
        if (!solicitudTutorFijo) {
            return null;
        }
        await solicitudTutorFijo.update(updateData);
        return solicitudTutorFijo;
    },

    async deleteLogicalSolicitudTutorFijo(id) {
        const solicitudTutorFijo = await SolicitudTutorFijo.findByPk(id);
        if (!solicitudTutorFijo) {
            return null;
        }
        await solicitudTutorFijo.update({ esRechazado: true, fid_estadoSolicitud: 3 , esActivo: false});
        return solicitudTutorFijo;
    },

    async getSolicitudesPaginadoPorCoordinador(inputSearch, tipoTutoria, estadoSolicitud, fechaDesde, fechaHasta, page, pageSize, sortBy, sortOrder) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        let whereConditions = {esActivo: true};
        let alumnoWhereConditions = {};
        let tipoTutoriaWhereConditions = {};
        let estadoSoliWhereConditions = {};

        const fechaHastaMasUno = new Date(fechaHasta);
        fechaHastaMasUno.setDate(fechaHastaMasUno.getDate() + 1);
    
        // Convertir tipoTutoria a un array si es un solo id
        const tipoTutoriaArray = Array.isArray(tipoTutoria) ? tipoTutoria : [tipoTutoria];
    
        if (inputSearch) {
            alumnoWhereConditions = {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
                        [Op.like]: `%${inputSearch}%`
                      }),
                ],
            };
        }
        if (tipoTutoriaArray.length === 0){
            return null;
        }
          if (tipoTutoriaArray.length > 0) {
            tipoTutoriaWhereConditions = {
              id_tipoTutoria: { [Op.in]: tipoTutoriaArray },
            };
          }
    
        if (estadoSolicitud && estadoSolicitud !== 'Todos') {
            estadoSoliWhereConditions = { nombre: estadoSolicitud };
        }
    
        if (fechaDesde && fechaHasta) {
            whereConditions.fechaCreacion = {
                [Op.between]: [new Date(fechaDesde), fechaHastaMasUno]
            };
        }
    
        const solicitudes = await SolicitudTutorFijo.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            where: whereConditions,
            include: [
                {
                    model: Usuario,
                    as: 'Alumno',
                    attributes: ['id_usuario', 'nombres', 'primerApellido', 'email', 'codigo', 'fid_programa', 'fid_facultad'],
                    where: alumnoWhereConditions
                },
                {
                    model: Usuario,
                    as: 'Tutor',
                    attributes: ['id_usuario', 'nombres', 'primerApellido', 'email', 'codigo', 'fid_programa', 'fid_facultad']
                },
                {
                    model: EstadoSolicitudTutorFijo,
                    as: 'EstadoSolicitud',
                    attributes: ['nombre'],
                    where: estadoSoliWhereConditions
                },
                {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['id_tipoTutoria', 'nombre'],
                    where: tipoTutoriaWhereConditions
                }
            ]
        });
    
        const solicitudesWithCount = await Promise.all(solicitudes.rows.map(async (solicitud) => {
            const tutorCount = await AsignacionTutorAlumno.count({
                where: {
                    fid_tutor: solicitud.Tutor.id_usuario,
                    fid_tipoTutoria: solicitud.TipoTutoria.id_tipoTutoria,
                    esActivo: true
                }
            });

            // Buscar el nombre del programa según fid_programa
            const programa = await Programa.findByPk(solicitud.Alumno.fid_programa);
            const nombrePrograma = programa ? programa.nombre : null;

            const facultad = await Facultad.findByPk(solicitud.Alumno.fid_facultad);
            const nombreFacultad = facultad ? facultad.nombre : null;

            // Agregar id de la solicitud y motivo de rechazo (suponiendo que motivoRechazo es un campo en SolicitudTutorFijo)
            return {
                idSolicitud: solicitud.id_solicitud,
                Alumno: {
                    idAlumno: solicitud.Alumno.id_usuario,
                    codigo: solicitud.Alumno.codigo,
                    nombres: solicitud.Alumno.nombres,
                    primerApellido: solicitud.Alumno.primerApellido,
                    email: solicitud.Alumno.email,
                    nombrePrograma: nombrePrograma,
                    nombreFacultad: nombreFacultad
                },
                Tutor: {
                    idTutor: solicitud.Tutor.id_usuario,
                    codigo: solicitud.Tutor.codigo,
                    nombres: solicitud.Tutor.nombres,
                    primerApellido: solicitud.Tutor.primerApellido,
                    email: solicitud.Tutor.email,
                    cantAlumnos: tutorCount
                },
                TipoTutoria: {
                    idTipoTutoria: solicitud.TipoTutoria.id_tipoTutoria,
                    nombre: solicitud.TipoTutoria.nombre
                },
                estadoSolicitud: solicitud.EstadoSolicitud.nombre,
                fechaSolicitud: solicitud.fechaCreacion,
                motivoRechazo: solicitud.motivoRechazo || null // Suponiendo que el campo existe
            };
        }));
    
        return {
            totalPages: Math.ceil(solicitudes.count / limit),
            currentPage: parseInt(page),
            totalSolicitudes: solicitudes.count,
            solicitudes: solicitudesWithCount
        };
    },
    
    async respondToSolicitudTutorFijo(solicitudId, tipoTutoriaId, tutorId, aceptada, motivoRechazo, performedBy) {
        solicitudId = parseInt(solicitudId);
        tutorId = parseInt(tutorId);

        if (isNaN(solicitudId) || isNaN(tutorId)) {
            throw new Error('Los identificadores de solicitud y tutor deben ser números enteros válidos.');
        }

        const solicitud = await SolicitudTutorFijo.findByPk(solicitudId);

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        if (solicitud.fid_tutor !== tutorId) {
            throw new Error('El tutor no coincide con la solicitud');
        }
        const alumno = await Usuario.findByPk(solicitud.fid_alumno);
        const tutor = await Usuario.findByPk(tutorId);
        if (aceptada) {
            // Crear la asignación automática del alumno si el tutor acepta
            
            const asignacion = await AsignacionTutorAlumnoServices.asignarTipoTutoriaAAlumno(
                alumno.codigo, tutor.codigo, tipoTutoriaId, solicitudId, performedBy
            );

            // Actualizar el estado de la solicitud a 'Aceptada'
            await solicitud.update({
                fid_estadoSolicitud: 2 // Asegúrate de definir esta constante o recuperar el ID correcto de estado
            }, { performedBy, individualHooks: true });
            await UsuarioService.enviarCorreoAceptado(tutorId, alumno.id_usuario, solicitud.fid_tipoTutoria);

            return {
                message: 'Solicitud aceptada y asignación creada',
                asignacion
            };
        } else {
            // Actualizar el estado de la solicitud a 'Rechazada' y registrar el motivo si se rechaza
            await solicitud.update({
                esRechazado: true,
                fid_estadoSolicitud: 3, // Asegúrate de definir esta constante o recuperar el ID correcto de estado
                motivoRechazo: motivoRechazo || null
            }, { performedBy, individualHooks: true });
            await UsuarioService.enviarCorreoRechazo(tutorId, alumno.id_usuario, solicitud.fid_tipoTutoria, 
                motivoRechazo);
            return {
                message: 'Solicitud rechazada',
                motivoRechazo: motivoRechazo || 'No se proporcionó motivo de rechazo'
            };
        }
    }
};

module.exports = SolicitudTutorFijoServices;
