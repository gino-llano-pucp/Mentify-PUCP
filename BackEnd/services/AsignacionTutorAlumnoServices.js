const { Sequelize, Op, where, or } = require('sequelize');
const db = require('../models');
const { asignarTipoTutoria } = require('./AsignacionTipoTutoriaServices');
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const Rol = db.Rol;
const Usuario = db.Usuario;
const TipoTutoria = db.TipoTutoria;
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const AsignacionTipoTutoria = db.AsignacionTipoTutoria;
const Programa = db.Programa;
const Facultad = db.Facultad;
const UsuarioService = require('../services/UsuarioService');

const AsignacionTutorAlumnoServices = {
    // Método para asignar tipo de tutoría a un alumno
    async asignarTipoTutoriaAAlumno(codigoAlumno, codigoTutor, tipoTutoriaId, id_solicitud, performedBy) {
        const alumno = await Usuario.findOne({
            where: { codigo: codigoAlumno },
            include: {
                model: Rol,
                as: 'Roles',
                where: { nombre: 'Alumno' },
                through: { attributes: [] }
            }
        });

        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }

        const tutor = await Usuario.findOne({
            where: { codigo: codigoTutor },
            include: {
                model: Rol,
                as: 'Roles',
                where: { nombre: 'Tutor' },
                through: { attributes: [] }
            }
        });

        if (!tutor) {
            throw new Error('Tutor no encontrado');
        }

        const tipoTutoria = await TipoTutoria.findOne({
            where: { id_tipoTutoria: tipoTutoriaId }
        });

        if (!tipoTutoria) {
            throw new Error('Tipo de Tutoría no encontrado');
        }

        // Verificar si la solicitud existe y está asociada con el alumno
        const solicitud = await SolicitudTutorFijo.findOne({
            where: {
                id_solicitud: id_solicitud,
                fid_alumno: alumno.id_usuario,
                esRechazado: false
            }
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada o no está asociada con el alumno o a sido rechazado');
        }
        
        const asignacionExistente = await AsignacionTutorAlumno.findOne({
            where: {
                fid_alumno: alumno.id_usuario,
                fid_tutor: tutor.id_usuario,
                fid_tipoTutoria: tipoTutoria.id_tipoTutoria,
            },
            //transaction
        });

        if (asignacionExistente) {
            // Si existe, actualizar esActivo a true
            await asignacionExistente.update({ fid_solicitud: solicitud.id_solicitud, esActivo: true }, { performedBy, individualHooks: true});
        } else {
            // Si no existe, crear una nueva asignación
            await UsuarioService.enviarCorreoTutorAlumnoAsignado(tutor.id_usuario, alumno.id_usuario, tipoTutoria.id_tipoTutoria);  // Envío de correo

            await AsignacionTutorAlumno.create({
                fid_alumno: alumno.id_usuario,
                fid_tutor: tutor.id_usuario,
                fid_tipoTutoria: tipoTutoria.id_tipoTutoria,
                fid_solicitud: solicitud.id_solicitud,
                esActivo: true
            }, { performedBy, individualHooks: true });
        } 

        return { message: 'Tipo de Tutoría asignada correctamente al Alumno' };
    },


    async createAsignacionTutorAlumno({ fid_alumno, fid_tutor, fid_tipoTutoria, fid_solicitud, performedBy }) {
        if (typeof fid_solicitud === 'undefined') {
            fid_solicitud = null;
        }

        //const transaction = await db.sequelize.transaction();
        try {
            // Buscar si ya existe la combinación de fid_alumno, fid_tutor, y fid_tipoTutoria
            const asignacionExistente = await AsignacionTutorAlumno.findOne({
                where: {
                    fid_alumno,
                    fid_tutor,
                    fid_tipoTutoria
                },
                //transaction
            });

            if (asignacionExistente) {
                // Si existe, actualizar esActivo a true
                await asignacionExistente.update({ fid_solicitud, esActivo: true }, { performedBy, individualHooks: true })
            } else {
                // Si no existe, crear una nueva asignación
                await UsuarioService.enviarCorreoTutorAlumnoAsignado(fid_tutor, fid_alumno, fid_tipoTutoria);  // Envío de correo

                await AsignacionTutorAlumno.create({ fid_alumno, fid_tutor, fid_tipoTutoria, fid_solicitud, esActivo: true }, 
                    { performedBy, individualHooks: true });
            }

            // Actualizar solicitudes de tutor fijo a inactivo
            await SolicitudTutorFijo.update(
                { esActivo: false },
                {
                    where: {
                        fid_alumno,
                        fid_tipoTutoria,
                        fid_estadoSolicitud: 1 // Pendiente, En espera
                    },
                    //transaction
                    performedBy,
                    individualHooks: true
                }
            );

            //await transaction.commit();
            return asignacionExistente;
        } catch (error) {
            //await transaction.rollback();
            throw new Error('Error al crear la AsignacionTutorAlumno: ' + error.message);
        }
    },


    async getAllAsignacionTutorAlumnos() {
        return await AsignacionTutorAlumno.findAll();
    },

    async getAsignacionTutorAlumnoById(id) {
        return await AsignacionTutorAlumno.findByPk(id);
    },

    async updateAsignacionTutorAlumno(id, updateData, performedBy) {
        const asignacionTutorAlumno = await AsignacionTutorAlumno.findByPk(id);
        if (!asignacionTutorAlumno) {
            return null;
        }
        await asignacionTutorAlumno.update(updateData, { performedBy, individualHooks: true });
        return asignacionTutorAlumno;
    },

    async deleteLogicalAsignacionTutorAlumno(id, performedBy) {
        const asignacionTutorAlumno = await AsignacionTutorAlumno.findByPk(id);
        if (!asignacionTutorAlumno) {
            return null;
        }
        await asignacionTutorAlumno.update({ esActivo: false }, { performedBy, individualHooks: true });
        return asignacionTutorAlumno;
    },

    async assignMultipleStudentsToTutoria(alumnos, fid_tutor, fid_tipoTutoria, fid_solicitud, performedBy) {
        const nuevasAsignaciones = await Promise.all(
            alumnos.map(fid_alumno => 
                AsignacionTutorAlumno.create({ fid_alumno, fid_tutor, fid_tipoTutoria, fid_solicitud, esActivo: true },
                    { performedBy, individualHooks: true }
                )
            )
        );
        return nuevasAsignaciones;
    },

    async listUsersByTutoriaPaginated(fid_tipoTutoria, page, pageSize, sortBy, sortOrder) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        const usuarios = await AsignacionTutorAlumno.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            where: { fid_tipoTutoria, esActivo: true },
            include: [{
                model: Usuario,
                as: 'Alumno',
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email']
            }]
        });

        return {
            totalPages: Math.ceil(usuarios.count / limit),
            currentPage: parseInt(page),
            totalUsuarios: usuarios.count,
            usuarios: usuarios.rows
        };
    },
    
    async asignarAlumnosMasivoTipoTutoria(idTipoTutoria, alumnos, performedBy) {
        const usuarios = []
        for(let i = 0; i < alumnos.length; i++){
            console.log(alumnos[i])
            const alumno = await Usuario.findOne({
                where: {
                    codigo: alumnos[i].codigo
                }
            });
            if(!alumno){
                continue;
            }
            const asignacionTipoTutoria = await AsignacionTipoTutoria.findOne({
                where: {
                    fid_tipoTutoria: idTipoTutoria
                }
            });
            if(!asignacionTipoTutoria){
                console.log("sin asignacion tipo tutoria");
                continue;
            }
            const usuario = {
                fid_alumno: alumno.id_usuario,
                fid_tipoTutoria: idTipoTutoria,
                fid_tutor: asignacionTipoTutoria.fid_tutor,
                esActivo: 1
            };
            console.log(usuario)
            usuarios.push(usuario);
        }
        console.log(usuarios)
        const resultado = await AsignacionTutorAlumno.bulkCreate(usuarios, { performedBy, individualHooks: true });
        return resultado;
    },

    async buscarGrupoDeAlumnosPorCodigo(usuarios) {
        const codigos = [];
        for(let i = 0; i < usuarios.length; i++)
            codigos.push(usuarios[i].codigo)
        const usuariosEncontrados = await Usuario.findAll({
            where: {
                codigo: codigos
            }
        });

        //armar mi lista de los codigos de los usuarios encontrados
        const codigosUsuariosEncontrados = usuariosEncontrados.map(usuario => usuario.codigo);

        //lo convierto a enteros porque de la bd salen como strings
        const codigosUsuariosEncontradosInt = codigosUsuariosEncontrados.map(str => parseInt(str, 10))

        //filtro los que encontre de los que no
        const codigosUsuariosNoEncontrados = codigos.filter(codigo => !codigosUsuariosEncontradosInt.includes(codigo));
        return {
            usuariosEncontrados,
            codigosUsuariosNoEncontrados
        }
    },
    async listarAlumnosPorTutor(idTipoTutoria, idTutor, inputSearch, page, pageSize) {
        const limit = parseInt(pageSize) || 9;
        const offset = (page - 1) * limit;

        let searchConditions = {esActivo: true};

        if (inputSearch) {
            searchConditions = {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')),
                        { [Op.like]: `%${inputSearch}%` }
                    ),
                    { codigo: { [Op.like]: `%${inputSearch}%` } },
                    { email: { [Op.like]: `%${inputSearch}%` } }
                ]
            };
        }

        const alumnos = await AsignacionTutorAlumno.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                fid_tutor: idTutor,
                fid_tipoTutoria: idTipoTutoria,
                esActivo: true
            },
            include: [
                {
                    model: Usuario,
                    as: 'Alumno',
                    attributes: ['id_usuario', 'nombres', 'primerApellido', 'email', 'codigo', 'fid_programa' ],
                    where: searchConditions,
                    include: [
                        {
                            model: Programa,
                            as: 'Programa',
                            attributes: ['nombre'],
                            required: false
                        },
                        {
                            model: Facultad,
                            as: 'Facultad',
                            attributes: ['nombre']
                        }
                    ]
                }
            ],
            order: [
                [{ model: Usuario, as: 'Alumno' }, 'nombres', 'ASC']
            ]
        });

        const alumnosWithPrograma = alumnos.rows.map(asignacion => ({
            id_alumno: asignacion.Alumno.id_usuario,
            nombres: asignacion.Alumno.nombres,
            primerApellido: asignacion.Alumno.primerApellido,
            codigo: asignacion.Alumno.codigo,
            programa: asignacion.Alumno.Programa ? asignacion.Alumno.Programa.nombre : null,
            facultad: asignacion.Alumno.Facultad.nombre,
            email: asignacion.Alumno.email,
            esSolicitado: asignacion.fid_solicitud ? "Solicitado" : "Asignado"
        }));

        console.log(alumnosWithPrograma);

        return {
            totalPages: Math.ceil(alumnos.count / limit),
            currentPage: parseInt(page),
            totalAlumnos: alumnos.count,
            alumnos: alumnosWithPrograma
        };
    },
    async listTutoresPorTipoTutoriaYAlumnoPaginado(fid_alumno, fid_tipoTutoria, page, pageSize, sortBy, sortOrder, searchCriterias=[]) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        // Construir condiciones de búsqueda basadas en searchCriterias
        let whereConditions = {};
    
        searchCriterias.forEach(criteria => {
            whereConditions[criteria.field] = {
                [Op.like]: `%${criteria.value}%`
            };
        });
    
        // Buscar las asignaciones activas con paginación y filtros
        const result = await AsignacionTutorAlumno.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            where: {
                fid_tipoTutoria,
                esActivo: true
            },
            include: [{
                model: Usuario,
                as: 'Tutor',
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo'],
                where: whereConditions 
            }]
        });
    
        // Map the result to return only relevant tutor data
        const tutores = result.rows.map(asignacion => ({
            id_tutor: asignacion.Tutor.id_usuario,
            nombres: asignacion.Tutor.nombres,
            primerApellido: asignacion.Tutor.primerApellido,
            segundoApellido: asignacion.Tutor.segundoApellido,
            email: asignacion.Tutor.email,
            codigo: asignacion.Tutor.codigo
        }));
    
        return {
            totalPages: Math.ceil(result.count / limit),
            currentPage: parseInt(page),
            totalTutores: result.count,
            tutores: tutores
        };
    },
    
    async listarTiposTutoriaAsignados(idAlumno, idTutor) {
        const asignaciones = await AsignacionTutorAlumno.findAll({
          where: {
            fid_alumno: idAlumno,
            fid_tutor: idTutor,
            esActivo: true
          },
          include: [{
            model: TipoTutoria,
            as: 'TipoTutoria',
            attributes: ['id_tipoTutoria', 'nombre'],
            where: { esActivo: true }
          }]
        });
    
        return asignaciones.map(asignacion => ({
          id: asignacion.TipoTutoria.id_tipoTutoria,
          nombreTutoria: asignacion.TipoTutoria.nombre
        }));
    }
    
};

module.exports = AsignacionTutorAlumnoServices;
