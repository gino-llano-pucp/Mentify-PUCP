
const db = require('../models/')
const { Sequelize, Op, where } = require('sequelize');
const UsuarioService = require('../services/UsuarioService');
const { es } = require('date-fns/locale');
const sequelize = db.sequelize;
const Programa = db.Programa;
const Facultad = db.Facultad;
const Rol = db.Rol;
const Usuario = db.Usuario;
const RolesUsuario = db.Roles_Usuario;

const ProgramaServices = {
    async insertar(programaData, performedBy) {
        try {
            const [programa, created] = await Programa.findOrCreate({
                where: {
                    nombre: programaData.nombre,
                    fid_usuario: programaData.fid_usuario
                },
                defaults: {
                    nombre: programaData.nombre,
                    fid_usuario: programaData.fid_usuario,
                    esActivo: true
                },
                performedBy,
                individualHooks: true
            });
    
            if (!created) {
                throw new Error('El programa ya existe en la base de datos.');
            }
    
            return programa;
        } catch (error) {
            throw error;
        }
    },

    async obtenerTodos(){
        return await Programa.findAll({
            where: {
                esActivo: 1
            }
        });
    },
    
    async obtenerPorId(id){
        return await Programa.findByPk(id);
    },


    async actualizar(id, datosActualizados, performedBy){
        const programa = await Programa.findByPk(id);
        if(!programa){
            return null;
        }
        await programa.update({
            nombre: datosActualizados.nombre,
            fid_usuario: datosActualizados.fid_usuario,
            esActivo: datosActualizados.esActivo
        },
        {
           where: {
            id_programa: id
           },
           performedBy,
           individualHooks: true
        });
        return programa;
    },
    
    async eliminar(reqBody, performedBy, transaction = null) {
        let t;
        if(transaction == null){
             t = await sequelize.transaction();
        }else{
             t = transaction;
        }
        const { id, nombre } = reqBody;
    
        try {
            let programa;
            if (id) {
                programa = await Programa.findByPk(id, { transaction: t });
            } else if (nombre) {
                programa = await Programa.findOne({ where: { nombre: nombre }, transaction: t });
            }

            if (!programa) {
                throw new Error('Error: El programa no existe.');
            }
            
            if(!programa.esActivo){
                throw new Error('Error: El programa ya esta desactivado.');
            }
            
            const usuariosAlumnos = await Usuario.findAll({
                where: {
                    fid_programa: programa.id_programa,
                },
                include: [
                    {
                        model: Rol,
                        as: "Roles",
                        attributes: ["nombre", "es_activo", "id_rol"],
                        where: {
                            [Op.or]: [
                                { nombre: "Alumno" },
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
                        [Op.in]: [4]
                    },
                    es_activo: true
                },
                attributes: ['id_usuario'],
                transaction: t
            });

            if(usuariosAlumnosRoles.length > 0){
                throw new Error('Error: No se puede eliminar el programa porque tiene alumnos activos.');
            }

            
    
            // Desactiva el rol de 'Coordinador de Programa' para los usuarios asociados al programa que se va a eliminar.
            await RolesUsuario.update({
                es_activo: 0  // Marca el rol como inactivo.
            }, {
                where: {
                    id_rol: 2, // 'Coordinador de Facultad'
                    id_usuario: {
                        [Op.in]: Sequelize.literal(`(SELECT id_usuario FROM Usuario WHERE fid_programa = ${id})`)
                    }
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            
    
            // Actualiza la tabla Usuario para eliminar la referencia al programa.
            await Usuario.update({
                fid_programa: null  // Elimina la referencia del programa en el usuario.
            }, {
                where: {
                    fid_programa: programa.id_programa
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            // Desactiva la facultad marcándola como no activa.
            await Programa.update({
                esActivo: 0,
                fid_usuario: null
            }, {
                where: {
                    id_programa: programa.id_programa
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            if(transaction == null) await t.commit();
            return { message: 'Programa y sus referencias eliminadas con éxito.' };
        } catch (error) {
            await t.rollback();
            throw new Error(error.message || 'Error al eliminar programa.');
        }
    },

    async activar(reqBody, performedBy, transaction = null) {
        let t;
        if(transaction == null){
             t = await sequelize.transaction();
        }else{
             t = transaction;
        }
        const { id, nombre } = reqBody;
    
        try {
            let programa;
            if (id) {
                programa = await Programa.findByPk(id, { transaction: t });
            } else if (nombre) {
                programa = await Programa.findOne({ where: { nombre: nombre }, transaction: t });
            }

            if (!programa) {
                throw new Error('Error: El programa no existe.');
            }
            
            if(programa.esActivo){
                throw new Error('Error: El programa ya esta activado.');
            }
    
            // Desactiva la facultad marcándola como no activa.
            await Programa.update({
                esActivo: 1,
            }, {
                where: {
                    id_programa: programa.id_programa
                },
                transaction: t,
                performedBy,
                individualHooks: true
            });
    
            if(transaction == null) await t.commit();
            return { message: 'Programa activado con éxito.' };
        } catch (error) {
            await t.rollback();
            throw new Error(error.message || 'Error al activar programa.');
        }
    },

    async agregarOAsignarCoordinador(data, performedBy) {
            //todas las validaciones al controller y validar que exista la facultad
            let { idFacultad, code, name, apellidos, email, isSelectedFromSearch, programaNombre} = data;
            const transaction = await sequelize.transaction();  // Usa transacciones para manejar operaciones que deben ser atómicas
            try {
                let usuario;
    
                let aux = code.toString();
                while (aux.length < 8) {
                    aux = "0" + aux;
                }
                code = aux;

                // Verificar si el nombre del programa ya está registrado
                const existingPrograma = await Programa.findOne({ where: { nombre: programaNombre, fid_facultad: idFacultad, esActivo: true } });
                if (existingPrograma) {
                    throw new Error('El nombre del programa ya está registrado dentro de la facultad.');
                }

                // Crear programa y asignar al coordinador
                const programa = await Programa.create({
                    nombre: programaNombre,
                    fid_facultad: idFacultad
                }, { transaction , performedBy});
        
                
    
                if (!isSelectedFromSearch) { // Usuario nuevo
                    // Verificar si el código o email ya están en uso
                    const existingUser = await Usuario.findOne({ where: { [Op.or]: { codigo: code, email: email } } });
                    if (existingUser) {
                        throw new Error('El código o email ya están registrados.');
                    }
                    // Datos del usuario a insertar
                    const usuarioData = {
                        nombres: name,
                        primerApellido: apellidos.split(' ')[0],
                        segundoApellido: apellidos.split(' ')[1] || '',
                        email: email,
                        //fid_programa: programa.id_programa,
                        //fid_facultad: idFacultad,
                        codigo: code
                    };
                    
                    usuario = await UsuarioService.insertar(usuarioData, transaction, performedBy);
                    
                    
                    // Asumiendo que tienes acceso al id del rol de coordinador
                    const rolCoordinador = await Rol.findOne({ where: { nombre: 'Coordinador de Programa' } });
                    const rolTutor = await Rol.findOne({ where: { nombre: 'Tutor' } });
                    // Verificar que el rol fue encontrado
                    if (!rolCoordinador) throw new Error('Rol no encontrado');
                    if (!rolTutor) throw new Error('Rol no encontrado');
                    // Crear la entrada en la tabla intermedia de forma manual
                    await sequelize.models.Roles_Usuario.create({
                        id_usuario: usuario.id_usuario,
                        id_rol: rolCoordinador.id_rol,
                        es_activo: 1
                    }, { transaction, performedBy, individualHooks: true});
                    await sequelize.models.Roles_Usuario.create({
                        id_usuario: usuario.id_usuario,
                        id_rol: rolTutor.id_rol,
                        es_activo: 1
                    }, { transaction, performedBy, individualHooks: true});
                    
                    //asigna fid_facultad al usuario
                    /*await usuario.update({
                        fid_programa: programa.id_programa,
                        fid_facultad: idFacultad
                    }, { transaction });*/
                    //asigna fid_facultad al programa
                } else {
                    // Buscar usuario existente y verificar rol manualmente
                    usuario = await Usuario.findOne({
                        where:{
                            codigo: code
                        }, 
                         include: [
                        {
                            model: Rol,
                            as: 'Roles',
                        },
                        {
                            model: Programa,
                            as: 'Programa',
                        }
                    ] });
        
                    // Verificar si ya está asociado a una programa
                    if (usuario.Programa) {
                        throw new Error('El usuario ya está asociado a un programa.');
                    }
        
                    // Verificar si ya tiene el rol de coordinador
                    if (usuario && !usuario.Roles.some(rol => rol.nombre === 'Coordinador de Programa')) {
                        const rolCoordinador = await Rol.findOne({ where: { nombre: 'Coordinador de Programa' } });
                        if (rolCoordinador) {
                            // Crear la entrada en la tabla intermedia de forma manual
                            await sequelize.models.Roles_Usuario.create({
                                id_usuario: usuario.id_usuario,
                                id_rol: rolCoordinador.id_rol,
                                es_activo: 1
                            }, { transaction , performedBy, individualHooks: true});
                            /*await usuario.update({
                                fid_programa: programa.id_programa,
                                fid_facultad: idFacultad
                            }, { transaction });*/
                        }
                    }    
                }   
                
                await programa.setEncargado(usuario, { transaction , performedBy});
                  
    
                await transaction.commit();
                return { message: 'Programa creado y coordinador asignado con éxito.' };
            } catch (error) {
                await transaction.rollback();
                throw new Error(error.message || 'Error al crear programa y asignar coordinador.');
            }
    },
    async listarPorPaginacion(page, pageSize, sortBy, sortOrder, id_facultad, searchCriterias = []) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        let whereCondition = {
            //esActivo: 1,
            fid_facultad: id_facultad  // Asumiendo que siempre se busca dentro de una facultad específica
        };
    
        searchCriterias.forEach(criteria => {
            if (criteria.value && criteria.field) {
                whereCondition[criteria.field] = {
                    [Op.like]: `%${criteria.value}%`
                };
            }
        });
    
        const programas = await Programa.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            include: [{
                model: Usuario,
                as: 'Encargado',
                attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo'],
            }],
            attributes: ['id_programa', 'nombre', 'esActivo', 'fechaCreacion'],
            where: whereCondition,
        });
    
        return {
            totalPages: Math.ceil(programas.count / limit),
            currentPage: parseInt(page),
            totalProgramas: programas.count,
            programas: programas.rows.map(prog => {
                return {
                    id: prog.id_programa,
                    nombre: prog.nombre,
                    esActivo: prog.esActivo == 1? 'Activo': 'Inactivo',
                    fechaCreacion: prog.fechaCreacion,
                    Encargado: prog.Encargado ? {
                        id_usuario: prog.Encargado.id_usuario,
                        nombres: prog.Encargado.nombres,
                        primerApellido: prog.Encargado.primerApellido,
                        segundoApellido: prog.Encargado.segundoApellido,
                        email: prog.Encargado.email,
                        codigo: prog.Encargado.codigo
                    } : null // Retornar null si no hay encargado
                };
            })
        };
    },
    async editarPrograma(data, performedBy) {
        const { programaId, programaNombre, coordinatorData } = data;
        const transaction = await sequelize.transaction();  // Usamos transacciones para manejar operaciones que deben ser atómicas
        try {
            // Buscar el programa existente
            const programa = await Programa.findByPk(programaId);
            if (!programa) {
                throw new Error('Programa no encontrado.');
            }
            
            // Verificar si el nombre del programa ya está registrado dentro de la misma facultad
            if (programaNombre && programaNombre !== programa.nombre) {
                const existingPrograma = await Programa.findOne({ 
                    where: { 
                        nombre: programaNombre,
                        fid_facultad: programa.fid_facultad,
                        id_programa: {
                            [Sequelize.Op.ne]: programaId  // Excluir el programa actual de la búsqueda
                        },
                        esActivo: true  // Considerar solo programas activos
                    },
                    transaction
                });
                if (existingPrograma) {
                    throw new Error('El nombre del programa ya está registrado en esta facultad.');
                }
                await programa.update({ nombre: programaNombre }, { transaction, performedBy });
            }
            
            // Actualizar nuevo coordinador
            if (coordinatorData) {
    
                // Verificar que el código y el email no estén repetidos con otro usuario
                const existingUser = await Usuario.findOne({
                    where: {
                        [Op.or]: [{ codigo: coordinatorData.codigo }, { email: coordinatorData.email }],
                        id_usuario: { [Op.ne]: coordinatorData.id }  // Excluir al usuario actual de la búsqueda
                    },
                    transaction
                });
    
                if (existingUser) {
                    throw new Error('El código o el email del coordinador ya están repetidos con otro usuario.');
                }
    
                // Actualizar antiguo coordinador
                if (programa.fid_usuario) {
                    // Marcar al antiguo coordinador como inactivo
                    await sequelize.models.Roles_Usuario.update(
                        { es_activo: 0 },
                        { where: { id_usuario: programa.fid_usuario, id_rol: 2 }, transaction, performedBy, individualHooks: true }
                    );
                }
    
                let { id, codigo, nombres, primerApellido, segundoApellido, email } = coordinatorData;
    
                let aux = codigo.toString();
                while (aux.length < 8) {
                    aux = "0" + aux;
                }
                codigo = aux;
    
                let usuario;
                if (id) {
                    // Si se proporciona un ID, buscar el usuario existente y actualizarlo
                    usuario = await Usuario.findByPk(id);
                    if (!usuario) throw new Error('Usuario no encontrado.');
                    await usuario.update({
                        codigo,
                        nombres,
                        primerApellido,
                        segundoApellido,
                        email,
                    }, { transaction, performedBy, individualHooks: true });
                } else {
                    // Si no se proporciona un ID, buscar por código o email para ver si ya existe
                    usuario = await Usuario.findOne({
                        where: { [Op.or]: [{ codigo }, { email }] },
                        transaction,
                    });
                    if (usuario) {
                        throw new Error('El código o el email del coordinador ya están repetidos con otro usuario.');
                    }
                }
    
                if (!usuario) {
                    // Si el usuario no existe, crear uno nuevo y asignar el programa al nuevo usuario
                    usuario = await UsuarioService.insertar(coordinatorData, transaction, performedBy);
    
                    // Asignar el rol de 'Coordinador de Programa' al nuevo usuario
                    const rolCoordinador = await Rol.findOne({ where: { nombre: 'Coordinador de Programa' } });
                    if (!rolCoordinador) throw new Error('Rol no encontrado.');
                    const rolTutor = await Rol.findOne({ where: { nombre: 'Tutor' } });
                    if (!rolTutor) throw new Error('Rol no encontrado');
                    
                    await sequelize.models.Roles_Usuario.create({
                        id_usuario: usuario.id_usuario,
                        id_rol: rolCoordinador.id_rol,
                        es_activo: 1
                    }, { transaction, performedBy, individualHooks: true });
                    
                    await sequelize.models.Roles_Usuario.create({
                        id_usuario: usuario.id_usuario,
                        id_rol: rolTutor.id_rol,
                        es_activo: 1
                    }, { transaction, performedBy, individualHooks: true });
                } else {
                    // Actualizar datos del usuario existente
                    await usuario.update({
                        codigo,
                        nombres,
                        primerApellido,
                        segundoApellido,
                        email,
                    }, { transaction, performedBy, individualHooks: true });
    
                    await sequelize.models.Roles_Usuario.update(
                        { es_activo: 1 },
                        { where: { id_usuario: usuario.id_usuario, id_rol: 2 }, transaction, performedBy, individualHooks: true }
                    );
                }
                
                // Actualizar programa con el nuevo ID del usuario coordinador
                await programa.update({ fid_usuario: usuario.id_usuario }, { transaction, performedBy });
            }
    
            // Commit de la transacción
            await transaction.commit();
            return { message: 'Programa actualizado con éxito.' };
        } catch (error) {
            // Rollback de la transacción en caso de error
            await transaction.rollback();
            throw new Error(error.message || 'Error al actualizar el programa.');
        }
    },
    
    
    async listarProgramasPorUsuario(idUsuario) {
        idUsuario = parseInt(idUsuario);
        try {
            // Find the user and include their roles
            const usuario = await Usuario.findOne({
                where: { id_usuario: idUsuario },
                include: [
                    {
                        model: Rol,
                        as: 'Roles',
                        where: { nombre: { [Op.in]: ['Coordinador de Facultad', 'Coordinador de Programa'] } },
                        through: { attributes: [], where: { es_activo: true} }
                    }
                ]
            });
    
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
    
            const esCoordinadorFacultad = usuario.Roles.some(rol => rol.nombre === 'Coordinador de Facultad');
            const esCoordinadorPrograma = usuario.Roles.some(rol => rol.nombre === 'Coordinador de Programa');
    
            let programas;
    
            if (esCoordinadorFacultad) {
                // Find the faculty where the user is the coordinator
                const facultad = await Facultad.findOne({
                    where: { fid_usuario: idUsuario, esActivo: true },
                    attributes: ['id_facultad', 'nombre']
                });
    
                if (!facultad) {
                    throw new Error('Facultad no encontrada para el Coordinador de Facultad');
                }
    
                // List all programs of that faculty
                programas = await Programa.findAll({
                    where: { fid_facultad: facultad.id_facultad , esActivo: true},
                    include: [
                        {
                            model: Facultad,
                            as: 'Facultad',
                            attributes: ['id_facultad', 'nombre']
                        }
                    ],
                    order: [['nombre', 'ASC']],
                    attributes: ['id_programa', 'nombre']
                });
            } else if (esCoordinadorPrograma) {
                // Find the program where the user is the coordinator
                const programa = await Programa.findOne({
                    where: { fid_usuario: idUsuario, esActivo: true },
                    attributes: ['id_programa', 'nombre'],
                    include: [
                        {
                            model: Facultad,
                            as: 'Facultad',
                            attributes: ['id_facultad', 'nombre']
                        }
                    ]
                });
    
                if (!programa) {
                    throw new Error('Programa no encontrado para el Coordinador de Programa');
                }
    
                programas = [programa];
            } else {
                throw new Error('Usuario no tiene rol de Coordinador de Facultad ni Coordinador de Programa');
            }
    
            return programas.map(programa => ({
                id: programa.id_programa,
                nombrePrograma: programa.nombre,
                idFacultad: programa.Facultad.id_facultad,
                nombreFacultad: programa.Facultad.nombre,
            }));
        } catch (error) {
            throw new Error('Error al listar programas por usuario: ' + error.message);
        }
    },
    
    async obtenerProgramaCoordinador(idCoord) {
        try {
            const programa = await Programa.findOne({
                where: { fid_usuario: idCoord },
                include: [                    
                    {
                        model: Facultad,
                        as: 'Facultad',
                        attributes: ['id_facultad', 'nombre']
                    }
                ],
                attributes: ['id_programa', 'nombre']
            });
    
            if (!programa) {
                res.status(500).json({ error: "Programa no encontrado" });
            }
    
            return {
                id_programa: programa.id_programa,
                nombre: programa.nombre,
                facultad: programa.Facultad ? {
                    id_facultad: programa.Facultad.id_facultad,
                    nombre: programa.Facultad.nombre
                } : null
            };
        } catch (error) {
            console.error(
              "Error al obtener programa coordinador:",
              error.message
            );
            res
              .status(500)
              .json({ error: "Error al obtener programa coordinador" });
        }
    }
};

module.exports = ProgramaServices;