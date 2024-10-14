const jwt = require('jsonwebtoken');
const db = require('../models/')
const { Sequelize, Op, where, or } = require('sequelize');
const sequelize = db.sequelize;

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateInitialsAvatar = require('../utils/initialAvatar');
const transporter = require('../config/mailer');
const { es, ca } = require('date-fns/locale');
const { includes } = require('lodash');
const Usuario = db.Usuario;
const Derivacion = db.Derivacion;
const UnidadAcademica = db.UnidadAcademica;
const Rol = db.Rol;
const Facultad = db.Facultad;
const Programa = db.Programa;
const TipoTutoria = db.TipoTutoria;
const TipoTutor = db.TipoTutor;
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const AsignacionTipoTutoria = db.AsignacionTipoTutoria;
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const Roles_Usuario = db.Roles_Usuario;
const HistoricoEstudiante = db.HistoricoEstudiante;
const SesionCita = db.SesionCita;
const Encuesta = db.Encuesta;
const EstadoCita = db.EstadoCita;
const AlumnoSesionCita = db.AlumnoSesionCita;

function generarCadenaAleatoria(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

const UsuarioService = {
  async envioCorreo(usuario, password) {
    let cuerpoHTML = `
            <h1>Hola, ${usuario.nombres}!</h1>
            <p>Gracias por registrarte en nuestro sitio. Aquí están los detalles de tu cuenta:</p>
            <ul>
            <li>Email: ${usuario.email}</li>
            <li>Contraseña: ${password}</li>
            </ul>
            <p>Esperamos verte pronto en nuestro sitio web.</p>
            <p><strong>Recuerda cambiar tu contraseña al ingresar por primera vez.</strong></p>
        `;
    console.log(usuario);
    await transporter.sendMail({
      from: '"Credenciales Mentify" <mentify.soft@gmail.com>',
      to: usuario.email,
      subject: "Envio de credenciales Mentify",
      html: cuerpoHTML,
    });
  },

  async insertar(usuarioData, transaction = null, performedBy) {
    // Genera el hash de la contraseña
    const saltRounds = 10;
    const contrasenha = generarCadenaAleatoria(10);

    const hashedPassword = await bcrypt.hash(contrasenha, saltRounds);
    if(!hashedPassword){
      throw new Error("Error al encriptar la contraseña");
    }
    // Genera la imagen de las iniciales
    const avatarUrl = generateInitialsAvatar(usuarioData.nombres);
    if(usuarioData.fid_programa === 0){
      usuarioData.fid_programa = null;
    }

    let aux = usuarioData.codigo.toString();
    while (aux.length < 8) {
      aux = "0" + aux;
    }
    usuarioData.codigo = aux;
    console.log("WAZAAAAAA",usuarioData.codigo);
    console.log("Performed By:",usuarioData.fid_programa);
    const usuario = await Usuario.create(
      {
        nombres: usuarioData.nombres,
        primerApellido: usuarioData.primerApellido,
        segundoApellido: usuarioData.segundoApellido || "",
        email: usuarioData.email,
        contrasenha: hashedPassword,
        fid_programa: usuarioData.fid_programa,
        fid_facultad: usuarioData.fid_facultad,
        es_Activo: true,
        codigo: usuarioData.codigo,
        imagen: avatarUrl,
      },
      {transaction, performedBy}
    );
    //Esto valida si se pudo registrar el usuario, de modo que solo a los usuarios que se pudieron registrar
    //se les envia el correo con las credenciales
    if (usuario) {
      try {
        await UsuarioService.envioCorreo(usuario, contrasenha);
      } catch (error) {
        console.error("Error al enviar correo:", error);
      }
    }
    else{
      throw new Error("Error al crear el usuario");
    }
    return usuario; // Asegúrate de que estás retornando el usuario creado
  },

  
  async obtenerPorEmail(email) {
    return await Usuario.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: Rol,
          as: "Roles", // Es opcional definir un alias
          through: {
            attributes: [], // Puedes especificar atributos específicos de la tabla intermedia si es necesario
            where: {es_activo: true}
          }
        },
      ],
    });
  },

  async obtenerPorCodigo(codigo, transaction) {
    return await Usuario.findOne({
      where: {
        codigo: codigo,
        esActivo: 1,
      },
      include: [
        {
          model: Rol,
          as: "Roles", // Es opcional definir un alias
          through: {
            attributes: [], // Puedes especificar atributos específicos de la tabla intermedia si es necesario
            where: {es_activo: true}
          },
        },
      ],
      transaction,
    });
  },

  async obtenerTodos() {
    return await Usuario.findAll({
      include: [
        {
          association: "Roles",
        },
      ],
    });
  },

  async obtenerPorId(id) {
    return await Usuario.findByPk(id, {
      include: [
        {
          association: "Roles",
        },
      ],
    });
  },

  async getAlumnosByFacultadService(userId) {
    const facultad = await db.Facultad.findOne({
      where: { fid_usuario: userId },
    });
    if (!facultad) {
      throw new Error("El usuario no está asociado a ninguna facultad");
    }

    const alumnos = await db.Usuario.findAll({
      attributes: ["id_usuario"],
      include: [
        {
          model: db.Rol,
          as: "Roles",
          where: { nombre: "Alumno" },
          attributes: [],
        },
      ],
      where: {
        fid_facultad: facultad.id_facultad,
        esActivo: 1,
      },
      raw: true,
    });

    const alumnoIds = alumnos.map((alumno) => alumno.id_usuario);

    if (alumnoIds.length === 0) {
      return [];
    }

    const detailedAlumnos = await db.Usuario.findAll({
      attributes: [
        "id_usuario",
        "nombres",
        "primerApellido",
        "segundoApellido",
        "email",
        "codigo",
        "imagen",
        "esActivo",
      ],
      include: [
        {
          model: db.Programa,
          as: "Programa",
          attributes: ["nombre"],
        },
      ],
      where: {
        id_usuario: alumnoIds,
      },
      group: ["Usuario.id_usuario", "Programa.id_programa"],
    });

    return detailedAlumnos.map((alumno) => ({
      id: alumno.id_usuario,
      nombres: alumno.nombres,
      primerApellido: alumno.primerApellido,
      segundoApellido: alumno.segundoApellido,
      email: alumno.email,
      codigo: alumno.codigo,
      avatar: alumno.imagen,
      esActivo: alumno.esActivo,
      programa: alumno.Programa ? alumno.Programa.nombre : null,
      rol: "Alumno",
    }));
  },

  async actualizar(id, datosActualizados, performedBy) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    console.log("WAZAAAAAAAAAAAAAAAAAA",datosActualizados);

    if(datosActualizados.fid_facultad && datosActualizados.fid_facultad !== usuario.fid_facultad){
      const asignaciones = await AsignacionTipoTutoria.findAll({
        where: { fid_usuario: id, esActivo: true },
        include: [
          {
            model: TipoTutoria,
            as: 'TipoTutoria',
            where: { esActivo: true, fid_facultad: usuario.fid_facultad }
          }
        ]
      });
      if(asignaciones.length > 0){
        for(const asignacion of asignaciones){
          await UsuarioService.eliminarAsignacionTipoTutoriaUsuario(asignacion.fid_usuario,asignacion.fid_tipoTutoria, performedBy);
        }
      }
    }

    if(datosActualizados.fid_programa && datosActualizados.fid_programa !== usuario.fid_programa){
      const asignaciones = await AsignacionTipoTutoria.findAll({
        where: { fid_usuario: id, esActivo: true },
        include: [
          {
            model: TipoTutoria,
            as: 'TipoTutoria',
            where: { esActivo: true, fid_programa: usuario.fid_programa }
          }
        ]
      });
      if(asignaciones.length > 0){
        for(const asignacion of asignaciones){
          await UsuarioService.eliminarAsignacionTipoTutoriaUsuario(asignacion.fid_usuario,asignacion.fid_tipoTutoria, performedBy);
        }
      }
    }

    // Genera la imagen de las iniciales
    const avatarUrl = generateInitialsAvatar(datosActualizados.nombres);

    console.log('Datos Actualizados:', performedBy);

    if(datosActualizados.fid_programa === 0){
      datosActualizados.fid_programa = null;
    }
    await usuario.update(
      {
        email: datosActualizados.email,
        codigo: datosActualizados.codigo,
        nombres: datosActualizados.nombres,
        primerApellido: datosActualizados.primerApellido,
        segundoApellido: datosActualizados.segundoApellido,
        fid_programa: datosActualizados.fid_programa,
        fid_facultad: datosActualizados.fid_facultad,
        imagen: avatarUrl,
      },
      {
        where: {
          idUsuario: id,
        },
        individualHooks: true,
        performedBy
      }
    );

    //const rolTutor = await Rol.findOne({ where: { nombre: 'Tutor' } });

    if (datosActualizados.rolAdicional) {
      // Activar o agregar el rol de Tutor

      if (datosActualizados.idRol === 4) {
        //que es Alumno, rol Adicional es Tutor
        const rolUsuario = await Roles_Usuario.findOne({
          where: { id_usuario: id, id_rol: 3 },
        });
        if (rolUsuario) {
          // Si ya existe la relación, activar el rol si no está activo
          if (!rolUsuario.es_activo) {
            await rolUsuario.update({ es_activo: true }, {performedBy});
          }
        } else {
          // Si no existe la relación, agregar el rol de Tutor
          await Roles_Usuario.create({
            id_usuario: id,
            id_rol: 3,
            es_activo: true,
          },
          {
            performedBy
          });
        }
      }
    } else {
      if (datosActualizados.idRol === 4) {
        // Desactivar el rol de Alumno si existe y está activo
        const rolUsuario = await Roles_Usuario.findOne({
          where: { id_usuario: id, id_rol: 3, es_activo: true },
        });
        if (rolUsuario) {
          await UsuarioService.eliminarRolDeUsuarioPorNombre(
            id,
            'Tutor',
            performedBy
          );
        }
      }
    }
    return usuario;
  },

  async eliminar(id, performedBy) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    if (!usuario.esActivo) {
      throw new Error(
        "El usuario ya está desactivado y no se puede eliminar nuevamente"
      );
    }
    await usuario.update(
      {
        esActivo: 0,
      },
      {
        where: {
          id_usuario: id,
        },
        individualHooks: true,
        performedBy
      },
    );
    return usuario;
  },

  async crearToken(user) {
    // Mapear los roles para incluirlos en el token
    const roles = user.Roles.map((rol) => rol.nombre); // Asumiendo que cada rol tiene un atributo 'nombre'

    const accessToken = jwt.sign(
      {
        id: user.id_usuario,
        email: user.email,
        //el rol se envia como texto, no como ID
        roles: roles,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return accessToken;
  },
  async crearRefreshToken(user) {
    // Mapear los roles para incluirlos en el token
    const roles = user.Roles.map((rol) => rol.nombre); // Asumiendo que cada rol tiene un atributo 'nombre'

    const refreshToken = jwt.sign(
      {
        id: user.id_usuario,
        email: user.email,
        roles: roles,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    return refreshToken;
  },
  async obtenerUsuariosPorRol(nombreRol) {
    return db.Usuario.findAll({
      include: [
        {
          model: db.Rol,
          as: "Roles",
          attributes: [],
        },
        {
          model: db.Facultad, // Asumiendo que este es el nombre de tu modelo de facultad
          as: "Facultad", // Y este es el alias que has dado a la relación
          attributes: ["id_facultad", "nombre"], // Aquí especificas que quieres el id y el nombre de la facultad
        },
        {
          model: db.Programa,
          as: "Programa",
          attributes: ["nombre"],
        },
      ],
    });
  },

  async obtenerRolesPorIdUsuario(idUsuario) {
    const usuario = await Usuario.findByPk(idUsuario, {
      include: [
        {
          model: Rol,
          as: "Roles",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return usuario ? usuario.Roles.map((role) => role.nombre) : [];
  },

  async obtenerRolesPorIdUsuarioyEstado(idUsuario) {
    // Obtener todos los registros de Roles_Usuario para el id_usuario dado
    const rolesUsuario = await Roles_Usuario.findAll({
        where: { id_usuario: idUsuario },
        attributes: ['es_activo'] // Solo nos interesa el campo es_activo
    });

    // Devolver un array con los estados de actividad de los roles
    return rolesUsuario.map(roleUsuario => roleUsuario.es_activo);
},
  async eliminarRolDeUsuario(userId, roleId, performedBy) {
    try {
      const usuario = await Usuario.findByPk(userId);
      if (!usuario) throw new Error("Usuario no encontrado");

      const rol = await Rol.findByPk(roleId);
      if (!rol) throw new Error("Rol no encontrado");

      // Remove the role from the user
      await usuario.removeRol(rol, performedBy);
      return { usuarioId: userId, rolId: roleId };
    } catch (error) {
      throw error;
    }
  },

  async eliminarRolDeUsuarioPorNombre(userId, roleName, performedBy) {
    const transaction = await sequelize.transaction();
    try {
      const usuario = await Usuario.findByPk(userId);
      if (!usuario) throw new Error("Usuario no encontrado");
      
      const rol = await Rol.findOne({
        where: { nombre: roleName },
      });
      if (!rol) throw new Error("Rol no encontrado");
  
      if (roleName === 'Tutor') {
        const { Roles } = await Usuario.findOne({
          where: {
            id_usuario: userId,
            esActivo: true // Ensure the user is active
          },
          include: [
            {
              model: Rol,
              as: "Roles",
              through: {
                attributes: [],
                where: {
                  [Sequelize.Op.and]: [
                    Sequelize.where(
                      Sequelize.fn('',
                        Sequelize.col('nombre')
                      ),
                      {
                        [Sequelize.Op.or]: [
                          { [Sequelize.Op.like]: '%Coordinador de Facultad%' },
                          { [Sequelize.Op.like]: '%Coordinador de Programa%' }
                        ]
                      }
                    ),
                    { es_activo: true } // Ensure the role is active
                  ]
                }
              },
            },
          ],
          transaction
        });
  
        if (Roles && Roles.length > 0) {
          if (Roles[0].nombre === 'Coordinador de Facultad') {
            const facultad = await Facultad.findOne({
              where: { fid_usuario: userId, esActivo: true },
              transaction
            });
            if (facultad) {
              await facultad.update({ fid_usuario: null }, { performedBy, transaction });
            }
          } else if (Roles[0].nombre === 'Coordinador de Programa') {
            const programa = await Programa.findOne({
              where: { fid_usuario: userId, esActivo: true },
              transaction
            });
            if (programa) {
              await programa.update({ fid_usuario: null }, { performedBy, transaction });
            }
          }
          await Roles_Usuario.update(
            { es_activo: false },
            {
              where: {
                id_usuario: userId,
                id_rol: Roles[0].id_rol,
              },
              individualHooks: true,
              performedBy,
              transaction
            }
          );
        }
      }
  
      console.log('Performer:', performedBy); 
  
      // Change esActivo to false in the Roles_Usuario table for the specific role
      await Roles_Usuario.update(
        { es_activo: false },
        {
          where: {
            id_usuario: usuario.id_usuario,
            id_rol: rol.id_rol,
          },
          individualHooks: true,
          transaction, 
          performedBy,
        }
      );
  
      const asignaciones = await AsignacionTipoTutoria.findAll({
        where: { fid_usuario: userId, esActivo: true },
        transaction
      });
  
      if (asignaciones.length > 0) {
        for (const asignacion of asignaciones) {
          await UsuarioService.eliminarAsignacionTipoTutoriaUsuario(asignacion.fid_usuario, asignacion.fid_tipoTutoria, transaction, performedBy);
        }
      }
  
      await transaction.commit(); // Commit the transaction
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction
      console.log(error);
      throw error;
    }
  },
  

  async eliminarAsignacionTipoTutoriaUsuario(id_usuario, id_tutoringType, transaction, performedBy) {
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

        asignacion.esActivo = false;
        await asignacion.save({ transaction, performedBy});
        
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

  async activarRolDeUsuarioPorNombre(userId, roleName, performedBy) {
    try {
      // Buscar al usuario por su ID
      const usuario = await Usuario.findByPk(userId);
      if (!usuario) throw new Error("Usuario no encontrado");

      // Buscar el rol por su nombre
      const rol = await Rol.findOne({
        where: { nombre: roleName },
      });
      if (!rol) throw new Error("Rol no encontrado");

      // Cambiar esActivo a false en la tabla Roles_Usuario para el rol específico
      await Roles_Usuario.update(
        { es_activo: true },
        {
          where: {
            id_usuario: usuario.id_usuario,
            id_rol: rol.id_rol,
          },
          individualHooks: true,
          performedBy
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async listarUsuariosPorRolPaginado(role,page,pageSize,sortBy,sortOrder,idCoord,searchCriterias = []) {
    //NADIE TOQUE ESTA MRD, QUE ESTA FUNCIONANDO BIEN
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    let whereConditions = {
      esActivo: true, // Siempre activo
    };

    let whereConditionRolUsuario = {};

    searchCriterias.forEach((term) => {
      if (term.active) {
        if (term.active.length === 1) {
          whereConditionRolUsuario.es_activo =
            term.active[0] === "Activo" ? true : false;
        } else {
          whereConditionRolUsuario.es_activo = [true, false];
        }
      }
    });

    console.log("Condiciones: ", whereConditionRolUsuario);

    searchCriterias.forEach((term) => {
      if (term.field && term.value) {
        if (term.field === "multiField") {
          // Construir condición OR para múltiples campos
          whereConditions[Op.or] = [
            Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
              [Op.like]: `%${term.value}%`
            }),
            { email: { [Op.like]: `%${term.value}%` } },
            { codigo: { [Op.like]: `%${term.value}%` } },
          ];
        } else {
          // Manejar condiciones normales
          whereConditions[term.field] = {
            [Op.like]: `%${term.value}%`,
          };
        }
      }
    });

    // Añadir condiciones de facultad o programa si el rol es Alumno
    if (role === "Alumno") {
      const coordinador = await Usuario.findByPk(idCoord, {
        include: [
            {
              model: Rol,
              as: "Roles",
              where: { es_activo: true },
              through: { attributes: [], where: { es_activo: true } },
            },
          ],
        },
      );

      const esCoordinadorFacultad = coordinador.Roles.some((rol) =>
        rol.nombre.includes("Coordinador de Facultad")
      );
      const esCoordinadorPrograma = coordinador.Roles.some((rol) =>
        rol.nombre.includes("Coordinador de Programa")
      );
      if (esCoordinadorFacultad) {
        const facultad = await Facultad.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
        if(facultad){
          whereConditions.fid_facultad = facultad.id_facultad;
        }
      } else if (esCoordinadorPrograma) {
        const programa = await Programa.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
        if(programa){
          whereConditions.fid_programa = programa.id_programa;
        }
      }
    }

    const usuarios = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]],
      where: whereConditions,
      include: [
        {
          model: Rol,
          as: "Roles",
          attributes: ["nombre"],
          where: { nombre: role },
          through: {
            where: whereConditionRolUsuario,
            attributes: ["es_activo"],
          }, // Filtrar roles activos/inactivos en la relación
        },
        {
          model: Facultad,
          as: "Facultad",
          attributes: ["id_facultad", "nombre", "siglas"],
        },
        {
          model: Programa,
          as: "Programa",
          attributes: ["id_programa", "nombre"],
        },
      ],
      order: [
        ["nombres", "ASC"],
      ]
    });

    const usuariosConRoles = await Promise.all(
        usuarios.rows.map(async (usuario) => {
          const roles = await usuario.getRoles({
            attributes: ["nombre"], // Obtener solo el nombre del rol
            joinTableAttributes: ["es_activo"], // Asegurarse de obtener el campo es_activo de la tabla intermedia
          });

          // Filtrar roles activos
          const rolesActivos = roles.filter(
            (rol) => rol.Roles_Usuario.es_activo === true
          );

          // Filtrar el rol específico (activos)
          const rolFinal = roles.filter((rol) => rol.nombre === role);
          
          return {
            id: usuario.id_usuario,
            nombres: usuario.nombres,
            primerApellido: usuario.primerApellido,
            segundoApellido: usuario.segundoApellido,
            email: usuario.email,
            codigo: usuario.codigo,
            esActivo:
              rolFinal.length > 0 ? rolFinal[0].Roles_Usuario.es_activo : null,
            fechaCreacion: usuario.fechaCreacion,
            fechaActualizacion: usuario.fechaActualizacion,
            roles: rolesActivos.map((rol) => rol.nombre), // Incluir solo los roles filtrados
            fid_facultad: usuario.Facultad
              ? usuario.Facultad.id_facultad
              : null,
            fid_programa: usuario.Programa
              ? usuario.Programa.id_programa
              : null,
            facultad: usuario.Facultad ? usuario.Facultad.nombre : null,
            programa: usuario.Programa ? usuario.Programa.nombre : null,
          };
        })
    );

    return {
      totalPages: Math.ceil(usuarios.count / limit),
      currentPage: parseInt(page),
      totalUsuarios: usuariosConRoles.length,
      usuarios: usuariosConRoles,
    };
  },

  async listarUsuariosFacultadPaginado(
    facultadId,
    nombreFacultad,
    roles,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    let whereConditions = { esActivo: 1 };

    if (facultadId !== undefined && facultadId !== null) {
      whereConditions.fid_facultad = facultadId;
    }

    const facultadWhere = {};
    if (facultadId) facultadWhere.id_facultad = facultadId;
    if (nombreFacultad) facultadWhere.nombre = nombreFacultad;

    const facultad = await Facultad.findOne({
      where: facultadWhere,
    });

    whereConditions.fid_facultad = facultad ? facultad.id_facultad : null;

    if (!facultad) {
      return {
        totalPages: 0,
        currentPage: parseInt(page),
        totalUsuarios: 0,
        usuarios: [],
      };
    }

    const usuarios = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]],
      where: whereConditions,
      include: [
        {
          model: db.Rol,
          as: "Roles",
          where: { nombre: { [Op.in]: roles } },
          through: { attributes: [] },
        },
        {
          model: db.Facultad,
          as: "Facultad",
          attributes: ["id_facultad", "nombre", "siglas"],
        },
      ],
    });

    return {
      totalPages: Math.ceil(usuarios.count / limit),
      currentPage: parseInt(page),
      totalUsuarios: usuarios.count,
      usuarios: usuarios.rows,
    };
  },

  async listarUsuariosPorCoordinadorPaginado(
    idCoord,
    roles,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    const coordinador = await Usuario.findByPk(idCoord, {
      include: {
        model: Rol,
        as: "Roles",
        through: { attributes: [], where: { es_activo: true } },
      },
    });

    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }

    let whereConditions = { esActivo: 1 };

    const rolCoordinador = coordinador.Roles.find((rol) =>
      rol.nombre.includes("Coordinador")
    );

    if (!rolCoordinador) {
      throw new Error("El usuario no tiene el rol de coordinador");
    }

    if (rolCoordinador.nombre === "Coordinador de Programa") {
      const programa = await Programa.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      })
      whereConditions.fid_programa = programa.id_programa;
    } else if (rolCoordinador.nombre === "Coordinador de Facultad") {
      const facultad = await Facultad.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      })
      whereConditions.fid_facultad = facultad.id_facultad;
    }

    const usuarios = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]],
      where: whereConditions,
      include: [
        {
          model: db.Rol,
          as: "Roles",
          where: { nombre: { [Op.in]: roles } },
          through: { attributes: [] },
        },
        {
          model: db.Facultad,
          as: "Facultad",
          attributes: ["id_facultad", "nombre"],
        },
        {
          model: db.Programa,
          as: "Programa",
          attributes: ["id_programa", "nombre"],
        },
      ],
    });

    return {
      totalPages: Math.ceil(usuarios.count / limit),
      currentPage: parseInt(page),
      totalUsuarios: usuarios.count,
      usuarios: usuarios.rows,
    };
  },

  async listarTutoresAlumnoPaginado(idAlumno, nombreTutor, page, pageSize) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    let whereConditions = { fid_alumno: idAlumno };

    if (nombreTutor) {
      whereConditions["$Tutor.nombres$"] = { [Op.like]: `%${nombreTutor}%` };
    }

    const asignaciones = await AsignacionTutorAlumno.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereConditions,
      include: [
        {
          model: Usuario,
          as: "Tutor",
          attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "email",
            "codigo",
          ],
        },
        {
          model: TipoTutoria,
          as: "TipoTutoria",
          attributes: ["nombre"],
        },
      ],
    });

    return {
      totalPages: Math.ceil(asignaciones.count / limit),
      currentPage: parseInt(page),
      totalAsignaciones: asignaciones.count,
      asignaciones: asignaciones.rows,
    };
  },

  async listarTutoresPorTipoTutoriaPaginado(
    tipoTutoria,
    nombreTutor,
    page,
    pageSize
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    let whereConditions = {};

    if (nombreTutor) {
      whereConditions["nombres"] = { [Op.like]: `%${nombreTutor}%` };
    }

    let tutoriaCondition =
      tipoTutoria === "Todos" ? {} : { nombre: tipoTutoria };

    const tutoria = await TipoTutoria.findAll({
      where: tutoriaCondition,
      include: [
        {
          model: AsignacionTutorAlumno,
          as: "AsignacionesTutorAlumno",
          include: [
            {
              model: Usuario,
              as: "Tutor",
              where: whereConditions,
              attributes: [
                "id_usuario",
                "nombres",
                "primerApellido",
                "email",
                "codigo",
                "fid_facultad",
              ],
            },
          ],
        },
      ],
    });

    if (!tutoria || tutoria.length === 0) {
      return {
        totalPages: 0,
        currentPage: parseInt(page),
        totalTutores: 0,
        tutores: [],
      };
    }

    const tutores = [];
    tutoria.forEach((t) => {
      t.AsignacionesTutorAlumno.forEach((a) => {
        const tutor = a.Tutor.get({ plain: true });
        tutor.TipoTutoria = {
          id: t.id_tipoTutoria,
          nombre: t.nombre,
        };
        tutores.push(tutor);
      });
    });

    const totalTutores = tutores.length;
    const paginatedTutores = tutores.slice(offset, offset + limit);

    return {
      totalPages: Math.ceil(totalTutores / limit),
      currentPage: parseInt(page),
      totalTutores: totalTutores,
      tutores: paginatedTutores,
    };
  },

  async listarAlumnosAsignadosTutor(
    idTutor,
    tipoTutoria,
    nombreAlumno,
    primerApellido,
    codigo,
    correo,
    page,
    pageSize
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    let whereConditions = { fid_tutor: idTutor };

    if (nombreAlumno) {
      whereConditions["$Alumno.nombres$"] = { [Op.like]: `%${nombreAlumno}%` };
    }
    if (primerApellido) {
      whereConditions["$Alumno.primerApellido$"] = {
        [Op.like]: `%${primerApellido}%`,
      };
    }
    if (codigo) {
      whereConditions["$Alumno.codigo$"] = { [Op.like]: `%${codigo}%` };
    }
    if (correo) {
      whereConditions["$Alumno.email$"] = { [Op.like]: `%${correo}%` };
    }

    const asignaciones = await AsignacionTutorAlumno.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereConditions,
      include: [
        {
          model: Usuario,
          as: "Alumno",
          attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "email",
            "codigo",
          ],
        },
        {
          model: TipoTutoria,
          as: "TipoTutoria",
          where: { nombre: tipoTutoria },
          attributes: [],
        },
      ],
    });

    return {
      totalPages: Math.ceil(asignaciones.count / limit),
      currentPage: parseInt(page),
      totalAsignaciones: asignaciones.count,
      asignaciones: asignaciones.rows,
    };
  },

  async listarAlumnosTipoTutoriaExcluidos(
    idTutor,
    tipoTutoria,
    nombreAlumno,
    primerApellido,
    codigo,
    correo,
    page,
    pageSize
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    const asignaciones = await AsignacionTutorAlumno.findAll({
      where: { fid_tutor: idTutor },
      include: [
        {
          model: TipoTutoria,
          as: "TipoTutoria",
          where: { nombre: tipoTutoria },
          attributes: [],
        },
      ],
    });

    const asignadosIds = asignaciones.map(
      (asignacion) => asignacion.fid_alumno
    );

    let whereConditions = { id_usuario: { [Op.notIn]: asignadosIds } };

    if (nombreAlumno) {
      whereConditions["nombres"] = { [Op.like]: `%${nombreAlumno}%` };
    }
    if (primerApellido) {
      whereConditions["primerApellido"] = { [Op.like]: `%${primerApellido}%` };
    }
    if (codigo) {
      whereConditions["codigo"] = { [Op.like]: `%${codigo}%` };
    }
    if (correo) {
      whereConditions["email"] = { [Op.like]: `%${correo}%` };
    }

    const alumnos = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereConditions,
      include: [
        {
          model: AsignacionTutorAlumno,
          as: "AsignacionesTutorAlumno",
          include: [
            {
              model: TipoTutoria,
              as: "TipoTutoria",
              where: { nombre: tipoTutoria },
              attributes: [],
            },
          ],
          required: false,
        },
      ],
    });

    return {
      totalPages: Math.ceil(alumnos.count / limit),
      currentPage: parseInt(page),
      totalAlumnos: alumnos.count,
      alumnos: alumnos.rows,
    };
  },

  async desasignarAlumnoTutor(idAlumno, idTutor, tipoTutoria, performedBy) {
    const tipoTutoriaRecord = await TipoTutoria.findOne({
      where: { id_tipoTutoria: tipoTutoria },
    });

    console.log(tipoTutoriaRecord);

    if (!tipoTutoriaRecord) {
      throw new Error("Tipo de tutoría no encontrado");
    }

    const asignacion = await AsignacionTutorAlumno.findOne({
      where: {
        fid_alumno: idAlumno,
        fid_tutor: idTutor,
        fid_tipoTutoria: tipoTutoriaRecord.id_tipoTutoria,
        esActivo: true,
      },
    });

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    await asignacion.update({ esActivo: false }, { performedBy, individualHooks: true });

    // fechaHoraInicio > fechaActual
    await SesionCita.update(
      {
        fid_estado_cita: 3, // Estado cancelado
        motivoRechazo: 'Desasignación de tutor'
      },
      {
        where: {
          esActivo: true,
          fechaHoraInicio: { [Sequelize.Op.gt]: new Date() },
          fid_tipoTutoria: tipoTutoriaRecord.id_tipoTutoria,
        },
        include: [
          {
            model: Usuario,
            as: 'Alumnos',
            where: { id_usuario: idAlumno },
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

    return asignacion;
  },

  async asignarAlumnoTutor(idAlumno, idTutor, tipoTutoria, performedBy) {
    const tipoTutoriaRecord = await TipoTutoria.findOne({
      where: { nombre: tipoTutoria },
      performedBy,
    });

    if (!tipoTutoriaRecord) {
      throw new Error("Tipo de tutoría no encontrado");
    }

    const asignacion = await AsignacionTutorAlumno.create(
      {
        fid_alumno: idAlumno,
        fid_tutor: idTutor,
        fid_tipoTutoria: tipoTutoriaRecord.id_tipo_tutoria,
        esActivo: true,
      },
      { performedBy }
    );

    return asignacion;
  },

  async reiniciarTemporales(tipoTutoria, transaction, performedBy) {
    const tipoTutoriaRecord = await TipoTutoria.findOne({
      where: { nombre: tipoTutoria },
      transaction,
    });

    if (!tipoTutoriaRecord) {
      throw new Error("Tipo de tutoría no encontrado");
    }

    // Inactivar asignaciones de alumnos para el tipo de tutoría específico
    const resultAlumno = await AsignacionTutorAlumno.update(
      { esActivo: false },
      {
        where: { fid_tipoTutoria: tipoTutoriaRecord.id_tipoTutoria },
        transaction,
        performedBy,
        individualHooks: true,
      }
    );

    // Inactivar asignaciones de tipo de tutoría
    const resultTipoTutoria = await AsignacionTipoTutoria.update(
      { esActivo: false },
      {
        where: { fid_tipoTutoria: tipoTutoriaRecord.id_tipoTutoria },
        transaction,
        performedBy,
        individualHooks: true,
      }
    );

    return {
      resultAlumno,
      resultTipoTutoria,
    };
  },
  async buscarTutoresPorTipoTutoria(tipoTutoria, inputSearch, page, pageSize) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;

    console.log(tipoTutoria);

    // Convertir tipoTutoria a un array si es un solo id
    const tipoTutoriaArray = Array.isArray(tipoTutoria)
      ? tipoTutoria
      : [tipoTutoria];

    let searchConditions = {};

    if (inputSearch) {
      searchConditions = {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
            [Op.like]: `%${inputSearch}%`
          }),
          { codigo: { [Op.like]: `%${inputSearch}%` } },
          { email: { [Op.like]: `%${inputSearch}%` } },
        ],
      };
    }

    const tutores = await AsignacionTipoTutoria.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: Usuario,
          as: "Tutor",
          attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "email",
            "codigo",
            "fid_programa",
            "fid_facultad",
          ],
          where: {
            ...searchConditions,
            esActivo: true, // Filtrar solo tutores activos
          },
          include: {
            model: Rol,
            as: "Roles",
            where: { nombre: "Tutor" }, // Filtrar solo los usuarios con rol de tutor
            through: { attributes: [], es_activo: true }, // Filtrar solo los roles activos
          },
        },
        {
          model: TipoTutoria,
          as: "TipoTutoria",
          attributes: ["id_tipoTutoria", "nombre"],
          where: {
            id_tipoTutoria: tipoTutoriaArray,
          },
        },
      ],
      where: {
        esTutor: true,
        esActivo: true, // Filtrar solo asignaciones de tutoría activas
      },
      distinct: true, // Asegurarse de que los resultados sean distintos
    });

    // Contar la cantidad de alumnos asignados a cada tutor
    const tutoresWithCount = await Promise.all(
      tutores.rows.map(async (asignacion) => {
        const alumnoCount = await AsignacionTutorAlumno.count({
          where: {
            fid_tutor: asignacion.Tutor.id_usuario,
            fid_tipoTutoria: asignacion.TipoTutoria.id_tipoTutoria,
            esActivo: true,
          },
        });

        return {
          Tutor: {
            id_usuario: asignacion.Tutor.id_usuario,
            nombres: asignacion.Tutor.nombres,
            primerApellido: asignacion.Tutor.primerApellido,
            email: asignacion.Tutor.email,
            codigo: asignacion.Tutor.codigo,
            fid_facultad: asignacion.Tutor.fid_facultad,
            cantAlumnos: alumnoCount,
          },
          TipoTutoria: {
            id: asignacion.TipoTutoria.id_tipoTutoria,
            nombre: asignacion.TipoTutoria.nombre,
          },
        };
      })
    );

    return {
      totalPages: Math.ceil(tutores.count / limit),
      currentPage: parseInt(page),
      totalTutores: tutores.count,
      tutores: tutoresWithCount,
    };
  },

  async listarTutoresYSolicitudes(
    idAlumno,
    pageSize,
    sortTutorBy,
    sortTutorOrder,
    sortSolicitudBy,
    sortSolicitudOrder,
    searchCriterias,
    userId
  ) {
    const limit = parseInt(pageSize);
    searchCriterias.page = parseInt(searchCriterias.page);
    searchCriterias.tipo = parseInt(searchCriterias.tipo);
    const offset = (searchCriterias.page - 1) * limit;

    // Condiciones de búsqueda para tutores
    let tutorWhereConditions = {};
    if (searchCriterias.nombreTutor) {
      tutorWhereConditions = {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
            [Op.like]: `%${searchCriterias.nombreTutor}%`
          }),
          { nombres: { [Op.like]: `%${searchCriterias.nombreTutor}%` } },
          { primerApellido: { [Op.like]: `%${searchCriterias.nombreTutor}%` } },
          { codigo: { [Op.like]: `%${searchCriterias.nombreTutor}%` } },
          { email: { [Op.like]: `%${searchCriterias.nombreTutor}%` } },
        ],
      };
    }

    console.log('Search criterias')
    console.log(searchCriterias);
    console.log('Tutor where conditions')
    console.log(tutorWhereConditions);

    // Obtener tutores asignados
    let tutoresAsignados = [];
    if (searchCriterias.tipo === 0 || searchCriterias.tipo === 1) {
      const asignaciones = await AsignacionTutorAlumno.findAll({
        where: { fid_alumno: idAlumno, esActivo: true },
        include: [
          {
            model: Usuario,
            as: "Tutor",
            where: tutorWhereConditions,
            attributes: [
              "id_usuario",
              "codigo",
              "nombres",
              "primerApellido",
              "email",
            ],
          },
          {
            model: TipoTutoria,
            as: "TipoTutoria",
            attributes: ["id_tipoTutoria", "nombre"],
          },
        ],
        order: sortTutorBy.map(sortValue=>[{ model: Usuario, as: "Tutor" }, sortValue, sortTutorOrder])
      });
      if(!asignaciones) throw new Error("Error al buscar las asignaciones (listarTutoresYSolicitudes)");
      tutoresAsignados = asignaciones.map((asignacion) => ({
        idTutor: asignacion.Tutor.id_usuario,
        codigoTutor: asignacion.Tutor.codigo,
        nombreTutor: asignacion.Tutor.nombres,
        primerApellidoTutor: asignacion.Tutor.primerApellido,
        correo: asignacion.Tutor.email,
        idTipoTutoria: asignacion.TipoTutoria.id_tipoTutoria,
        nombreTipoTutoria: asignacion.TipoTutoria.nombre,
        esSolicitud: 0,
        motivoRechazo: "",
        estado: "",
        fechaSolicitud: null,
        idSolicitud: null, // No es una solicitud, así que no tiene idSolicitud
        esSolicitado: asignacion.fid_solicitud ? "Solicitado" : "Asignado",
      }));
    }

    // Obtener solicitudes pendientes
    let solicitudesPendientes = [];
    if (searchCriterias.tipo === 0 || searchCriterias.tipo === 2) {
      const solicitudes = await SolicitudTutorFijo.findAll({
        where: {
          fid_alumno: idAlumno,
          fid_estadoSolicitud: 1, // Pendiente, En espera
          esActivo: 1,
        },
        include: [
          {
            model: Usuario,
            as: "Tutor",
            where: tutorWhereConditions,
            attributes: [
              "id_usuario",
              "codigo",
              "nombres",
              "primerApellido",
              "email",
            ],
          },
          {
            model: TipoTutoria,
            as: "TipoTutoria",
            attributes: ["id_tipoTutoria", "nombre"],
          },
        ],
        order: [[sortSolicitudBy, sortSolicitudOrder]],
      });

      solicitudesPendientes = solicitudes.map((solicitud) => ({
        idTutor: solicitud.Tutor.id_usuario,
        codigoTutor: solicitud.Tutor.codigo,
        nombreTutor: solicitud.Tutor.nombres,
        primerApellidoTutor: solicitud.Tutor.primerApellido,
        correo: solicitud.Tutor.email,
        idTipoTutoria: solicitud.TipoTutoria.id_tipoTutoria,
        nombreTipoTutoria: solicitud.TipoTutoria.nombre,
        esSolicitud: 1,
        motivoRechazo: solicitud.motivoRechazo || "",
        estado: "Pendiente",
        fechaSolicitud: solicitud.fechaCreacion,
        idSolicitud: solicitud.id_solicitud, // Agregar el id de la solicitud
        esSolicitado: null
      }));
    }

    // Concatenar listas y aplicar paginación
    let combinedList = [...tutoresAsignados, ...solicitudesPendientes];

    // Excluir los resultados que tienen userId igual a idTutor en el arreglo
    if (userId) {
      // Si me encuentro a mi mismo como idTutor, entonces guardo en una variable las tutoria en la que soy tutor
      const tutoriasAsignadas = combinedList.filter((item) => item.idTutor === userId);
      // Si me encuentro a mi mismo como idTutor, entonces elimino de la lista a mi mismo
      combinedList = combinedList.filter((item) => item.idTutor !== userId);
      // Si me encuentro a mi mismo como idTutor, entonces elimino los tutores del tipo de tutoria al que pertenezco
      combinedList = combinedList.filter((item) => !tutoriasAsignadas.some((tutoria) => tutoria.idTipoTutoria === item.idTipoTutoria));
    }

    const totalPages = Math.ceil(combinedList.length / limit);
    const paginatedList = combinedList.slice(offset, offset + limit);

    console.log('Combined list')
    console.log(combinedList);

    console.log('Paginated list')
    console.log(paginatedList);

    return {
      totalPages: totalPages,
      currentPage: parseInt(searchCriterias.page),
      totalUsuarios: combinedList.length,
      usuarios: paginatedList,
    };
  },

  async enviarCorreoRechazo(tutorId, alumnoId, tipoTutoriaId, motivoRechazo) {
    try {
      const tutor = await Usuario.findByPk(tutorId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!tutor) throw new Error("Tutor no encontrado");

      const alumno = await Usuario.findByPk(alumnoId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!alumno) throw new Error("Alumno no encontrado");

      const tipoTutoria = await TipoTutoria.findByPk(tipoTutoriaId, {
        attributes: ["nombre"],
      });
      if(!tipoTutoria) throw new Error("Tipo de tutoría no encontrado");
      //<p>Esta solicitud ha sido respondida por <strong>${tutor.nombres} ${tutor.primerApellido}</strong> ha sido rechazada.</p>
      const correoHTML = `
                <h1>Estimado(a) ${alumno.nombres} ${alumno.primerApellido},</h1>
                <p>Lamentamos informarle que su solicitud de asignación del tutor <strong>${tutor.nombres} ${tutor.primerApellido}</strong> para el tipo de tutoría <strong>${tipoTutoria.nombre}</strong> ha sido rechazada.</p>          
                <p><strong>Motivo del rechazo:</strong> ${motivoRechazo}</p>
                <p>Le invitamos a revisar las condiciones y a intentarlo nuevamente si lo desea.</p>
                <p>Saludos cordiales,</p>
                <p>Equipo de Soporte - Mentify</p>
            `;

      await transporter.sendMail({
        from: '"Equipo de Soporte" <mentify.soft@gmail.com>',
        to: alumno.email,
        subject: "Rechazo de Solicitud de Tutoría",
        html: correoHTML,
      });

      console.log(`Correo de rechazo enviado a ${tutor.email}`);
    } catch (error) {
      throw new Error("Error al enviar correo de rechazo: " + error.message);
    }
  },
  async enviarCorreoAceptado(tutorId, alumnoId, tipoTutoriaId) {
    try {
      const tutor = await Usuario.findByPk(tutorId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!tutor) throw new Error("Tutor no encontrado");

      const alumno = await Usuario.findByPk(alumnoId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!alumno) throw new Error("Alumno no encontrado");

      const tipoTutoria = await TipoTutoria.findByPk(tipoTutoriaId, {
        attributes: ["nombre"],
      });
      if(!tipoTutoria) throw new Error("Tipo de tutoría no encontrado");
      //<p>Esta solicitud ha sido respondida por <strong>${tutor.nombres} ${tutor.primerApellido}</strong> ha sido aceptada.</p>
      const correoHTML = `
                <h1>Estimado(a) ${alumno.nombres} ${alumno.primerApellido},</h1>
                <p>Se le informa que su solicitud de asignación del tutor <strong>${tutor.nombres} ${tutor.primerApellido}</strong> para el tipo de tutoría <strong>${tipoTutoria.nombre}</strong> ha sido aceptada.</p>          
                <p>Ahora puede reservar citas con el tutor escogido para este tipo de tutoría.</p>
                <p>Saludos cordiales,</p>
                <p>Equipo de Soporte - Mentify</p>
            `;
      try{
        await transporter.sendMail({
          from: '"Equipo de Soporte" <mentify.soft@gmail.com>',
          to: alumno.email,
          subject: "Solicitud de Tutoría Aceptada",
          html: correoHTML,
        });
      } catch (error) {
        throw new Error("Error al enviar correo de aceptación: " + error.message);
      }
      
      console.log(`Correo de aceptación enviado a ${tutor.email}`);
    } catch (error) {
      throw new Error("Error al enviar correo de aceptación: " + error.message);
    }
  },
  async enviarCorreoTutorAlumnoAsignado(tutorId, alumnoId, tipoTutoriaId) {
    try {
      const tutor = await Usuario.findByPk(tutorId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!tutor) throw new Error("Tutor no encontrado");

      const alumno = await Usuario.findByPk(alumnoId, {
        attributes: ["nombres", "primerApellido", "email"],
      });
      if(!alumno) throw new Error("Alumno no encontrado");

      const tipoTutoria = await TipoTutoria.findByPk(tipoTutoriaId, {
        attributes: ["nombre"],
      });
      if(!tipoTutoria) throw new Error("Tipo de tutoría no encontrado");

      const correoHTML = `
                <h1>Estimado(a) ${alumno.nombres} ${alumno.primerApellido},</h1>
                <p>Se le informa que se la ha asignado el tutor <strong>${tutor.nombres} ${tutor.primerApellido}</strong> para el tipo de tutoría <strong>${tipoTutoria.nombre}</strong>.</p>
                <p>Ahora puede reservar citas con el tutor asignado para este tipo de tutoría.</p>
                <p>Saludos cordiales,</p>
                <p>Equipo de Soporte - Mentify</p>
            `;

      await transporter.sendMail({
        from: '"Equipo de Soporte" <mentify.soft@gmail.com>',
        to: alumno.email,
        subject: "Solicitud de Tutoría Aceptada",
        html: correoHTML,
      });

      console.log(`Correo de aceptación enviado a ${tutor.email}`);
    } catch (error) {
      throw new Error("Error al enviar correo de aceptación: " + error.message);
    }
  },
  async cargarUsuariosTutoria(idTipoTutoria, alumnos, performedBy) {
    const resultados = [];

    for (const alumno of alumnos) {
      try {
        const usuario = await Usuario.findOne({
          where: { codigo: alumno.codigo, rol: "Alumno" },
        });

        if (!usuario) {
          resultados.push({
            codigo: alumno.codigo,
            mensaje: "Alumno no existe",
          });
          continue;
        }

        const asignacion = await AsignacionTipoTutoria.findOne({
          where: {
            fid_usuario: usuario.id_usuario,
            fid_tipoTutoria: idTipoTutoria,
          },
        });

        if (asignacion) {
          if (!asignacion.esActivo) {
            await asignacion.update({ esActivo: true }, { performedBy, individualHooks: true });
            resultados.push({
              codigo: alumno.codigo,
              mensaje: "Alumno reactivado en la tutoría",
            });
          } else {
            resultados.push({
              codigo: alumno.codigo,
              mensaje: "Alumno ya está asignado a la tutoría",
            });
          }
        } else {
          await AsignacionTipoTutoria.create({
            fid_usuario: usuario.id_usuario,
            fid_tipoTutoria: idTipoTutoria,
            esActivo: true,
          } , { performedBy, individualHooks: true});
          resultados.push({
            codigo: alumno.codigo,
            mensaje: "Alumno asignado a la tutoría",
          });
        }
      } catch (error) {
        console.error(
          "Error procesando el alumno con código:",
          alumno.codigo,
          error
        );
        resultados.push({
          codigo: alumno.codigo,
          mensaje: "Error procesando el alumno",
        });
      }
    }

    return resultados;
  },
  async listarUsuariosPorTipoTutoria(
    searchValue,
    idTipoTutoria,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;

    let searchConditions = {};

    if (searchValue) {
      searchConditions = {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
            [Op.like]: `%${searchValue}%`
          }),
          /*{ nombres: { [Op.like]: `%${searchValue}%` } },
          { primerApellido: { [Op.like]: `%${searchValue}%` } },*/
          { codigo: { [Op.like]: `%${searchValue}%` } },
          { email: { [Op.like]: `%${searchValue}%` } },
        ],
      };
    }

    const asignaciones = await AsignacionTipoTutoria.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ["esTutor"],
      where: {
        fid_tipoTutoria: idTipoTutoria,
        esActivo: true,
      },
      include: [
        {
          model: Usuario,
          as: "Tutor", // ! Alias Incorrecto en el Modelo, deberia ser Usuario
          attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "email",
            "codigo",
          ],
          where: {
            ...searchConditions,
            esActivo: true,
          },
        },
      ],
      order: [["Tutor", "nombres", "ASC"]],
    });

    const usuariosWithRoles = asignaciones.rows.map((asignacion) => ({
      id: asignacion.Tutor.id_usuario,
      name: asignacion.Tutor.nombres,
      primerApellido: asignacion.Tutor.primerApellido,
      code: asignacion.Tutor.codigo,
      email: asignacion.Tutor.email,
      rol: asignacion.esTutor === true ? "Tutor" : "Alumno",
    }));

    return {
      message: "Usuarios listados con Ã©xito",
      data: {
        totalPages: Math.ceil(asignaciones.count / limit),
        currentPage: parseInt(page),
        totalUsuarios: asignaciones.count,
        usuarios: usuariosWithRoles,
      },
    };
  },

  async listarUsuariosPorCoordinador(
    idCoord,
    searchValue,
    currentRole,
    page,
    pageSize,
    idTipoTutoria
  ) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;

    const coordinador = await Usuario.findByPk(idCoord, {
      include: [
        {
          model: Rol,
          as: "Roles",
          where: {
            nombre: { [Op.like]: "%Coordinador%" },
            es_activo: true,
          },
          through: { attributes: [], where: { es_activo: true }},
        },
      ],
    });

    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }

    const rolCoordinador = coordinador.Roles.find((rol) =>
      rol.nombre.includes("Coordinador")
    );
    if (!rolCoordinador) {
      throw new Error("El usuario no tiene el rol de coordinador");
    }

    let searchConditions = {};
    if (searchValue) {
      searchConditions = {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido'), ' ', Sequelize.col('segundoApellido')),
            { [Op.like]: `%${searchValue}%` }
          ),
          { codigo: { [Op.like]: `%${searchValue}%` } },
          { email: { [Op.like]: `%${searchValue}%` } },
        ],
      };
    }

    let whereConditions = { esActivo: true };
    if (searchValue) {
      whereConditions = { ...whereConditions, ...searchConditions };
    }

    if (rolCoordinador.nombre === "Coordinador de Facultad") {
      const facultad = await Facultad.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      });
      if (currentRole === "Alumno") {
        whereConditions = {
          ...whereConditions,
          fid_facultad: facultad.id_facultad,
        };
      }
    } else if (rolCoordinador.nombre === "Coordinador de Programa") {
      const programa = await Programa.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      });
      if (currentRole === "Alumno") {
        whereConditions = {
          ...whereConditions,
          fid_programa: programa.id_programa,
        };
      }
    }

    let rolConditions = {};
    if (currentRole === "Alumno") {
      rolConditions = { nombre: "Alumno", es_activo: true };
    } else if (currentRole === "Tutor") {
      rolConditions = { nombre: "Tutor", es_activo: true };
    } else {
      rolConditions = {
        [Op.or]: [
          { nombre: "Alumno", es_activo: true },
          { nombre: "Tutor", es_activo: true },
        ],
      };
    }

    // Obtener los alumnos que están asignados activamente a la tutoría específica
    const alumnosAsignadosActivos = await AsignacionTipoTutoria.findAll({
      where: {
        fid_tipoTutoria: idTipoTutoria,
        esActivo: true,
      },
      attributes: ["fid_usuario"],
    });

    const alumnosAsignadosActivosIds = alumnosAsignadosActivos.map(
      (asignacion) => asignacion.fid_usuario
    );

    const usuarios = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        ...whereConditions,
        id_usuario: {
          [Op.notIn]: alumnosAsignadosActivosIds,
        },
      },
      include: [
        {
          model: Rol,
          as: "Roles",
          where: rolConditions,
          through: { attributes: [], where: { es_activo: true } },
        },
        {
          model: AsignacionTipoTutoria,
          as: "AsignacionesTipoTutoria",
          required: false, // Incluye usuarios sin asignación de tipo de tutoría
          where: {
            [Op.or]: [
              { fid_tipoTutoria: { [Op.ne]: idTipoTutoria } },
              { fid_tipoTutoria: idTipoTutoria, esActivo: false },
            ],
          },
          include: [
            {
              model: TipoTutoria,
              as: "TipoTutoria",
            },
          ],
        },
        {
          model: Programa,
          as: "Programa",
          attributes: ["nombre"],
        },
      ],
      distinct: true,
      order: [["nombres", "ASC"]],
    });

    const formattedUsers = usuarios.rows.map((usuario) => ({
      id: usuario.id_usuario,
      nombres: usuario.nombres,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      email: usuario.email,
      codigo: usuario.codigo,
      avatar: usuario.imagen,
      roles: usuario.Roles.map((rol) => rol.nombre),
      programa: usuario.Programa ? usuario.Programa.nombre : null,
      esActivo: usuario.esActivo,
    }));

    return {
      message: "Usuarios listados con éxito",
      data: {
        totalPages: Math.ceil(usuarios.count / limit),
        currentPage: parseInt(page),
        totalUsuarios: usuarios.count,
        usuarios: formattedUsers,
      },
    };
  },

  async listarAlumnosAsiganadosTutorFijo(
    idTutor,
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchCriterias
  ) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;
  
    // Construir condiciones de búsqueda
    let searchOptions = {};
    const andConditions = [];
  
    searchCriterias.forEach((criteria) => {
      if (criteria.field) {
        andConditions.push(
          Sequelize.where(
            Sequelize.fn(
              'concat',
              Sequelize.col('nombres'),
              ' ',
              Sequelize.col('primerApellido')
            ),
            {
              [Op.like]: `%${criteria.field}%`,
            }
          ),
          { nombres: { [Op.like]: `%${criteria.field}%` } },
          { primerApellido: { [Op.like]: `%${criteria.field}%` } },
          { email: { [Op.like]: `%${criteria.field}%` } },
          { codigo: { [Op.like]: `%${criteria.field}%` } }
        );
      }
    });
  
    if (andConditions.length > 0) {
      searchOptions = {
        [Op.or]: andConditions,
      };
    }
  
    // Manejo de un solo idTipoTutoria o un arreglo de ids
    const idTipoTutoria = searchCriterias.find(
      (criteria) => criteria.idTipoTutoria
    )?.idTipoTutoria;
    const idsTipoTutoria = Array.isArray(idTipoTutoria)
      ? idTipoTutoria
      : [idTipoTutoria];
  
    const asignaciones = await AsignacionTutorAlumno.findAll({
      where: {
        fid_tutor: idTutor,
        fid_tipoTutoria: {
          [Op.in]: idsTipoTutoria,
        },
        esActivo: true
      },
      include: [
        {
          model: Usuario,
          as: "Alumno",
          where: {
            ...searchOptions,
            esActivo: true, // Solo alumnos activos
          },
          attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "segundoApellido",
            "email",
            "codigo",
          ],
          include: [
            {
              model: Facultad,
              as: "Facultad",
              attributes: ["nombre"],
            },
            {
              model: Programa,
              as: "Programa",
              attributes: ["nombre"],
            },
          ],
        },
      ],
      order: [[{ model: Usuario, as: "Alumno" }, sortBy, sortOrder]],
    });
  
    // Eliminar duplicados
    const alumnosMap = new Map();
    asignaciones.forEach((asignacion) => {
      const alumno = asignacion.Alumno;
      if (!alumnosMap.has(alumno.id_usuario)) {
        alumnosMap.set(alumno.id_usuario, {
          idAlumno: alumno.id_usuario,
          nombreAlumno: alumno.nombres,
          primerApellido: alumno.primerApellido,
          segundoApellido: alumno.segundoApellido,
          codigoAlumno: alumno.codigo,
          correo: alumno.email,
          nombreFacultad: alumno.Facultad ? alumno.Facultad.nombre : null,
          nombrePrograma: alumno.Programa ? alumno.Programa.nombre : null,
        });
      }
    });
  
    const alumnos = Array.from(alumnosMap.values());
    // ordenar por nombreAlumno asc
    alumnos.sort((a, b) => {
      if (a.nombreAlumno < b.nombreAlumno) {
        return -1;
      }
      if (a.nombreAlumno > b.nombreAlumno) {
        return 1;
      }
      return 0;
    });

    const paginatedAlumnos = alumnos.slice(offset, offset + limit);
  
    return {
      message: "Usuarios listados con éxito",
      data: {
        totalPages: Math.ceil(alumnos.length / limit),
        currentPage: page,
        totalUsuarios: alumnos.length,
        usuarios: paginatedAlumnos,
      },
    };
  },
  

  async listarAlumnosTutoriaSinTutor(
    id_Tutor,
    id_tipoTutoria,
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchValue
  ) {
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    // Obtener el id del rol de Alumno
    const alumnoRol = await Rol.findOne({
      where: { nombre: "Alumno" },
      attributes: ["id_rol"],
    });

    if (!alumnoRol) {
      throw new Error("Rol de Alumno no encontrado");
    }

    // Obtener los usuarios que pertenecen al tipo de tutoría y que tienen el rol de Alumno
    const alumnosTutoria = await AsignacionTipoTutoria.findAll({
      where: {
        fid_tipoTutoria: id_tipoTutoria,
        esActivo: true,
        esTutor: false,
      },
      attributes: ["fid_usuario"],
    });

    const alumnosIds = alumnosTutoria.map(
      (asignacion) => asignacion.fid_usuario
    );

    // Filtrar solo los alumnos que tienen el rol de Alumno
    const alumnosConRol = await Roles_Usuario.findAll({
      where: {
        id_usuario: {
          [Op.in]: alumnosIds,
        },
        id_rol: alumnoRol.id_rol,
        es_activo: true,
      },
      attributes: ["id_usuario"],
    });
    if(!alumnosConRol) throw new Error("Error al buscar los usuarios con rol de Alumno");

    const alumnosConRolIds = alumnosConRol.map((rol) => rol.id_usuario);

    // Obtener los alumnos que ya están asignados a cualquier tutor en la tutoría específica (activos o inactivos)
    const alumnosAsignados = await AsignacionTutorAlumno.findAll({
      where: {
        fid_tipoTutoria: id_tipoTutoria,
        fid_alumno: {
          [Op.in]: alumnosConRolIds,
        },
      },
      attributes: ["fid_alumno", "esActivo"],
    });
    if(!alumnosAsignados) throw new Error("Error al buscar las asignaciones de tutor-alumno" + 
      "UsuarioService.listarAlumnosTutoriaSinTutor"
    );

    const alumnosAsignadosIds = alumnosAsignados.map(
      (asignacion) => asignacion.fid_alumno
    );
    console.log(alumnosAsignadosIds);
    const alumnosAsignadosInactivosIds = alumnosAsignados
      .filter((asignacion) => !asignacion.esActivo)
      .map((asignacion) => asignacion.fid_alumno);
    console.log(alumnosAsignadosInactivosIds);

    const alumnosAsignadosActivosIds = alumnosAsignados
      .filter((asignacion) => asignacion.esActivo)
      .map((asignacion) => asignacion.fid_alumno);
    console.log(alumnosAsignadosActivosIds);

    const alumnosUnicosInactivosIds = alumnosAsignadosInactivosIds.filter(
      (id) => !alumnosAsignadosActivosIds.includes(id)
    );
    console.log(alumnosUnicosInactivosIds);
    // Filtrar los alumnos que no están asignados a ningún tutor para la tutoría específica o que están inactivos
    const alumnosSinTutorIds = alumnosConRolIds.filter(
      (id) =>
        !alumnosAsignadosIds.includes(id) ||
        alumnosUnicosInactivosIds.includes(id)
    );

    // Agregar condiciones de búsqueda
    let searchConditions = {};
    if (searchValue) {
      searchConditions = {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido'), ' ', Sequelize.col('segundoApellido')),
            { [Op.like]: `%${searchValue}%` }
          ),
          { email: { [Op.like]: `%${searchValue}%` } },
          { codigo: { [Op.like]: `%${searchValue}%` } },
        ],
      };
    }

    // Obtener la información de los alumnos filtrados
    const alumnos = await Usuario.findAndCountAll({
      where: {
        id_usuario: {
          [Op.in]: alumnosSinTutorIds,
        },
        ...searchConditions,
      },
      include: [
        {
          model: Programa,
          as: "Programa",
          attributes: ["nombre"],
        },
      ],
      attributes: [
        "id_usuario",
        "nombres",
        "primerApellido",
        "segundoApellido",
        "email",
        "codigo",
        "esActivo",
        "imagen",
      ],
      order: [["nombres", "ASC"]],
      limit: limit,
      offset: offset,
    });
    if(!alumnos) throw new Error("Error al obtener la informacion de alumnos");

    const alumnosData = alumnos.rows.map((alumno) => ({
      id: alumno.id_usuario,
      nombres: alumno.nombres,
      primerApellido: alumno.primerApellido,
      segundoApellido: alumno.segundoApellido,
      avatar: alumno.imagen,
      email: alumno.email,
      codigo: alumno.codigo,
      programa: alumno.Programa ? alumno.Programa.nombre : null,
      esActivo: alumno.esActivo,
    }));

    const totalAlumnos = alumnosData.length;
    const totalPages = Math.ceil(totalAlumnos / limit);

    return {
      totalPages: totalPages,
      currentPage: parseInt(page),
      totalAlumnos: totalAlumnos,
      alumnos: alumnosData,
    };
  },
  //DESUSO DE ESTA COSA:
  async asignarAlumnoATipoTutoria(
    fid_usuario,
    nameRol,
    fid_tipoTutoria,
    transaction
  ) {
    const asignacionExistente = await AsignacionTipoTutoria.findOne({
      where: { fid_usuario, fid_tipoTutoria },
      transaction,
    });

    if (asignacionExistente) {
      // Si la asignación ya existe y está inactiva, activarla
      if (!asignacionExistente.esActivo) {
        asignacionExistente.esActivo = true;
        await asignacionExistente.save({ transaction });
      }
    } else {
      // Crear nueva asignación si no existe
      await AsignacionTipoTutoria.create(
        {
          fid_usuario,
          fid_tipoTutoria,
          esActivo: true,
        },
        { transaction }
      );
    }
  },
  async listarTiposTutoriaPorTutor(idTutor) {
    // Verificar si el tutor tiene el rol activo de 'Tutor'
    const tutor = await Usuario.findByPk(idTutor, {
        include: [
            {
                model: Rol,
                as: "Roles",
                where: { nombre: "Tutor", es_activo: true },
                through: { attributes: [] },
            },
        ],
    });

    if (!tutor) {
        throw new Error("Tutor no encontrado o no tiene el rol activo de Tutor");
    }

    // Buscar las asignaciones activas de tipo de tutoría para el tutor, excluyendo las de tipo "Variable"
    const asignaciones = await AsignacionTipoTutoria.findAll({
      where: {
          fid_usuario: idTutor,
          esActivo: true,
      },
      include: [
          {
              model: TipoTutoria,
              as: "TipoTutoria",
              attributes: ["id_tipoTutoria", "nombre"],
              required: true, // Ensure the join is an INNER JOIN
              include: [
                  {
                      model: TipoTutor,
                      as: "TipoTutor",
                      where: { id_tipoTutor: { [Op.ne]: 1 } },
                      attributes: [],
                      required: true, // Ensure the join is an INNER JOIN
                  },
              ],
          },
      ],
      order: [[{ model: TipoTutoria, as: "TipoTutoria" }, "nombre", "ASC"]],
  });
  

    // Formatear la respuesta
    const tiposTutoria = asignaciones.map((asignacion) => ({
        id: asignacion.TipoTutoria.id_tipoTutoria,
        nombreTutoria: asignacion.TipoTutoria.nombre,
    }));

    return {
        message: "Tipos de tutoría listados con éxito",
        data: tiposTutoria,
    };
},

  async registrarResponsableTutoria({
    codigo,
    nombre,
    primerApellido,
    segundoApellido,
    correo,
    idFacultad,
    performedBy
  }) {
    idFacultad = parseInt(idFacultad);
    const saltRounds = 10;
    const password = generarCadenaAleatoria(10);
    const avatarUrl = generateInitialsAvatar(nombre);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let aux = codigo.toString();
    while (aux.length < 8) {
      aux = "0" + aux;
    }
    codigo = aux;

    // Validar si ya existe un usuario con el mismo código
    const usuarioExistentePorCodigo = await Usuario.findOne({
      where: { codigo },
    });
    if (usuarioExistentePorCodigo) {
      throw new Error("Ya existe un usuario con el mismo código");
    }

    // Validar si ya existe un usuario con el mismo correo
    const usuarioExistentePorCorreo = await Usuario.findOne({
      where: { email: correo },
    });
    if (usuarioExistentePorCorreo) {
      throw new Error("Ya existe un usuario con el mismo correo");
    }

    // Validar si ya existe un responsable de tutoría para la misma facultad
    const responsableExistentePorFacultad = await Usuario.findOne({
      include: [
        {
          model: Rol,
          as: "Roles",
          where: { nombre: "Responsable de Bienestar" },
          through: { attributes: [] },
        },
      ],
      where: { fid_facultad: idFacultad, esActivo: true },
    });

    if (responsableExistentePorFacultad) {
      throw new Error(
        "Ya existe un responsable de Bienestar para la facultad seleccionada"
      );
    }
    
    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      codigo,
      nombres: nombre,
      primerApellido,
      segundoApellido,
      email: correo,
      contrasenha: hashedPassword,
      imagen: avatarUrl,
      esActivo: true,
      fid_facultad: idFacultad,
    }, { performedBy});

    // Obtener el rol de "Responsable de Tutoría"
    const rolResponsable = await Rol.findOne({
      where: { nombre: "Responsable de Bienestar" },
    });
    if (!rolResponsable) {
      throw new Error('Rol "Responsable de Bienestar" no encontrado');
    }

    // Asignar el rol al usuario
    await Roles_Usuario.create({
      id_usuario: nuevoUsuario.id_usuario,
      id_rol: rolResponsable.id_rol,
      es_activo: true,
    },
  
    { performedBy });

    if (nuevoUsuario) {
      try {
        await UsuarioService.envioCorreo(nuevoUsuario, password);
      } catch (error) {
        console.error("Error al enviar correo:", error);
      }
    }

    return {
      codigo: nuevoUsuario.codigo,
      nombre: nuevoUsuario.nombres,
      primerApellido: nuevoUsuario.primerApellido,
      segundoApellido: nuevoUsuario.segundoApellido,
      correo: nuevoUsuario.email,
      idFacultad: nuevoUsuario.fid_facultad,
    };
  },

  async listarResponsableTutoria() {
    const responsables = await Usuario.findAll({
      include: [
        {
          model: Rol,
          as: "Roles",
          where: { nombre: "Responsable de Bienestar", es_activo: true },
          through: { attributes: [] },
        },
        {
          model: Facultad, // Asumiendo que hay una relación definida entre Usuario y Facultad
          as: "Facultad",
          attributes: ["nombre", "id_facultad"], // Incluyendo solo el nombre de la facultad
        },
      ],
      attributes: [
        "codigo",
        "nombres",
        "primerApellido",
        "segundoApellido",
        "email",
        "esActivo",
      ],
      order: [
        ["nombres", "ASC"],
      ]
    });

    console.log('estos son los responsabels:');
    console.log(responsables);

    if (!responsables || responsables.length === 0) {
      return [];
    }

    return responsables.map((responsable) => ({
      codigo: responsable.codigo,
      nombre: responsable.nombres,
      primerApellido: responsable.primerApellido,
      segundoApellido: responsable.segundoApellido,
      correo: responsable.email,
      idFacultad: responsable.Facultad
        ? responsable.Facultad.id_facultad
        : null,
      facultad: responsable.Facultad ? responsable.Facultad.nombre : null,
      esActivo: responsable.esActivo,
    }));
  },
  async editarResponsableTutoria({
    codigoNuevo,
    codigo,
    nombre,
    primerApellido,
    segundoApellido,
    correo,
    correoNuevo,
    idFacultad,
    idFacultadNuevo,
    performedBy
  }) {
    let aux = codigo.toString();
    while (aux.length < 8) {
      aux = "0" + aux;
    }
    codigo = aux;

    let aux1 = codigoNuevo.toString();
    while (aux1.length < 8) {
      aux1 = "0" + aux1;
    }
    codigoNuevo = aux1;

    const responsable = await Usuario.findOne({
      where: { codigo },
      include: [
        {
          model: Rol,
          as: "Roles",
          where: { nombre: "Responsable de Bienestar" },
          through: { attributes: [] },
        },
      ],
    });
    console.log("RESPONSABLEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",responsable);
    if (!responsable) {
      throw new Error("Responsable de Bienestar no encontrado");
    }

    // Validar si ya existe un usuario con el mismo código
    if (codigoNuevo !== codigo) {
      const usuarioExistentePorCodigo = await Usuario.findOne({
        where: { codigo: codigoNuevo },
      });
      if (usuarioExistentePorCodigo) {
        throw new Error("Ya existe un usuario con el mismo código");
      }
    }

    // Validar si ya existe un usuario con el mismo correo
    if (correoNuevo !== correo) {
      const usuarioExistentePorCorreo = await Usuario.findOne({
        where: { email: correoNuevo },
      });
      if (usuarioExistentePorCorreo) {
        throw new Error("Ya existe un usuario con el mismo correo");
      }
    }

    console.log('el id de la facultad nueva es: ', idFacultadNuevo);

    if (/^\d+$/.test(idFacultadNuevo)){
      if (idFacultadNuevo !== idFacultad) {
        // Validar si ya existe un responsable de tutoría para la misma facultad
        const responsableExistentePorFacultad = await Usuario.findOne({
          include: [
            {
              model: Rol,
              as: "Roles",
              where: { nombre: "Responsable de Bienestar" },
              through: { attributes: [] },
            },
          ],
          where: { fid_facultad: idFacultadNuevo, esActivo: true },
        });
        if (responsableExistentePorFacultad) {
          throw new Error(
            "Ya existe un responsable de Bienestar para la facultad seleccionada"
          );
        }
      }
    } else {
      idFacultadNuevo = idFacultad;
    }

    await responsable.update({
      nombres: nombre,
      primerApellido,
      segundoApellido,
      email: correoNuevo,
      codigo: codigoNuevo,
      fid_facultad: idFacultadNuevo,
    },
    { performedBy, individualHooks: true });

    return {
      codigo: responsable.codigo,
      nombre: responsable.nombres,
      primerApellido: responsable.primerApellido,
      segundoApellido: responsable.segundoApellido,
      correo: responsable.email,
      idFacultad: responsable.fid_facultad,
    };
  },

  async eliminarResponsableTutoria(codigo, performedBy) {
    const responsable = await Usuario.findOne({
      where: { codigo },
      include: [
        {
          model: Rol,
          as: "Roles",
          where: { nombre: "Responsable de Bienestar" },
          through: { attributes: [] },
        },
      ],
    });

    if (!responsable) {
      return {}; // Devolver vacío si no se encuentra el responsable
    }

    // Obtener el rol de "Responsable de Tutoría"
    const rolResponsable = await Rol.findOne({
      where: { nombre: "Responsable de Bienestar" },
    });
    if (!rolResponsable) {
      throw new Error('Rol "Responsable de Bienestar" no encontrado');
    }

    // Actualizar el estado del usuario a inactivo
    await responsable.update({ esActivo: false }, { performedBy });

    // Cambiar esActivo a false en la tabla Roles_Usuario para el rol específico
    await Roles_Usuario.update(
      { es_activo: false },
      {
        where: {
          id_usuario: responsable.id_usuario,
          id_rol: rolResponsable.id_rol,
        },
        individualHooks: true,
        performedBy
      }
    );

    return {
      codigo: responsable.codigo,
      nombre: responsable.nombres,
      primerApellido: responsable.primerApellido,
      segundoApellido: responsable.segundoApellido,
      correo: responsable.email,
    };
  },

  async activarResponsableTutoria(codigo, performedBy) {
    try {
      const responsable = await Usuario.findOne({
        where: { codigo },
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { nombre: "Responsable de Bienestar" },
            through: { attributes: [] },
          },
        ],
      });

      if (!responsable) {
        return {}; // Devolver vacío si no se encuentra el responsable
      }

      // Obtener el rol de "Responsable de Tutoría"
      const rolResponsable = await Rol.findOne({
        where: { nombre: "Responsable de Bienestar" },
      });
      if (!rolResponsable) {
        throw new Error('Rol "Responsable de Bienestar" no encontrado');
      }

      console.log('fid facultad: ' + responsable.fid_facultad);

      // Verificar si ya existe un usuario activo con la misma id_facultad y el rol de tutoría
      const usuarioExistente = await Usuario.findOne({
        where: {
          fid_facultad: responsable.fid_facultad,
          esActivo: true,
        },
        include: [
          {
            model: Rol,
            as: "Roles",
            where: {
              id_rol: 7,
              es_activo: true,
            },
          },
        ],
      });

      console.log(usuarioExistente);

      if (usuarioExistente) {
        throw new Error(
          "Ya existe un responsable de Bienestar activo para esta facultad."
        );
      }

      // Actualizar el estado del usuario a activo
      await responsable.update({ esActivo: true }, { performedBy });

      // Cambiar esActivo a true en la tabla Roles_Usuario para el rol específico
      await Roles_Usuario.update(
        { es_activo: true },
        {
          where: {
            id_usuario: responsable.id_usuario,
            id_rol: rolResponsable.id_rol,
          },
          individualHooks: true,
          performedBy
        }
      );

      return {
        codigo: responsable.codigo,
        nombre: responsable.nombres,
        primerApellido: responsable.primerApellido,
        segundoApellido: responsable.segundoApellido,
        correo: responsable.email,
      };
    } catch (error) {
      console.error("Error activando responsable de Bienestar:", error);
      return { error: error.message };
    }
  },
  async agregarRolTutor(idAlumno, performedBy) {
    const alumno = await Usuario.findByPk(idAlumno);
    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const rolTutor = await Rol.findOne({ where: { nombre: "Tutor" } });
    if (!rolTutor) {
      throw new Error("Rol de Tutor no encontrado");
    }

    const rolUsuario = await Roles_Usuario.create({
      id_usuario: idAlumno,
      id_rol: rolTutor.id_rol,
      es_activo: true,
    }, { performedBy });

    return rolUsuario;
  },

  async desactivarRolTutor(idAlumno, performedBy) {
    const alumno = await Usuario.findByPk(idAlumno);
    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const rolTutor = await Rol.findOne({ where: { nombre: "Tutor" } });
    if (!rolTutor) {
      throw new Error("Rol de Tutor no encontrado");
    }

    const rolUsuario = await Roles_Usuario.findOne({
      where: {
        id_usuario: idAlumno,
        id_rol: rolTutor.id_rol,
      },
    });

    if (!rolUsuario) {
      throw new Error("El alumno no tiene el rol de Tutor");
    }

    await rolUsuario.update({ es_activo: false }, {performedBy});

    return rolUsuario;
  },

  async agregarRolAlumno(idTutor, performedBy) {
    const tutor = await Usuario.findByPk(idTutor);
    if (!tutor) {
      throw new Error("Tutor no encontrado");
    }

    const rolAlumno = await Rol.findOne({ where: { nombre: "Alumno" } });
    if (!rolAlumno) {
      throw new Error("Rol de Alumno no encontrado");
    }

    const rolUsuario = await Roles_Usuario.create({
      id_usuario: idTutor,
      id_rol: rolAlumno.id_rol,
      es_activo: true,
    }, { performedBy });

    return rolUsuario;
  },

  async desactivarRolAlumno(idTutor, performedBy) {
    const tutor = await Usuario.findByPk(idTutor);
    if (!tutor) {
      throw new Error("Tutor no encontrado");
    }

    const rolAlumno = await Rol.findOne({ where: { nombre: "Alumno" } });
    if (!rolAlumno) {
      throw new Error("Rol de Alumno no encontrado");
    }

    const rolUsuario = await Roles_Usuario.findOne({
      where: {
        id_usuario: idTutor,
        id_rol: rolAlumno.id_rol,
      },
    });

    if (!rolUsuario) {
      throw new Error("El tutor no tiene el rol de Alumno");
    }

    await rolUsuario.update({ es_activo: false }, { performedBy });

    return rolUsuario;
  },

  async asignarUsuarioTipoTutoriaPorRol(idUsuario, idTipoTutoria, esTutor, performedBy) {
    // Buscar la asignación existente
    let asignacion = await AsignacionTipoTutoria.findOne({
      where: {
        fid_usuario: idUsuario,
        fid_tipoTutoria: idTipoTutoria,
      },
    });

    if (asignacion) {
      // Si la asignación existe, activarla
      await asignacion.update({ esActivo: true, esTutor }, { performedBy });
    } else {
      // Si no existe, crear una nueva asignación
      asignacion = await AsignacionTipoTutoria.create({
        fid_usuario: idUsuario,
        fid_tipoTutoria: idTipoTutoria,
        esTutor,
        esActivo: true,
      }, { performedBy });
    }

    return asignacion;
  },
  async listarUsuariosPorCodigoRol(codigo, rolUs, idCoord) {
    try {
      // Verificar si el rol existe y es activo
      const rol = await Rol.findOne({
        where: {
          nombre: rolUs,
          es_activo: true,
        },
      });

      if (!rol) {
        return {
          message: `El rol ${rolUs} no existe o no está activo`,
          status: "error",
        };
      }

      // Obtener los datos del coordinador
      const coordinador = await Usuario.findByPk(idCoord, {
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { nombre: { [Op.like]: "%Coordinador%" }, es_activo: true },
            through: { attributes: [] },
          },
          {
            model: Facultad,
            as: "Facultad",
            attributes: ["id_facultad", "nombre"],
          },
          {
            model: Programa,
            as: "Programa",
            attributes: ["id_programa", "nombre"],
          },
        ],
      });

      if (!coordinador) {
        return {
          message: "Coordinador no encontrado",
          status: "error",
        };
      }

      const rolCoordinador = coordinador.Roles.find((rol) =>
        rol.nombre.includes("Coordinador")
      );
      if (!rolCoordinador) {
        return {
          message: "El usuario no tiene el rol de coordinador",
          status: "error",
        };
      }

      // Verificar si el usuario existe con el código proporcionado
      const usuario = await Usuario.findOne({
        where: { codigo: codigo, esActivo: true },
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { id_rol: rol.id_rol },
            through: { attributes: ["es_activo"] },
          },
          {
            model: Facultad,
            as: "Facultad",
            attributes: ["id_facultad", "nombre"],
          },
          {
            model: Programa,
            as: "Programa",
            attributes: ["id_programa", "nombre"],
          },
        ],
      });

      if (!usuario) {
        return {
          message: `El usuario con el código ${codigo} no existe o no está activo`,
          status: "error",
        };
      }

      // Verificar si el usuario tiene el rol solicitado y está activo en la relación
      const tieneRolActivo = usuario.Roles.some(
        (rol) => rol.Roles_Usuario.es_activo
      );

      if (!tieneRolActivo) {
        return {
          message: `El usuario con el código ${codigo} no tiene el rol ${rolUs} activo`,
          status: "error",
        };
      }

      // Validar facultad o programa si el usuario es "Alumno"
      if (rolUs === "Alumno") {
        if (rolCoordinador.nombre === "Coordinador de Facultad") {
          if (usuario.fid_facultad !== coordinador.fid_facultad) {
            return {
              message: `El usuario con el código ${codigo} no pertenece a la facultad del coordinador`,
              status: "error",
            };
          }
        } else if (rolCoordinador.nombre === "Coordinador de Programa") {
          if (usuario.fid_programa !== coordinador.fid_programa) {
            return {
              message: `El usuario con el código ${codigo} no pertenece al programa del coordinador`,
              status: "error",
            };
          }
        }
      }

      // Formatear los datos del usuario y los roles
      const usuarioDatos = {
        id_usuario: usuario.id_usuario,
        nombres: usuario.nombres,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido,
        email: usuario.email,
        codigo: usuario.codigo,
        esActivo: usuario.esActivo,
        facultad: usuario.Facultad ? usuario.Facultad.nombre : null,
        programa: usuario.Programa ? usuario.Programa.nombre : null,
        roles: rol.nombre,
      };

      return {
        message: "Usuario encontrado con éxito",
        status: "success",
        data: usuarioDatos,
      };
    } catch (error) {
      return {
        message: "Ocurrió un error al procesar la solicitud",
        status: "error",
        error: error.message,
      };
    }
  },
  async verificarAlumnosHistoricoNotas(idCoord, filesData) {
    try{
      const coordinador = await Usuario.findByPk(idCoord, {
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { es_activo: true },
            through: { attributes: [], where: { es_activo: true }},
          },
        ],
      });
    
      if (!coordinador) {
        throw new Error("Coordinador no encontrado");
      }
    
      const esCoordinadorFacultad = coordinador.Roles.some((rol) =>
        rol.nombre.includes("Coordinador de Facultad")
      );
      const esCoordinadorPrograma = coordinador.Roles.some((rol) =>
        rol.nombre.includes("Coordinador de Programa")
      );
  
      let facultad = null;
      let programa = null;
  
      if (esCoordinadorFacultad) {
        facultad = await Facultad.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
      }
      
      if (esCoordinadorPrograma) {
        programa = await Programa.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
      }
    
      const alumnosValidos = [];
    
      for (const file of filesData) {
        const { codigo, data } = file;
        let aux = codigo.toString();
        while (aux.length < 8) {
          aux = "0" + aux;
        }
        const cod = aux;
        const usuario = await Usuario.findOne({
          where: { codigo: cod, esActivo: true },
          include: [
            {
              model: Facultad,
              as: "Facultad",
              attributes: ["nombre"],
            },
            {
              model: Programa,
              as: "Programa",
              attributes: ["nombre"],
              required: false,
            },
            {
              model: Rol,
              as: "Roles",
              where: { es_activo: true, nombre: "Alumno" },
              through: { where: { es_activo: 1 } }
            }
          ],
        });
    
        if (!usuario) {
          continue; // El usuario no existe o no está activo
        }
    
        if (
          esCoordinadorFacultad &&
          usuario.fid_facultad !== facultad.id_facultad
        ) {
          continue; // El usuario no pertenece a la misma facultad del coordinador
        }
    
        if (
          esCoordinadorPrograma &&
          usuario.fid_programa !== programa.id_programa
        ) {
          continue; // El usuario no pertenece al mismo programa del coordinador
        }
    
        const size = (data.length / 1024).toFixed(2);
    
        alumnosValidos.push({
          id_usuario: usuario.id_usuario,
          nombres: usuario.nombres,
          primerApellido: usuario.primerApellido,
          codigo: usuario.codigo,
          size: size,
          data: data, // Enviar el buffer del PDF como está
        });
      }
    
      return alumnosValidos;

    }catch(error){
      console.log(error);
    }
  },

  async cargarMasivamenteNotasAlumnos(alumnos, id_Creador, performedBy) {
    for (const alumno of alumnos) {
      const { id_usuario, data } = alumno;    
  
      const notas = await HistoricoEstudiante.findAll({
        where: { fid_alumno: id_usuario },
      });
  
      // Suponiendo que `data` ya es un buffer compatible con BLOB en la base de datos
      const bufferToBlob = (buffer) => {
        const byteArray = new Uint8Array(buffer.data);
        return Buffer.from(byteArray);
      };
      const blob = bufferToBlob(data);
  
      if (notas.length > 0) {
        await HistoricoEstudiante.update(
          {
            nota: blob,
            actualizadoPor: id_Creador
          },
          { where: { fid_alumno: id_usuario } , performedBy}
        );
      } else {
        await HistoricoEstudiante.create({
          creadoPor: id_Creador,
          actualizadoPor: id_Creador,
          nota: blob,
          fid_alumno: id_usuario,
        }, { performedBy });        
      }
    }
  },
  async listadoAlumnosEncuesta(idCoord,searchValue,page,pageSize,sortBy,sortOrder) {
    const limit = parseInt(pageSize) || 10;
    const offset = (page - 1) * limit;
  
    const coordinador = await Usuario.findByPk(idCoord, {
      include: [
        {
          model: Rol,
          as: "Roles",
          where: { es_activo: true },
          through: { attributes: [], where: { es_activo: true } },
        },
      ],
    });
  
    if (!coordinador) {
      throw new Error("Coordinador no encontrado");
    }
  
    const esCoordinadorFacultad = coordinador.Roles.some((rol) =>
      rol.nombre.includes("Coordinador de Facultad")
    );
    
    let whereConditions = { esActivo: true };
    if (searchValue) {
      whereConditions= {
        ...whereConditions,
        [Op.or] : [
        { nombres: { [Op.like]: `%${searchValue}%` } },
        { primerApellido: { [Op.like]: `%${searchValue}%` } },
        Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')), {
          [Op.like]: `%${term.value}%`
        }),
        { segundoApellido: { [Op.like]: `%${searchValue}%` } },
        { email: { [Op.like]: `%${searchValue}%` } },
        { codigo: { [Op.like]: `%${searchValue}%` } },
      ]};
    }
    if(esCoordinadorFacultad){
      whereConditions.fid_facultad = coordinador.fid_facultad;
    }
    const alumnos = await Usuario.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]],
      where: whereConditions,
      include: [
        {
          model: Rol,
          as: "Roles",
          where: {
            nombre: "Alumno",
            es_activo: true,
          },
          through: { attributes: [] },
        },
        {
          model: SesionCita,
          as: "SesionesCitaAlumno",
          required: true,
          where: {
            fid_resultado: { [Op.ne]: null },
          },
        },
        //verificar que MRD depende de Encuesta
        /*{
          model: Encuesta,
          as: "EncuestasAlumno",
          where: {
            /*[Op.or]: [
              { fid_alumno: { [Op.ne]: idTipoTutoria } },
              { id_encuesta: idTipoTutoria, esActivo: false },
            ],
            [Op.or]: [{ es_activo: false }, { id_encuesta: null }],
          },
          attributes: [],
        }*/
        {
          model: Programa,
          as: "Programa",
          attributes: ["nombre"],
        },
      ],
      distinct: true,
    });
    const alumnosFiltrados = alumnos.rows.map((usuario) => ({
      id: usuario.id_usuario,
      nombres: usuario.nombres,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      avatar: usuario.imagen,
      email: usuario.email,
      codigo: usuario.codigo,
      programa: usuario.Programa ? usuario.Programa.nombre : null,
      esActivo: usuario.esActivo,
    }));

    return {
      message: "Usuarios listados con éxito",
      data: {
        totalPages: Math.ceil(alumnos.count / limit),
        currentPage: parseInt(page),
        totalUsuarios: alumnos.count,
        usuarios: alumnosFiltrados,
      },
    };
  },

  async registrarDerivacion({
    motivoDerivacion,
    antecedentes,
    comentarios,
    idAlumno,
    idTutor,
    tipoTutoria, 
    unidadAcademica, 
    idCita,
    facultad,
    performedBy
  }) {
    try {
      tipoTutoria = parseInt(tipoTutoria);
      idAlumno = parseInt(idAlumno);
      idTutor = parseInt(idTutor);
      idCita = parseInt(idCita);
      
      console.log(facultad);
  
      // Validate if the student has already been referred in the appointment
      const derivacionEstablecida = await Derivacion.findOne({
        where: { fid_cita: idCita }
      });
      if (derivacionEstablecida) {
        throw new Error("El alumno ya fue derivado");
      }
      
      // Get the ID of the academic unit
      const obtenerUnidadAcademica = await UnidadAcademica.findOne({
        where: { nombre: unidadAcademica }
      });
      if (!obtenerUnidadAcademica) {
        throw new Error(`Unidad Academica ${unidadAcademica} no encontrada`);
      }
  
      // Get the ID of the faculty
      const obtenerFacultad = await Facultad.findOne({
        where: { nombre: facultad }
      });
  
      let obtenerPrograma = null;
      if (!obtenerFacultad) {
        console.log('no se encontró la facultad');
        obtenerPrograma = await Programa.findOne({
          where: { nombre: facultad }
        });
        if (!obtenerPrograma) {
          throw new Error(`Ni Facultad ni Programa encontrado con el nombre ${facultad}`);
        }
      }
      
      console.log(motivoDerivacion);
      console.log(idCita);
      console.log(obtenerUnidadAcademica.id_unidad_academica);
      console.log(comentarios);
      console.log(antecedentes);
      console.log(idAlumno);
      console.log(idTutor);
      console.log(tipoTutoria);
      console.log(obtenerFacultad ? obtenerFacultad.id_facultad : obtenerPrograma.fid_facultad);
  
      // Register derivation
      const nuevaDerivacion = await Derivacion.create({
        fid_tutor: idTutor,
        fid_cita: idCita,
        fid_alumno: idAlumno,
        fid_tipoTutoria: tipoTutoria,
        motivo: motivoDerivacion,
        antecedentes,
        comentarios,
        fid_unidad_academica: obtenerUnidadAcademica.id_unidad_academica,
        esActivo: true,
        fid_facultad: obtenerFacultad ? obtenerFacultad.id_facultad : obtenerPrograma.fid_facultad,
        estado: 'Pendiente'
      }, { performedBy });
  
      console.log(nuevaDerivacion);
  
      return {
        motivoDerivacion: nuevaDerivacion.motivo,
        antecedentes: nuevaDerivacion.antecedentes,
        comentarios: nuevaDerivacion.comentarios,
        idAlumno: nuevaDerivacion.fid_alumno,
        idTutor: nuevaDerivacion.fid_tutor,
        idtipoTutoria: nuevaDerivacion.fid_tipoTutoria, 
        unidadAcademica: nuevaDerivacion.fid_unidad_academica, 
        idCita: nuevaDerivacion.fid_cita,
        idFacultad: nuevaDerivacion.fid_facultad,
        estado: nuevaDerivacion.estado
      }
    } catch (error) {
      // Log the error for further investigation
      console.error('Error registrando la derivación:', error.message);
  
      // Handle specific error messages
      if (error.message === "El alumno ya fue derivado") {
        throw new Error('El alumno ya ha sido derivado para esta cita.');
      } else if (error.message.includes('Unidad Academica')) {
        throw new Error('La unidad académica especificada no fue encontrada.');
      } else if (error.message.includes('Ni Facultad ni Programa encontrado')) {
        throw new Error('No se encontró una facultad o programa con el nombre especificado.');
      } else {
        throw new Error('Ocurrió un error inesperado al registrar la derivación.');
      }
    }
  },
  

  async obtenerDerivacionDetalle({
    idCita
  }) {
    idCita = parseInt(idCita);

    console.log('holaaaaaaa');

    //validar si el alumno ya fue derivado en la cita
    const derivacionEstablecida = await Derivacion.findOne({
      where: { fid_cita: idCita }
    });
    if (!derivacionEstablecida){
      throw new Error("No se ha encontrado la derivación");
    }

    console.log('resultados de buscar derivacion:');
    console.log(derivacionEstablecida);

    const datosAlumno = await Usuario.findByPk(derivacionEstablecida.fid_alumno);

    const datosTutor = await Usuario.findByPk(derivacionEstablecida.fid_tutor);

    const datosTipoTutoria = await TipoTutoria.findByPk(derivacionEstablecida.fid_tipoTutoria);

    const datosUnidadAcademica = await UnidadAcademica.findByPk(derivacionEstablecida.fid_unidad_academica);

    console.log('datos del alumno:', datosAlumno);
    console.log('datos del tutor:', datosTutor);
    console.log('datos del tipo de tutoria:', datosTipoTutoria);

    return {
      data: {
        motivoDerivacion: derivacionEstablecida.motivo,
        antecedentes: derivacionEstablecida.antecedentes,
        comentarios: derivacionEstablecida.comentarios,
        datosAlumno: datosAlumno,
        datosTutor: datosTutor,
        datosTipoTutoria: datosTipoTutoria, 
        datosUnidadAcademica: datosUnidadAcademica, 
        idCita: derivacionEstablecida.fid_cita,
        estado: derivacionEstablecida.estado
      }
    }
  },

  async listarDerivaciones({ idResponsable }) {
    idResponsable = parseInt(idResponsable);
    
    // Obtener datos del responsable de tutoría
    const datosUsuario = await Usuario.findOne({
      where: { id_usuario: idResponsable }
    });
    if (!datosUsuario) {
      return { message: "No hay ningún responsable de Bienestar con ese id" };
    }
  
    console.log('datos del usuario: ');
    console.log(datosUsuario);
  
    // Obtener derivaciones con todos los detalles
    const derivaciones = await Derivacion.findAll({
      where: { esActivo: true },
      include: [
        {
          model: Usuario,
          as: 'Tutor',
          attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo'],
        },
        {
          model: Usuario,
          as: 'Alumno',
          attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'codigo'],
        },
        {
          model: Facultad,
          as: 'Facultad',
          attributes: ['id_facultad', 'nombre']
        },
        {
          model: UnidadAcademica,
          as: 'UnidadAcademica',
          attributes: ['id_unidad_academica', 'nombre']
        },
        {
          model: TipoTutoria,
          as: 'TipoTutoria',
          attributes: ['id_tipoTutoria', 'nombre']
        }
      ],
      order: [
        ['estado', 'DESC'], // Ordenar por estado
        ['fechaCreacion', 'DESC'] // Luego ordenar por fecha de creación, de más antiguo a más nuevo
      ]
    });
  
    console.log('las derivaciones:');
    console.log(derivaciones);
  
    return {
      data: {
        derivaciones: derivaciones
      }
    };
  },

  async enviarDerivacion({
    idDerivacion,
    motivo,
    antecedentes,
    comentarios,
    unidadAcademica,
    codigoAlumno,
    correoAlumno,
    nombreAlumno,
    primerApellidoAlumno,
    segundoApellidoAlumno,
    codigoTutor,
    correoTutor,
    nombreTutor,
    primerApellidoTutor,
    segundoApellidoTutor,
    facultad,
    performedBy
  }) {
    try {
      idDerivacion = parseInt(idDerivacion);
  
      console.log(unidadAcademica);
  
      let idUnidadAcademicaNueva = null;
      const unidadAcademicaNueva = await UnidadAcademica.findOne({
        where: { nombre: unidadAcademica }
      });
  
      if (!unidadAcademicaNueva) {
        throw new Error("No se ha encontrado la unidad académica");
      } else {
        idUnidadAcademicaNueva = unidadAcademicaNueva.id_unidad_academica;
      }
  
      const derivacion = await Derivacion.findByPk(idDerivacion);
  
      if (idUnidadAcademicaNueva != derivacion.fid_unidad_academica){
        await Derivacion.update({
          fid_unidad_academica: idUnidadAcademicaNueva,
          estado: 'Enviado'
        }, {
          where: { id_derivacion: idDerivacion }, performedBy, individualHooks: true
        });
      } else {
        await Derivacion.update({
          estado: 'Enviado'
        }, {
          where: { id_derivacion: idDerivacion }, performedBy, individualHooks: true
        });
      }
  
      // Preparing the HTML body of the email
      let cuerpoHTML = `
        <h1>Derivación de Alumno a Unidad Académica</h1>
        <p>Detalles de la derivación:</p>
        <ul>
          <li><strong>Alumno:</strong></li>
          <ul>
            <li>Código: ${codigoAlumno}</li>
            <li>Nombre: ${nombreAlumno} ${primerApellidoAlumno} ${segundoApellidoAlumno}</li>
            <li>Correo: ${correoAlumno}</li>
          </ul>
          <li><strong>Tutor:</strong></li>
          <ul>
            <li>Código: ${codigoTutor}</li>
            <li>Nombre: ${nombreTutor} ${primerApellidoTutor} ${segundoApellidoTutor}</li>
            <li>Correo: ${correoTutor}</li>
          </ul>
          <li>Facultad: ${facultad}</li>
          <li>Unidad Académica: ${unidadAcademica}</li>
          <li>Motivo: ${motivo}</li>
          <li>Antecedentes: ${antecedentes}</li>
          <li>Comentarios: ${comentarios}</li>
        </ul>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
      `;
  
      // Sending the email
      await transporter.sendMail({
        from: '"Derivaciones" <mentify.soft@gmail.com>',
        to: unidadAcademicaNueva.correoDeContacto,
        cc: correoTutor,
        subject: "Derivación de Alumno a Unidad Académica",
        html: cuerpoHTML,
      });
  
      return {
        message: 'Derivación del alumno a la unidad académica enviada con éxito'
      };
    } catch (error) {
      throw new Error('Error al derivar alumno a la unidad académica: ' + error.message);
    }
  },

  async obtenerFacultadesDisponibles(){
    const facultades = await Facultad.findAll({
      attributes: ['id_facultad', 'nombre'],
      where: {
          id_facultad: {
              [Sequelize.Op.notIn]: Sequelize.literal(`(
                  SELECT fid_facultad 
                  FROM Roles_Usuario 
                  JOIN Usuario ON Roles_Usuario.id_usuario = Usuario.id_usuario
                  WHERE Roles_Usuario.es_activo = 1 AND Roles_Usuario.id_rol = 7
              )`)
          },
          esActivo: 1
      }
    });

    console.log('aqui las facultades');
    console.log(facultades);

    // Transformar datos para ajustar la estructura deseada
    const result = facultades.map(facultad => ({
        id_facultad: facultad.id_facultad,
        nombre: facultad.nombre,
    }));

    console.log(result);

    return result;
  },
  async obtenerTutoresNoCoordinadores({ page = 1, pageSize = 10, searchCriterias = [], sortBy = 'codigo', sortOrder = 'ASC' }) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // Create search conditions
    const searchConditions = searchCriterias.map(criteria => {
        if (criteria.field === 'fullName') {
            return Sequelize.where(
                Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('primerApellido')),
                {
                    [Op.like]: `%${criteria.value}%`
                }
            );
        }
        return {
            [criteria.field]: { [Op.like]: `%${criteria.value}%` }
        };
    });

    // Define where condition
    const whereCondition = {
        esActivo: true,
        ...(searchConditions.length && { [Op.or]: searchConditions }),
    };

    console.log('where condition:');
    console.log(whereCondition);

    // Fetch all active tutors with the search conditions
    const tutoresActivos = await Usuario.findAll({
        attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "segundoApellido",
            "codigo",
            "imagen",
            "email",
        ],
        include: [
            {
                model: Rol,
                as: "Roles",
                where: { nombre: "Tutor" },
                through: { where: { es_activo: true } },
                required: true,
            },
        ],
        where: whereCondition,
        order: [["nombres", "ASC"]],
    });

    // Fetch all active coordinators from Facultad and Programa
    const coordinadoresFacultad = await Facultad.findAll({
        attributes: ["fid_usuario"],
        where: {
            esActivo: true,
            fid_usuario: { [Op.ne]: null }
        }
    });

    const coordinadoresPrograma = await Programa.findAll({
        attributes: ["fid_usuario"],
        where: {
            esActivo: true,
            fid_usuario: { [Op.ne]: null }
        }
    });

    // Combine coordinators' IDs from both tables
    const coordinadoresIds = [
        ...coordinadoresFacultad.map(coord => coord.fid_usuario),
        ...coordinadoresPrograma.map(coord => coord.fid_usuario)
    ];

    // Fetch all active students
    const alumnosActivos = await Usuario.findAll({
        attributes: [
            "id_usuario",
            "nombres",
            "primerApellido",
            "segundoApellido",
            "codigo",
            "imagen",
            "email",
        ],
        include: [
            {
                model: Rol,
                as: "Roles",
                where: { nombre: "Alumno" },
                through: { where: { es_activo: true } },
                required: true,
            },
        ],
        where: {
            esActivo: true,
        },
        order: [["nombres", "ASC"]],
    });

    // Get the IDs of the students
    const alumnosIds = alumnosActivos.map(alumno => alumno.id_usuario);

    // Filter out the tutors who are not coordinators nor students
    const tutoresNoCoordinadoresNiAlumnos = tutoresActivos.filter(
        tutor => !coordinadoresIds.includes(tutor.id_usuario) && !alumnosIds.includes(tutor.id_usuario)
    );

    // Ordenar por campo nombres nombres de forma ascendentess
    tutoresNoCoordinadoresNiAlumnos.sort((a, b) => {
        if (a.nombres < b.nombres) return -1;
        if (a.nombres > b.nombres) return 1;
        return 0;
    });

    console.log('tutores no coordinadores ni alumnos:');
    console.log(tutoresNoCoordinadoresNiAlumnos);

    // Apply pagination
    const paginatedTutores = tutoresNoCoordinadoresNiAlumnos.slice(offset, offset + limit);

    // Map the results to the desired format
    const resultado = paginatedTutores.map(usuario => ({
        id: usuario.id_usuario,
        name: usuario.nombres,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido,
        code: usuario.codigo,
        avatar: usuario.imagen,
        email: usuario.email,
    }));

    console.log('resultado:');
    console.log(resultado);

    return {
        totalPages: Math.ceil(tutoresNoCoordinadoresNiAlumnos.length / pageSize),
        currentPage: page,
        totalTutores: tutoresNoCoordinadoresNiAlumnos.length,
        tutores: resultado,
    };
  },


};

module.exports = UsuarioService;