const db = require('../models');
const UsuarioService = require('../services/UsuarioService')
const AsignacionTipoTutoria = db.AsignacionTipoTutoria;
const Usuario = db.Usuario;
const TipoTutoria = db.TipoTutoria;
const TipoObligatoriedad = db.TipoObligatoriedad;
const TipoPermanencia = db.TipoPermanencia;
const TipoTutor = db.TipoTutor;
const TipoFormato = db.TipoFormato;
const Rol = db.Rol;
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const AlumnoSesionCita = db.AlumnoSesionCita;
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const EstadoSolicitudTutorFijo = db.EstadoSolicitudTutorFijo;
const EstadoCita = db.EstadoCita;
const SesionCita = db.SesionCita;
const sequelize = db.sequelize;
const { Sequelize, Op, where } = require('sequelize');
const AsignacionTipoTutoriaServices = {

    // Método para asignar tipo de tutoría a un tutor
    async asignarTipoTutoria(codigoUsuario , nombreTipoTutoria, performedBy) {
        const usuario = await Usuario.findOne({
            where: { codigo: codigoUsuario  },
            include: {
                model: Rol,
                as: 'Roles',
                where: { nombre: 'Tutor' },
                through: { attributes: [] }
            }
        });

        if (!usuario) {
            throw new Error('El usuario no es un Tutor');
        }
        //console.log("Me ejecuto aqui:");
        const tipoTutoria = await TipoTutoria.findOne({            
            where: { nombre: nombreTipoTutoria}
        });
        //console.log(tipoTutoria);
        if (!tipoTutoria) {
            throw new Error('Tipo de Tutoría no encontrado');
        }

        // Verificar si la asignación ya existe
        const asignacionExistente = await AsignacionTipoTutoria.findOne({
            where: {
                fid_usuario: usuario.id_usuario,
                fid_tipoTutoria: tipoTutoria.id_tipoTutoria
            }
        });

        if (asignacionExistente) {
            throw new Error('El tutor ya tiene asignada esta tipo de tutoría');
        }

        await AsignacionTipoTutoria.create({
            fid_usuario: usuario.id_usuario,
            fid_tipoTutoria: tipoTutoria.id_tipoTutoria,
            esActivo: true
        }, { performedBy, individualHooks: true});

        return { message: 'Tipo de Tutoría asignada correctamente al Tutor' };
    },

    async listarAlumnosPorTipoTutoria({ userId,idTipoDeTutoria, page, pageSize, sortBy, sortOrder, searchCriterias = [] }) {
        const limit = parseInt(pageSize);
        console.log("limite es: ", limit);
        console.log("id tipo tutr: ", idTipoDeTutoria);
        const offset = (page - 1) * limit;
        //LISTA ALUMNOS QUE YA TIENEN TUTOR 
        // Condiciones iniciales para la búsqueda
        let whereConditions = {
            fid_tipoTutoria: idTipoDeTutoria,
            //fid_tutor : userId, Se quiere listar todos los alumnos del tipo de tutoria
            esActivo: true, // Asegurando que la asignación esté activa
            esTutor: false  // Asegura que solo se consideren asignaciones a alumnos
        };
    
        let otherWhereConditions = {
            esActivo: true,
        };
        // Aplicación de criterios de búsqueda adicionales
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                otherWhereConditions[term.field] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });
    
        // Primera consulta: contar los alumnos
        const totalAlumnos = await AsignacionTipoTutoria.count({
            include: [{
                model: Usuario,
                as: 'Tutor',
                where: otherWhereConditions,
                include: [{
                    model: Rol,
                    as: 'Roles',
                    where: { nombre: 'Alumno' },
                    attributes: []
                }]
            }],
            where: {
                ...whereConditions
            }
        });
    
        // Consulta a la base de datos
        const alumnos = await AsignacionTipoTutoria.findAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            include: [{
                model: Usuario,
                as: 'Tutor',
                where: otherWhereConditions,
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo', 'imagen'],
                include: [{
                    model: Rol,
                    as: 'Roles',
                    where: { nombre: 'Alumno' },
                    attributes: []
                }]
            }],
            where: {
                ...whereConditions
            }
        });

        // ORDENAR ALUMNOS POR NOMBRE ASCENDENTE
        alumnos.sort((a, b) => {
            if (a.Tutor.nombres < b.Tutor.nombres) {
                return -1;
            }
            if (a.Tutor.nombres > b.Tutor.nombres) {
                return 1;
            }
            return 0;
        });

    
        console.log("pasa aqui ");
        console.log("alumnos: ", alumnos);
    
        // Preparación de la respuesta
        return {
            totalPages: Math.ceil(totalAlumnos / limit),
            currentPage: parseInt(page),
            totalAlumnos: totalAlumnos,
            alumnos: alumnos.map(alumno => ({
                idAlumno: alumno.Tutor.id_usuario,
                nombres: alumno.Tutor.nombres,
                primerApellido: alumno.Tutor.primerApellido,
                segundoApellido: alumno.Tutor.segundoApellido,
                email: alumno.Tutor.email,
                codigo: alumno.Tutor.codigo,
                avatar: alumno.Tutor.imagen
            }))
        };
    },
    async listarAlumnosPorTipoTutoriaTodos({userId, idTipoDeTutoria, page, pageSize, sortBy, sortOrder, searchCriterias = [] }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        // Condiciones iniciales para la búsqueda en la nueva tabla
        let whereConditions = {
            fid_tipoTutoria: idTipoDeTutoria,
            esTutor: 0,
            esActivo: true, // Asegurando que la asignación esté activa
        };
    
        let otherWhereConditions = {
            esActivo: true,
        };
        // Aplicación de criterios de búsqueda adicionales
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                otherWhereConditions[term.field] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });
    
        // Primera consulta: contar los alumnos asociados con el tipo de tutoría
        const totalAlumnos = await AsignacionTipoTutoria.count({
            include: [{
                model: Usuario,
                as: 'Alumno',
                where: otherWhereConditions,
                include: [{
                    model: Rol,
                    as: 'Roles',
                    where: { nombre: 'Alumno' },
                    attributes: []
                }]
            }],
            where: whereConditions
        });
    
        // Consulta a la base de datos para recuperar los alumnos
        const alumnos = await AsignacionTipoTutoria.findAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            include: [{
                model: Usuario,
                as: 'Alumno',
                where: otherWhereConditions,
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo', 'imagen'],
                include: [{
                    model: Rol,
                    as: 'Roles',
                    where: { nombre: 'Alumno' },
                    attributes: []
                }]
            }],
            where: whereConditions
        });
    
        // Preparación de la respuesta
        return {
            totalPages: Math.ceil(totalAlumnos / limit),
            currentPage: parseInt(page),
            totalAlumnos: totalAlumnos,
            alumnos: alumnos.map(alumno => ({
                idAlumno: alumno.Alumno.id_usuario,
                nombres: alumno.Alumno.nombres,
                primerApellido: alumno.Alumno.primerApellido,
                segundoApellido: alumno.Alumno.segundoApellido,
                email: alumno.Alumno.email,
                codigo: alumno.Alumno.codigo,
                avatar: alumno.Alumno.imagen
            }))
        };
    },
    
    async  listarTutoresPorTipoTutoria({ userId, idTipoDeTutoria, page, pageSize, sortBy, sortOrder, searchCriterias = [] }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        console.log("id tipo tutoria: ", idTipoDeTutoria);
        console.log("id usuario: ", userId);
        console.log("page: ", page);
    
        // Obtener el valor de fid_tipoTutor de la tabla TipoTutoria
        const tipoTutoria = await TipoTutoria.findOne({
            where: { id_tipoTutoria: idTipoDeTutoria },
            attributes: ['fid_tipoTutor']
        });
    
        const fidTipoTutor = tipoTutoria.fid_tipoTutor;
    
        let whereConditions = {
            esActivo: true,
        };

        let otherWhereConditions = {
            esActivo: true,
        };
    
        // Aplicación de criterios de búsqueda adicionales
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                otherWhereConditions[term.field] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });
    
        if (fidTipoTutor === 1) {
            // Condiciones específicas para AsignacionTipoTutoria cuando fid_tipoTutor es 1
            whereConditions.fid_tipoTutoria = idTipoDeTutoria;
            whereConditions.esTutor = true;
    
            const totalTutores = await AsignacionTipoTutoria.count({
                where: whereConditions
            });
    
            const tutores = await AsignacionTipoTutoria.findAll({
                limit: limit,
                offset: offset,
                order: [[sortBy, sortOrder]],
                where: whereConditions,
                include: [{
                    model: Usuario,
                    as: 'Tutor',
                    attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo', 'imagen'],
                    where: otherWhereConditions,
                }, {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre']
                }]
            });
    
            return {
                totalPages: Math.ceil(totalTutores / limit),
                currentPage: parseInt(page),
                totalTutores: totalTutores,
                tutores: tutores.map(tutor => ({
                    idTutor: tutor.Tutor.id_usuario,
                    esActivo: tutor.esActivo,
                    tipoTutoria: tutor.TipoTutoria.nombre,
                    nombres: tutor.Tutor.nombres,
                    primerApellido: tutor.Tutor.primerApellido,
                    segundoApellido: tutor.Tutor.segundoApellido,
                    email: tutor.Tutor.email,
                    codigo: tutor.Tutor.codigo,
                    avatar: tutor.Tutor.imagen
                }))
            };
        } else {
            // Condiciones para la tabla AsignacionTutorAlumno
            whereConditions.fid_alumno = userId;
            whereConditions.fid_tipoTutoria = idTipoDeTutoria;
    
            const totalTutores = await AsignacionTutorAlumno.count({
                include: [{
                    model: Usuario,
                    as: 'Tutor',
                    where: otherWhereConditions,
                    include: [{
                        model: Rol,
                        as: 'Roles',
                        where: { nombre: 'Tutor' },
                        attributes: []
                    }]
                }, {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre'],
                    where: { id_tipoTutoria: idTipoDeTutoria }
                }],
                where: whereConditions
            });
    
            const tutores = await AsignacionTutorAlumno.findAll({
                limit: limit,
                offset: offset,
                order: [[sortBy, sortOrder]],
                include: [{
                    model: Usuario,
                    as: 'Tutor',
                    where: otherWhereConditions,
                    attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo', 'imagen'],
                    include: [{
                        model: Rol,
                        as: 'Roles',
                        where: { nombre: 'Tutor' },
                        attributes: []
                    }]
                }, {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre'],
                    where: { id_tipoTutoria: idTipoDeTutoria }
                }],
                where: whereConditions
            });
    
            return {
                totalPages: Math.ceil(totalTutores / limit),
                currentPage: parseInt(page),
                totalTutores: totalTutores,
                tutores: tutores.map(tutor => ({
                    idTutor: tutor.Tutor.id_usuario,
                    esActivo: tutor.Tutor.es_activo,
                    tipoTutoria: tutor.TipoTutoria.nombre,
                    nombres: tutor.Tutor.nombres,
                    primerApellido: tutor.Tutor.primerApellido,
                    segundoApellido: tutor.Tutor.segundoApellido,
                    email: tutor.Tutor.email,
                    codigo: tutor.Tutor.codigo,
                    avatar: tutor.Tutor.imagen
                }))
            };
        }
    },
    
    

    async listUsersByTutoriaPaginated(fid_tipoTutoria, page, pageSize, sortBy, sortOrder) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        // Primero, contar el número de usuarios únicos
        const uniqueCountResult = await sequelize.query(
            `SELECT COUNT(DISTINCT Tutor.id_usuario) as count
            FROM AsignacionTipoTutoria
            LEFT JOIN Usuario AS Tutor ON AsignacionTipoTutoria.fid_usuario = Tutor.id_usuario
            WHERE AsignacionTipoTutoria.fid_tipoTutoria = :fid_tipoTutoria AND AsignacionTipoTutoria.esActivo = true`,
            {
                replacements: { fid_tipoTutoria },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const uniqueCount = uniqueCountResult[0].count;


        const usuarios = await AsignacionTipoTutoria.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            where: { fid_tipoTutoria, esActivo: true },
            include: [{
                model: Usuario,
                as: 'Tutor',
                attributes: ['id_usuario', 'nombres', 'codigo', 'primerApellido', 'segundoApellido', 'email'],
                include: [{
                    model: Rol,
                    as: 'Roles',
                    attributes: ['nombre']
                }]
            }]
        });
    
        const usuariosFormatted = usuarios.rows
        .map(row => {
            const tutor = row.Tutor;
            return {
            id: tutor.id_usuario,
            nombres: tutor.nombres,
            codigo: tutor.codigo,
            primerApellido: tutor.primerApellido,
            segundoApellido: tutor.segundoApellido,
            email: tutor.email,
            roles: tutor.Roles.map(role => role.nombre) // Mapear los nombres de los roles
            };
        })
    
        return {
            totalPages: Math.ceil(uniqueCount / limit),
            currentPage: parseInt(page),
            totalUsuarios: uniqueCount,
            usuarios: usuariosFormatted
        };
    },


    async createAsignacionTipoTutoria({ fid_usuario, fid_tipoTutoria, performedBy}) {
        return await AsignacionTipoTutoria.create({ fid_usuario, fid_tipoTutoria, esActivo: true }, { performedBy, individualHooks: true });
    },

    async getAllAsignacionTipoTutorias() {
        return await AsignacionTipoTutoria.findAll();
    },

    async getAsignacionTipoTutoriaById(id) {
        return await AsignacionTipoTutoria.findByPk(id);
    },

    async updateAsignacionTipoTutoria(id, updateData, performedBy) {
        const asignacionTipoTutoria = await AsignacionTipoTutoria.findByPk(id);
        if (!asignacionTipoTutoria) {
            return null;
        }
        await asignacionTipoTutoria.update(updateData, {performedBy, individualHooks: true});
        return asignacionTipoTutoria;
    },

    async deleteLogicalAsignacionTipoTutoria(id, performedBy) {
        const asignacionTipoTutoria = await AsignacionTipoTutoria.findByPk(id);
        if (!asignacionTipoTutoria) {
            return null;
        }
        await asignacionTipoTutoria.update({ esActivo: false }, {performedBy, individualHooks: true});
        return asignacionTipoTutoria;
    },
    async listarTiposTutoriaPorTutor({ userId, page, pageSize, sortBy, sortOrder, searchCriterias = [] }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        // Condiciones iniciales para la búsqueda
        let whereConditions = {
            fid_usuario: userId,
            esActivo: 1  // Asegurando que la asignación esté activa
        };
    
        // Aplicación de criterios de búsqueda adicionales
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                whereConditions[`$TipoTutoria.${term.field}$`] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });
    
        // Consulta a la base de datos
        const tiposTutoria = await AsignacionTipoTutoria.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sequelize.col(`TipoTutoria.${sortBy}`), sortOrder]], // Ordenamiento basado en los atributos de TipoTutoria
            include: [{
                model: TipoTutoria,  // Incluyendo el modelo de TipoTutoria
                as: 'TipoTutoria',
                attributes: ['id_tipoTutoria', 'nombre','fid_tipoObligatoriedad','fid_tipoPermanencia','fid_tipoTutor','fid_tipoFormato'],  // Ajusta los atributos según los necesarios
                where: {
                    fid_tipoTutor: {
                        [Op.or]: [2, null]
                    }
                },
                include: [
                    { // Incluyendo el modelo de TipoObligatoriedad
                        model: TipoObligatoriedad,
                        as: 'TipoObligatoriedad',
                        attributes: ['nombre']  // Asumiendo que 'nombre' es el atributo que quieres recuperar
                    },
                    { // Incluyendo el modelo de TipoPermanencia
                        model: TipoPermanencia,
                        as: 'TipoPermanencia',
                        attributes: ['nombre']
                    },
                    { // Incluyendo el modelo de TipoTutor
                        model: TipoTutor,
                        as: 'TipoTutor',
                        attributes: ['nombre']
                    },
                    { // Incluyendo el modelo de TipoFormato
                        model: TipoFormato,
                        as: 'TipoFormato',
                        attributes: ['nombre']
                    }
                ]
            }],
            attributes: ['id_asignacionTipoTutoria', 'fechaCreacion', 'fechaActualizacion'],
            where: whereConditions
        });
        console.log(tiposTutoria);
        // Preparación de la respuesta
        return {
            totalPages: Math.ceil(tiposTutoria.count / limit),
            currentPage: parseInt(page),
            totalTiposTutoria: tiposTutoria.count,
            tiposTutoria: tiposTutoria.rows.map(tipoTut => ({
                idTipoTutoria: tipoTut.TipoTutoria.id_tipoTutoria,
                nombre: tipoTut.TipoTutoria.nombre,
                obligatoriedad: tipoTut.TipoTutoria.TipoObligatoriedad ? tipoTut.TipoTutoria.TipoObligatoriedad.nombre : null,
                permanencia: tipoTut.TipoTutoria.TipoPermanencia ? tipoTut.TipoTutoria.TipoPermanencia.nombre : null,
                tipoTutor: tipoTut.TipoTutoria.TipoTutor ? tipoTut.TipoTutoria.TipoTutor.nombre : null,
                formato: tipoTut.TipoTutoria.TipoFormato ? tipoTut.TipoTutoria.TipoFormato.nombre : null
            }))
        };
    },

    async listarTiposTutoriaIndividuales({ userId, page, pageSize, sortBy, sortOrder, searchCriterias = [] }) {
        console.log("tutor id: ", userId);
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        // Condiciones iniciales para la búsqueda
        let whereConditions = {
            fid_usuario: userId,
            esActivo: true,  // Asegurando que la asignación esté activa
            '$TipoTutoria.fid_tipoFormato$': 1, // Asumiendo que 1 es el id de 'Individual'
            esTutor: false
        };
    
        // Aplicación de criterios de búsqueda adicionales
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                whereConditions[`$TipoTutoria.${term.field}$`] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });
    
        // Consulta a la base de datos
        const tiposTutoria = await AsignacionTipoTutoria.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sequelize.col(`TipoTutoria.${sortBy}`), sortOrder]], // Ordenamiento basado en los atributos de TipoTutoria
            include: [{
                model: TipoTutoria,  // Incluyendo el modelo de TipoTutoria
                as: 'TipoTutoria',
                where: {esActivo: true},
                attributes: ['id_tipoTutoria', 'nombre','fid_tipoObligatoriedad','fid_tipoPermanencia','fid_tipoTutor','fid_tipoFormato'],  // Ajusta los atributos según los necesarios
                include: [
                    { // Incluyendo el modelo de TipoObligatoriedad
                        model: TipoObligatoriedad,
                        as: 'TipoObligatoriedad',
                        attributes: ['nombre']  // Asumiendo que 'nombre' es el atributo que quieres recuperar
                    },
                    { // Incluyendo el modelo de TipoPermanencia
                        model: TipoPermanencia,
                        as: 'TipoPermanencia',
                        attributes: ['nombre']
                    },
                    { // Incluyendo el modelo de TipoTutor
                        model: TipoTutor,
                        as: 'TipoTutor',
                        attributes: ['nombre']
                    },
                    { // Incluyendo el modelo de TipoFormato
                        model: TipoFormato,
                        as: 'TipoFormato',
                        attributes: ['nombre']
                    }
                ]
            }],
            attributes: ['id_asignacionTipoTutoria', 'fechaCreacion', 'fechaActualizacion'],
            where: whereConditions
        });
    
        // Preparación de la respuesta
        return {
            totalPages: Math.ceil(tiposTutoria.count / limit),
            currentPage: parseInt(page),
            totalTiposTutoria: tiposTutoria.count,
            tiposTutoria: tiposTutoria.rows.map(tipoTut => ({
                idTipoTutoria: tipoTut.TipoTutoria.id_tipoTutoria,
                nombre: tipoTut.TipoTutoria.nombre,
                obligatoriedad: tipoTut.TipoTutoria.TipoObligatoriedad ? tipoTut.TipoTutoria.TipoObligatoriedad.nombre : null,
                permanencia: tipoTut.TipoTutoria.TipoPermanencia ? tipoTut.TipoTutoria.TipoPermanencia.nombre : null,
                tipoTutor: tipoTut.TipoTutoria.TipoTutor ? tipoTut.TipoTutoria.TipoTutor.nombre : null,
                formato: tipoTut.TipoTutoria.TipoFormato ? tipoTut.TipoTutoria.TipoFormato.nombre : null
            }))
        };
    },
    
    async eliminarAsignacionTipoTutoria(id_usuario, id_tutoringType, performedBy) {
        try {
            const asignacion = await AsignacionTipoTutoria.findOne({
                where: {
                    fid_usuario: id_usuario,
                    fid_tipoTutoria: id_tutoringType,
                    esActivo: true
                }
            });

            if (!asignacion) {
                throw new Error('Asignación de tipo de tutoría no encontrada');
            }

            await asignacion.update({ esActivo: false }, { performedBy, individualHooks: true });
            
            if(asignacion.esTutor === false){
                // Eliminar Solicitudes Pendientes
                await SolicitudTutorFijo.update(
                    {
                      esActivo: false // Actualizar a inactivo
                    },
                    {
                      where: {
                        fid_alumno: id_usuario,
                        esActivo: true,
                        fid_estadoSolicitud: 1
                      },
                        performedBy,
                        individualHooks: true
                    }
                );

                // Eliminar Citas Pendientes Programadas
                await SesionCita.update(
                    {
                      fid_estado_cita: 3, // Estado cancelado
                      motivoRechazo: 'Desasignación de tutor'
                    },
                    {
                      where: {
                        esActivo: true,
                        fechaHoraInicio: { [Sequelize.Op.gt]: new Date() },
                        fid_tipoTutoria: id_tutoringType
                      },
                      include: [
                        {
                          model: Usuario,
                          as: 'Alumnos',
                          where: { id_usuario: id_usuario },
                          through: {
                            model: AlumnoSesionCita,
                            attributes: []
                          },
                          required: true
                        },
                        {
                          model: EstadoCita,
                          as: 'EstadoCita',
                          where: { nombre: 'Programado' },
                          required: true
                        },
                      ],
                        performedBy,
                        individualHooks: true
                    }
                );

                const asignacionTutorAlumno = await AsignacionTutorAlumno.findAll({
                    where: {
                        fid_alumno: id_usuario,
                        fid_tipoTutoria: id_tutoringType,
                        esActivo: true
                    },
                })

                for (const asignacion of asignacionTutorAlumno) {
                    await UsuarioService.desasignarAlumnoTutor(id_usuario, asignacion.fid_tutor, id_tutoringType, performedBy)
                }

            } else {

                await SolicitudTutorFijo.update(
                    {
                      esActivo: false // Actualizar a inactivo
                    },
                    {
                      where: {
                        fid_tutor: id_usuario,
                        esActivo: true,
                        fid_estadoSolicitud: 1
                      },
                      performedBy,
                      individualHooks: true
                    }
                );
                
                const asignacionTutorAlumno = await AsignacionTutorAlumno.findAll({
                    where: {
                        fid_tutor: id_usuario,
                        fid_tipoTutoria: id_tutoringType,
                        esActivo: true
                    },
                })

                for (const asignacion of asignacionTutorAlumno) {
                    await UsuarioService.desasignarAlumnoTutor(asignacion.fid_alumno, id_usuario, id_tutoringType, performedBy)
                }
            }

            return { message: 'Asignación de tipo de tutoría eliminada con éxito' };
        } catch (error) {
            throw new Error('Error al eliminar asignación de tipo de tutoría: ' + error.message);
        }
    },
    
};

module.exports = AsignacionTipoTutoriaServices;
