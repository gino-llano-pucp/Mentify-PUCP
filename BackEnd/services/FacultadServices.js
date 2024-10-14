
const db = require('../models/')
const sequelize = db.sequelize;
const Facultad = db.Facultad;
const Programa = db.Programa;
const Usuario = db.Usuario;
const Rol = db.Rol;
const RolesUsuario = db.Roles_Usuario;
const { Sequelize, Op, where } = require('sequelize');
const UsuarioService = require('../services/UsuarioService');
const RolesUsuarioService = require('./RolesUsuarioServices');
const ProgramaService = require('./ProgramaServices');
const { at } = require('lodash');
const { es } = require('date-fns/locale');
const EncuestaMaestra = db.EncuestaMaestra;
const FacultadServices = {
    async insertar(facultadData, performedBy) {
        try {
            const [facultad, created] = await Facultad.findOrCreate({
                where: {
                    nombre: facultadData.nombre,
                    fid_usuario: facultadData.fid_usuario
                },
                defaults: {
                    nombre: facultadData.nombre,
                    fid_usuario: facultadData.fid_usuario,
                    esActivo: true
                },
                performedBy,
                individualHooks: true
            });
    
            if (!created) {
                throw new Error('La facultad ya existe en la base de datos.');
            }
    
            return facultad;
        } catch (error) {
            throw error;
        }
    },
    
    async obtenerTodos(){
        // ! NO MODEIFICAR ESTO PORQUE SE ESTA USANDO EN EL DROPDOWN DE FACULTADES
        const facultades = await Facultad.findAll({
            attributes: {
                include: [
                    'id_facultad',
                    'nombre',
                ]
            },
            where: {
                'esActivo': 1
            },
            order: [
                ['nombre', 'ASC']
            ]
        });

        // Transformar datos para ajustar la estructura deseada
        const result = facultades.map(facultad => ({
            id_facultad: facultad.id_facultad,
            nombre: facultad.nombre,
        }));

        return result;
    },
    async obtenerPorId(id){
        return await Facultad.findByPk(id);
    },
    async actualizar(id, datosActualizados, performedBy){
        const facultad = await Facultad.findByPk(id);
        if(!facultad){
            return { message: 'Facultad not found' };
        }
        await facultad.update({
            nombre: datosActualizados.nombre,
            fid_usuario: datosActualizados.fid_usuario,
            esActivo: datosActualizados.esActivo
        },
        {
           where: {
            id_facultad: id
           },
           performedBy,
           individualHooks: true
        });
        return facultad;
    },
    async eliminar(reqBody, performedBy) {
        const t = await sequelize.transaction();
        const { id, nombre } = reqBody;
    
        try {
            let facultad;
            if (id) {
                facultad = await Facultad.findByPk(id, { transaction: t });
            } else if (nombre) {
                facultad = await Facultad.findOne({ where: { nombre: nombre }, transaction: t });
            }
    
            if (!facultad) {
                throw new Error('Error: La facultad no existe.');
            }
    
            if (!facultad.esActivo) {
                throw new Error('Error: La facultad ya está desactivada.');
            }
    
            const usuariosAlumnos = await Usuario.findAll({
                where: {
                    fid_facultad: facultad.id_facultad,
                },
                include: [
                    {
                        model: Rol,
                        as: "Roles",
                        attributes: ["nombre", "es_activo", "id_rol"],
                        where: {
                            [Op.or]: [
                                { nombre: "Alumno" },
                                { nombre: "Responsable de Bienestar" }
                            ],
                            es_activo: true
                        },
                        through: { attributes: [] }
                    }
                ],
                transaction: t
            });

            // Buscar usuariosAlumnos en RolesUsuario para ver si están activos con id_rol 4 o 7
            const usuariosAlumnosIds = usuariosAlumnos.map(usuario => usuario.id_usuario);

            // Buscar usuariosAlumnos en RolesUsuario para ver si están activos con id_rol 4 o 7
            const usuariosAlumnosRoles = await RolesUsuario.findAll({
                where: {
                    id_usuario: {
                        [Op.in]: usuariosAlumnosIds
                    },
                    id_rol: {
                        [Op.in]: [4, 7]
                    },
                    es_activo: true
                },
                attributes: ['id_usuario'],
                transaction: t
            });
            
            console.log("usuariosAlumnosRoles:");
            // formateo para ver contenido de usuariosAlumnosRoles
            console.log(usuariosAlumnosRoles.map(u => u.id_usuario));
    
            if (usuariosAlumnosRoles.length > 0) {
                throw new Error('No se puede eliminar la facultad porque tiene alumnos activos.');
            }
    
            // Desactiva el rol de 'Coordinador de Facultad' para los usuarios asociados a la facultad que se va a eliminar.
            await RolesUsuario.update({
                es_activo: 0  // Marca el rol como inactivo.
            }, {
                where: {
                    id_rol: 1, // 'Coordinador de Facultad'
                    id_usuario: {
                        [Op.in]: sequelize.literal(`(SELECT id_usuario FROM Usuario WHERE fid_facultad = ${facultad.id_facultad})`)
                    }
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            // Actualiza la tabla Usuario para eliminar la referencia a la facultad.
            await Usuario.update({
                fid_facultad: null,
                fid_programa: null // Elimina la referencia de la facultad en el usuario.
            }, {
                where: {
                    fid_facultad: facultad.id_facultad,
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            // Desactiva la facultad marcándola como no activa.
            await Facultad.update({
                esActivo: 0,
                fid_usuario: null
            }, {
                where: {
                    id_facultad: facultad.id_facultad
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });

            // Buscar programas asociados a la facultad.
            const programas = await Programa.findAll({
                where: {
                    fid_facultad: facultad.id_facultad,
                    esActivo: true
                },
                transaction: t
            });

            // Invocar el método eliminar de ProgramaServices para cada programa.
            for (const programa of programas) {
                const programaReqBody = {
                    id: programa.id_programa,
                    nombre: programa.nombre
                };
                await ProgramaService.eliminar(programaReqBody, performedBy, t);
            }
    
            await t.commit();
            return { message: 'Facultad y sus referencias eliminadas con éxito.' };
        } catch (error) {
            await t.rollback();
            throw new Error(error.message || 'Error al eliminar facultad.');
        }
    },

    async activar(reqBody, performedBy) {
        const t = await sequelize.transaction();
        const { id, nombre } = reqBody;
    
        try {
            let facultad;
            if (id) {
                facultad = await Facultad.findByPk(id, { transaction: t });
            } else if (nombre) {
                facultad = await Facultad.findOne({ where: { nombre: nombre }, transaction: t });
            }
    
            if (!facultad) {
                throw new Error('Error: La facultad no existe.');
            }
    
            if (facultad.esActivo) {
                throw new Error('Error: La facultad ya está activada.');
            }
    
            await Facultad.update({
                esActivo: 1,
            }, {
                where: {
                    id_facultad: facultad.id_facultad
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            await t.commit();
            return { message: 'Facultad activada con éxito.' };
        } catch (error) {
            await t.rollback();
            throw new Error(error.message || 'Error al activar facultad.');
        }
    },
    
    
    async obtenerProgramas(facultadId) {
        //const { id, nombre } = data;

        let filtroFacultad = { esActivo: true };
        if (facultadId) {
            if (isNaN(facultadId)) {  // Comprueba si el ID no es un número
                throw new Error("El ID proporcionado es inválido.");
            }
            filtroFacultad.id_facultad = facultadId;
        } else {
            // No se proporcionó ni id ni nombre
            throw new Error("No se proporcionó ID para buscar los programas.");
        }

        const programas = await Programa.findAll({
            attributes: ['id_programa', 'nombre', 'esActivo'], // Especificar solo los campos necesarios del programa
            include: [
                {
                    model: Facultad,
                    as: 'Facultad',
                    where: filtroFacultad,
                    required: true,
                    attributes: ['id_facultad', 'nombre'] // Solo retorna id y nombre de la facultad
                },
                {
                    model: Usuario,
                    as: 'Encargado',
                    required: false,
                    attributes: ['id_usuario', 'email', 'nombres', 'primerApellido', 'segundoApellido', 'imagen'] // Solo retorna detalles específicos del usuario y excluye fechas, contrasenha, etc.
                }
            ],
            where: {
                esActivo: true
            },
            order: [
                ["nombre", "ASC"]
            ]
        });

        /*if (programas.length === 0) {
            throw new Error("No se encontraron programas para los criterios proporcionados.");
        }*/

        return programas;
    },
    
    async agregarOAsignarCoordinador(data, performedBy) {
        let { id, code, name, primerApellido, segundoApellido, email, isSelectedFromSearch, facultadNombre} = data;
        const transaction = await sequelize.transaction();  // Usa transacciones para manejar operaciones que deben ser atómicas
        try {
            let usuario;

            let aux = code.toString();
            while (aux.length < 8) {
                aux = "0" + aux;
            }
            code = aux;

            // Verificar si el nombre de la facultad ya está registrado
            const existingFacultad = await Facultad.findOne({ where: { nombre: facultadNombre } });
            if (existingFacultad) {
                throw new Error('El nombre de la facultad ya está registrado.');
            }
            // Crear facultad y asignar al coordinador
            const facultad = await Facultad.create({
                nombre: facultadNombre
            }, { transaction, performedBy });
    
            

            if (!isSelectedFromSearch) { // Usuario nuevo (supuestamente)
                // Verificar primero por el ID si está presente
                let existingUser;
                if (id) {
                    existingUser = await Usuario.findByPk(id);
                    if (existingUser) {
                        throw new Error('El usuario ya está registrado.');
                    }
                }

                // Verificar si el código o email ya están en uso
                existingUser = await Usuario.findOne({ where: { [Op.or]: { codigo: code, email: email } } });
                if (existingUser) {
                    throw new Error('El código o email ya están registrados.');
                }

                // Datos del usuario a insertar
                const usuarioData = {
                    nombres: name,
                    primerApellido: primerApellido,
                    segundoApellido: segundoApellido,
                    email: email,
                    //fid_facultad: facultad.id_facultad,
                    codigo: code
                };
                
                usuario = await UsuarioService.insertar(usuarioData, transaction, performedBy);
                
                // Asumiendo que tienes acceso al id del rol de coordinador
                const rolCoordinador = await Rol.findOne({ where: { nombre: 'Coordinador de Facultad' } });
                const rolTutor = await Rol.findOne({ where: { nombre: 'Tutor' } });

                // Verificar que el rol fue encontrado
                if (!rolCoordinador) throw new Error('Rol no encontrado');
                if (!rolTutor) throw new Error('Rol no encontrado');
                // Crear la entrada en la tabla intermedia de forma manual
                //si da tiempo se cambia al servicio
                await sequelize.models.Roles_Usuario.create({
                    id_usuario: usuario.id_usuario,
                    id_rol: rolCoordinador.id_rol,
                    es_activo: 1
                }, { transaction, performedBy, individualHooks: true});
                await sequelize.models.Roles_Usuario.create({
                    id_usuario: usuario.id_usuario,
                    id_rol: rolTutor.id_rol,
                    es_activo: 1
                }, { transaction , performedBy, individualHooks: true});
                
            } else {
                // Buscar usuario existente y verificar rol manualmente
                usuario = await Usuario.findOne({
                    where:{
                        nombres: name,
                        primerApellido: primerApellido,
                        segundoApellido: segundoApellido,
                        email: email
                    },
                      include: [
                    {
                        model: Rol,
                        as: 'Roles',
                    },
                    {
                        model: Facultad,
                        as: 'Facultad',
                    }
                ] });
    
                // Verificar si ya está asociado a una facultad
                if (usuario.Facultad) {
                    throw new Error('El usuario ya está asociado a una facultad.');
                }
    
                // Verificar si ya tiene el rol de coordinador
                if (usuario && !usuario.Roles.some(rol => rol.nombre === 'Coordinador de Facultad')) {
                    const rolCoordinador = await Rol.findOne({ where: { nombre: 'Coordinador de Facultad' } });
                    if (rolCoordinador) {
                        // Crear la entrada en la tabla intermedia de forma manual
                        await sequelize.models.Roles_Usuario.create({
                            id_usuario: usuario.id_usuario,
                            id_rol: rolCoordinador.id_rol,
                            es_activo: 1
                        }, { transaction , performedBy, individualHooks: true});
                        //actualiza el usuario ya existente 
                        /*await usuario.update({
                            fid_facultad: facultad.id_facultad,
                        }, { transaction });*/
                    }
                }    
            }   
            
            await facultad.setEncargado(usuario, { transaction , performedBy, individualHooks: true});    

            await transaction.commit();
            return { message: 'Facultad creada y coordinador asignado con éxito.' };
        } catch (error) {
            await transaction.rollback();
            const errorMessage = error.message || 'Ocurrió un error inesperado al intentar crear la facultad y asignar el coordinador. Por favor, inténtalo de nuevo.';
            throw new Error(errorMessage);
        }
    },
    async editarFacultad(data, performedBy) {
        const { facultadId, facultadNombre, coordinatorData } = data;
        const transaction = await sequelize.transaction();  // Usa transacciones para manejar operaciones que deben ser atómicas
        try {
            // Buscar la facultad existente
            const facultad = await Facultad.findByPk(facultadId);
            if (!facultad) {
                throw new Error('Facultad no encontrada.');
            }
            if (facultadNombre && facultadNombre !== facultad.nombre) {
                const nombreExistente = await Facultad.findOne({
                    where: {
                        nombre: facultadNombre,
                        id_facultad: {
                            [Sequelize.Op.ne]: facultadId  // Excluir la facultad actual de la búsqueda
                        },
                        esActivo: true  // Considerar solo facultades activas
                    },
                    transaction
                });
    
                if (nombreExistente) {
                    throw new Error('Ya existe otra facultad activa con ese nombre.');
                }
    
                // Actualizar el nombre de la facultad si el nuevo nombre es válido
                await facultad.update({ nombre: facultadNombre }, { transaction, performedBy });
            }
            
            if (coordinatorData) {
                const { id, codigo, nombres, primerApellido, segundoApellido, email } = coordinatorData;
    
                // Validar que el código y el email no estén repetidos con otro usuario
                const existingUser = await Usuario.findOne({
                    where: {
                        [Op.or]: [{ codigo }, { email }],
                        id_usuario: { [Op.ne]: id }  // Excluir al usuario actual de la búsqueda
                    },
                    transaction
                });
    
                if (existingUser) {
                    throw new Error('El código o el email del coordinador ya están repetidos con otro usuario.');
                }
    
                // Actualizar el antiguo coordinador
                if (facultad.fid_usuario) {
                    // Marcar al antiguo coordinador como inactivo
                    await sequelize.models.Roles_Usuario.update(
                        { es_activo: 0 },
                        {
                            where: { id_usuario: facultad.fid_usuario, id_rol: 1 },
                            transaction,
                            performedBy,
                            individualHooks: true
                        }
                    );
                }
    
                let usuario;
                if (id) {
                    // Si se proporciona un ID, buscar el usuario existente y actualizarlo
                    usuario = await Usuario.findByPk(id);
                    if (!usuario) throw new Error("Usuario no encontrado.");
                    await usuario.update(
                        { codigo, nombres, primerApellido, segundoApellido, email },
                        { transaction, performedBy, individualHooks: true }
                    );
                } else {
                    // Si no se proporciona un ID, buscar por código o email para ver si ya existe
                    usuario = await Usuario.findOne({
                        where: { [Op.or]: { codigo, email } },
                        transaction,
                    });
                }
    
                if (!usuario) {
                    // Si el usuario no existe, crear uno nuevo y asignar la facultad al nuevo usuario
                    usuario = await UsuarioService.insertar(coordinatorData, transaction, performedBy);
    
                    // Asignar el rol de 'Coordinador de Facultad' al nuevo usuario
                    const rolCoordinador = await Rol.findOne({ where: { nombre: "Coordinador de Facultad" } });
                    if (!rolCoordinador) throw new Error("Rol no encontrado.");
                    const rolTutor = await Rol.findOne({ where: { nombre: "Tutor" } });
                    if (!rolTutor) throw new Error("Rol no encontrado");
    
                    await sequelize.models.Roles_Usuario.create(
                        { id_usuario: usuario.id_usuario, id_rol: rolCoordinador.id_rol, es_activo: 1 },
                        { transaction, performedBy, individualHooks: true }
                    );
                    await sequelize.models.Roles_Usuario.create(
                        { id_usuario: usuario.id_usuario, id_rol: rolTutor.id_rol },
                        { transaction, performedBy, individualHooks: true }
                    );
                } else {
                    // Actualizar datos del usuario existente y verificar si necesita el rol
                    await usuario.update(
                        { nombres, codigo, primerApellido, segundoApellido, email },
                        { transaction, performedBy, individualHooks: true }
                    );
                    await sequelize.models.Roles_Usuario.update(
                        { es_activo: 1 },
                        {
                            where: { id_usuario: usuario.id_usuario, id_rol: 1 },
                            transaction,
                            performedBy,
                            individualHooks: true
                        }
                    );
    
                    // Verificar si el usuario ya tiene el rol 'Coordinador de Facultad'
                    const usuarioRoles = await usuario.getRoles();
                    if (!usuarioRoles.some(rol => rol.nombre === "Coordinador de Facultad")) {
                        const rolCoordinador = await Rol.findOne({ where: { nombre: "Coordinador de Facultad" } });
                        if (rolCoordinador) {
                            await sequelize.models.Roles_Usuario.create(
                                { id_usuario: usuario.id_usuario, id_rol: rolCoordinador.id_rol, es_activo: 1 },
                                { transaction, performedBy, individualHooks: true }
                            );
                        } else {
                            await sequelize.models.Roles_Usuario.update(
                                { es_activo: 1 },
                                {
                                    where: { id_usuario: usuario.id_usuario, id_rol: rolCoordinador.id_rol },
                                    transaction, performedBy, individualHooks: true
                                }
                            );
                        }
                    }
                }
    
                // Actualizar facultad con el nuevo ID del usuario coordinador
                await facultad.update(
                    { fid_usuario: usuario.id_usuario },
                    { transaction, performedBy, individualHooks: true }
                );
            }
    
            // Commit de la transacción
            await transaction.commit();
            return { message: 'Facultad actualizada con éxito.' };
        } catch (error) {
            // Rollback de la transacción en caso de error
            await transaction.rollback();
            throw new Error(error.message || 'Error al actualizar facultad.');
        }
    },
    
    async listarPorPaginacion(page, pageSize, sortBy, sortOrder, searchCriterias = []) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        let whereConditions = {
            //esActivo: 1
        };
    
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                whereConditions[term.field] = {
                    [Op.like]: `%${term.value}%`
                };
            }
        });

        const facultades = await Facultad.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]], 
            include: [{
                model: Usuario,
                as: 'Encargado',
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo']
            }],
            attributes: ['id_facultad', 'nombre', 'siglas', 'esActivo', 'fechaCreacion'],
            where: whereConditions
        });
    
        console.log(facultades);

        return {
            totalPages: Math.ceil(facultades.count / limit),
            currentPage: parseInt(page),
            totalFacultades: facultades.count,
            facultades: facultades.rows.map(fac => {
                return {
                    id: fac.id_facultad,
                    nombre: fac.nombre,
                    siglas: fac.siglas,
                    esActivo: fac.esActivo === 1 ? 'Activo' : 'Inactivo',
                    fechaCreacion: fac.fechaCreacion,
                    Encargado: fac.Encargado ? {
                        id_usuario: fac.Encargado.id_usuario,
                        nombres: fac.Encargado.nombres,
                        primerApellido: fac.Encargado.primerApellido,
                        segundoApellido: fac.Encargado.segundoApellido,
                        email: fac.Encargado.email,
                        codigo: fac.Encargado.codigo
                    } : {
                        id_usuario: '',
                        nombres: '',
                        primerApellido: '',
                        segundoApellido: '',
                        email: '',
                        codigo: ''
                    }
                };
            })
        };
    },
    async obtenerFacultadDeCoordinador(coordinadorId) {
        const facultad = await Facultad.findOne({
            where: {
                fid_usuario: coordinadorId
            }
        });

        const programa = await Programa.findOne({
            where: {
                fid_facultad: facultad.id_facultad
            }
        });

        facultad.setDataValue('TienePrograma', !!programa);

        return facultad;
    }
};

module.exports = FacultadServices;