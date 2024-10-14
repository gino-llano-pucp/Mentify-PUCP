'use strict';
const UsuarioService = require('../services/UsuarioService')
const db = require('../models/')
const Usuario = db.Usuario;
const Roles_Usuario = db.Roles_Usuario;
const sequelize = db.sequelize;
const Rol = db.Rol;
const Facultad = db.Facultad;
const Programa = db.Programa;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const RolesUsuarioService = require('../services/RolesUsuarioServices');
const TipoTutoriaService = require("../services/TipoTutoriaServices");
const { Op, json } = require('sequelize');
const { FRONTEND_URL } = process.env;
const PasswordResetToken = db.PasswordResetToken;
const transporter = require('../config/mailer');
const logError = require('../utils/loggingErrors');
const { Sequelize, where, or } = require('sequelize');

const UsuarioController = {
    async login(req, res) {
        const { identifier, password } = req.body;
        console.log("data: ", req.body);
        
        try {
            let User;
            
            if(identifier.includes('@')){
                User = await UsuarioService.obtenerPorEmail(identifier);
            }
            else{
                User = await UsuarioService.obtenerPorCodigo(identifier);
            }
      if (!User) {
        res.status(404).json({ message: "User not found" });
      } else {
        const isMatch = await bcrypt.compare(password, User.contrasenha);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!User.esActivo) {
          return res.status(401).json({ message: "User is inactive" });
        }
        //Verificar si todos los roles del usuario estan inactivos
        
        const rolesActivos = await UsuarioService.obtenerRolesPorIdUsuarioyEstado(User.id_usuario);
        const allRolesInactive = rolesActivos.every(es_activo => !es_activo);
        if (allRolesInactive) {
            return res.status(401).json({ message: "User roles are inactive" });
        }
        // Split the full name to extract the first name
        const firstName = User.nombres.split(" ")[0];

        // Combine the first name with the first last name
        const fullName = `${firstName} ${User.primerApellido}`;

        const token = await UsuarioService.crearToken(User);
        // Calcular expires_at para el access token
        let currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
        const accessTokenExpiresAt = currentTime + 3600; // 1 hora en segundos
        const refresh_token = await UsuarioService.crearRefreshToken(User);

        res.json({
          name: fullName,
          email: User.email,
          image: User.imagen,
          access_token: token,
          refresh_token: refresh_token,
          access_token_expires_at: accessTokenExpiresAt,
          id: User.id_usuario,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async obtenerInicio(req, res) {
    // `req.user` viene del middleware de autenticación y debe contener el idUsuario decodificado del token
    try {
      const { codigo } = req.user.data; // Obtener el código de usuario del token decodificado
      const usuario = await UsuarioService.obtenerPorCodigo(codigo);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json({ usuario });
    } catch (err) {
      console.error("Error obteniendo pantalla de inicio de usuario", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async crearUsuario(req, res) {
    const { rolAdicional, email, codigo, idRol } = req.body;
    const performedBy = req.user.id;
    try {
      // Verifica si ya existe un usuario con el mismo email
      let user = await UsuarioService.obtenerPorEmail(email);
      if (user) {
        return res.status(400).json({ message: "Usuario already exists" });
      }
      //verifica si ya existe un usuario con el mismo codigo
      let userByCode = await UsuarioService.obtenerPorCodigo(codigo);
      if (userByCode) {
        return res.status(400).json({ message: "Usuario already exists" });
      }
      const nuevoUsuario = await UsuarioService.insertar(req.body, null, performedBy);
      //si el usuario es coordinador tambien se le asigna el rol de tutor
      //lamentablemente esto tiene que ser hardcodeado es LOGICA DE NEGOCIO
      if (idRol == 1 || idRol == 2) {
        return res
          .status(400)
          .json({ message: "Rol inadecuado, debe ser Tutor o Alumno" });
      }

      if (rolAdicional === true) {
        if (idRol == 4) {
          await RolesUsuarioService.insertar(nuevoUsuario.id_usuario, 3, performedBy);
        } else if (idRol == 3) {
          //await RolesUsuarioService.insertar(nuevoUsuario.id_usuario, 4);
        }
      }
      await RolesUsuarioService.insertar(nuevoUsuario.id_usuario, idRol, performedBy);
      res.status(201).json({
        message: "Usuario created successfully",
        nuevoUsuario,
      });
    } catch (error) {
      console.error(error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ message: "Server error" });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerTodos();
      res.status(200).json({
        message: "Se obtuvieron los datos con exito",
        usuarios,
      });
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async obtenerPorId(req, res) {
    const usuarioId = req.params.id;
    try {
      const usuario = await UsuarioService.obtenerPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: "usuario no econtrado" });
      }
      res.status(200).json({
        message: "Se obtuvo el usuario solicitado con exito",
        usuario,
      });
    } catch (err) {
      console.error("Error obteniendo usuario:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async actualizar(req, res) {
    const usuarioId = req.params.id;
    const usuarioData = req.body;
    const performedBy = req.user.id;
    try {
      const sus = await UsuarioService.obtenerPorId(usuarioId);
      
      let aux = usuarioData.codigo.toString();
      while (aux.length < 8) {
        aux = "0" + aux;
      }
      usuarioData.codigo = aux;


      // Verifica si ya existe un usuario con el mismo email
      if(sus.codigo != usuarioData.codigo){
        if(sus.email != usuarioData.email){
            let user = await UsuarioService.obtenerPorEmail(usuarioData.email);
            if (user) {
            //throw new Error("Usuario ya existe por email");
            return res
                .status(400)
                .json({ message: "Usuario ya existe por email" });
            }   
        }
        //verifica si ya existe un usuario con el mismo codigo
        let userByCode = await UsuarioService.obtenerPorCodigo(
          usuarioData.codigo
        );
        if (userByCode) {
        //  throw new Error("Usuario ya existe por codigo");
        return res
            .status(400)
            .json({ message: "Usuario ya existe por codigo" });
        }              
      }

      if (sus.email != usuarioData.email) {
        let user = await UsuarioService.obtenerPorEmail(usuarioData.email);
        if (user) {
          //throw new Error("Usuario ya existe por email");
          return res
            .status(400)
            .json({ message: "Usuario ya existe por email" });
        }        
      }
      const actualizarusuario = await UsuarioService.actualizar(
        usuarioId,
        usuarioData,
        performedBy
      );
      if (!actualizarusuario) {
        return res.status(404).json({ error: "usuario no econtrado" });
      }
      res.status(200).json({
        message: "Actualizado con exito",
        actualizarusuario,
      });
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: err.message });
    }
  },
  async eliminar(req, res) {
    const usuarioId = req.params.id;
    const performedBy = req.user.id;
    try {
      const actualizarusuario = await UsuarioService.eliminar(usuarioId, performedBy);
      if (!actualizarusuario) {
        return res.status(404).json({ error: "usuario no econtrado" });
      }
      res.status(200).json({
        message: "Eliminado con exito",
        actualizarusuario,
      });
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: err.message });
    }
  },

  async getUsuariosPorCoordinador(req, res) {
    const {
      idCoord,
      searchValue,
      currentRole,
      page,
      pageSize,
      id_tipoTutoria,
    } = req.body;

    try {
      const result = await UsuarioService.listarUsuariosPorCoordinador(
        idCoord,
        searchValue,
        currentRole,
        page,
        pageSize,
        id_tipoTutoria
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al listar usuarios por coordinador:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
        .status(500)
        .json({ message: error.message });
    }
  },

  async obtenerUsuariosPorRol(req, res) {
    const { nombreRol } = req.params;
    console.log(nombreRol);
    try {
      const usuarios = await UsuarioService.obtenerUsuariosPorRol(nombreRol);
      if (usuarios.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontro un usuario con el Rol ingresado" });
      }
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ message: error.message });
    }
  },

  async obtenerRolesUsuario(req, res) {
    const usuarioId = req.params.id; // Asegurar de que 'id' sea pasado como parámetro en la URL
    try {
      const roles = await UsuarioService.obtenerRolesPorIdUsuario(usuarioId);
      if (!roles || roles.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontro roles para el usuario" });
      }
      res.json({ usuarioId, roles });
    } catch (error) {
      console.error("Error al obtener roles:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async cargarMasivamente(req, res) {
    const datos = req.body;
    const transaction = await sequelize.transaction();
    const performedBy = req.user.id;
    try {
      for (const dato of datos) {
        let {
          idRol,
          codigo,
          nombres,
          email,
          primerApellido,
          segundoApellido,
          Facultad: facultadData,
        } = dato;

        let aux = codigo.toString();
        while (aux.length < 8) {
          aux = "0" + aux;
        }
        codigo = aux;

        let facultad = null,
          programa = null,programa2=null;
        // Procesar facultad y programa si facultadData no es null
        if (facultadData) {
          if(facultadData.idFacultad){
            facultad = await Facultad.findOne({
              where: { id_facultad: facultadData.idFacultad },
              transaction,
            });
          }else{
            facultad = await Facultad.findOne({
              where: { nombre: facultadData.nombre },
              transaction,
            });
          }
          
          //si no encuentro la facultad la creo
          if (!facultad) {
            continue;
          }

          if (facultadData.nombrePrograma) {
            programa = await Programa.findOne({
              where: {
                nombre: facultadData.nombrePrograma,
                fid_facultad: facultad.id_facultad,
              },
              transaction,
            });
            //igualmente deberia de llamarse al controlador de programa
            if (!programa) {
              continue;
            }
          } else{
            programa2 = await Programa.findOne({
                where: {
                  fid_facultad: facultad.id_facultad,
                },
                transaction,
              });
            if(programa2){
                continue;
            }
          }
        }

        // Verificar si el usuario existe
        let usuario = await Usuario.findOne({
          where: { email },
          transaction,
        });
        
        if(!usuario){
          usuario = await Usuario.findOne({
            where: { codigo },
            transaction,
          })
        }
        //deberia llamarse al servicio de crear usuario no hacerse aqui

        const alumno = {
          body : {
            rolAdicional: false,
            codigo,
            idRol,
            nombres,
            primerApellido,
            segundoApellido,
            email,
            fid_facultad: facultad ? facultad.id_facultad : null,
            fid_programa: programa ? programa.id_programa : null,
          },
          params : {
            id: usuario ? usuario.id_usuario : null 
          },
          user: {
            id: performedBy
          }
        };

        const resultado = {
          statusCode: null,
          data: null,
          status: function (code) {
            this.statusCode = code;
            return {
              json: (data) => {
                this.data = data;
                console.log(`Fake res.json: ${JSON.stringify(data)}`);
              }
            };
          }
        };
        if (!usuario) {
          await UsuarioController.crearUsuario(alumno, resultado);
          if (resultado.statusCode === 201) {
            usuario = resultado.data; // Asume que `nuevoUsuario` es la data retornada
          } else if (resultado.statusCode === 400) {
            continue;
          }
        } else{
          await UsuarioController.actualizar(alumno, resultado);
          if (resultado.statusCode === 201) {
            usuario = resultado.data; // Asume que `nuevoUsuario` es la data retornada
          } else if (resultado.statusCode === 400 ) {
            continue;
          }
        }
      }

      await transaction.commit();
      res.status(201).json({
        message: "Usuarios cargados correctamente.",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error en la carga masiva:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error al realizar la carga masiva",
        error: error.message,
      });
    }
  },
  async obtenerTodos(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerTodos();
      res.status(200).json({
        message: "Se obtuvieron los datos con exito",
        usuarios,
      });
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      await logError(err, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: err.message });
    }
  },
  async getUserRoles(req, res) {
    try {
      const userId = req.params.userId;
      const user = await Usuario.findByPk(userId, {
        include: [
          {
            model: Rol,
            through: {
              attributes: [], // No need to include fields from the join table
            },
            attributes: ["nombre"], // Only fetch the role names
            where: {
              es_activo: 1, // Assuming you only want active roles
            },
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const roles = user.Rols.map((rol) => rol.nombre); // Extract role names from the fetched roles
      res.json({ roles });
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ message: error.message });
    }
  },

  async obtenerExclusivamenteTutoresNoCoordinadores(req, res) {
    try {
      const { page, pageSize, searchCriterias, sortBy, sortOrder } = req.body;
      console.log("Obteniendo tutores que no son coordinadores");
      console.log("Página:", page, "Tamaño de página:", pageSize, "Criterios de búsqueda:", searchCriterias, "Ordenar por:", sortBy, "Orden:", sortOrder)
      const resultado = await UsuarioService.obtenerTutoresNoCoordinadores({
        page,
        pageSize,
        searchCriterias,
        sortBy,
        sortOrder,
      });
      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error al obtener tutores que no son coordinadores:", error);
      res.status(500).json({ error: error.message });
    }
  },  

  async obtenerExclusivamenteTutoresActivos(req, res) {
    try {
      // Obtener los tutores activos
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
        where: {
          esActivo: true,
        },
      });

      // Obtener los coordinadores inactivos
      const coordinadoresInactivos = await Usuario.findAll({
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
            where: {
              [Op.or]: [
                { nombre: "Coordinador de Facultad" },
                { nombre: "Coordinador de Programa" },
              ],
            },
            through: { where: { es_activo: false } },
            required: true,
          },
        ],
        where: {
          esActivo: false,
        },
      });

      // Combinar los resultados
      const resultado = [...tutoresActivos, ...coordinadoresInactivos].map(
        (usuario) => ({
          id: usuario.id_usuario,
          name: usuario.nombres,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
          code: usuario.codigo,
          avatar: usuario.imagen,
          email: usuario.email,
        })
      );

      res.status(200).json(resultado);
    } catch (error) {
      console.error(
        "Error al obtener tutores activos y coordinadores inactivos:",
        error
      );
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        error: error.message
      });
    }
  },

  async eliminarRolDeUsuario(req, res) {
    const { id, roleId } = req.params;
    const performedBy = req.user.id;
    try {
      const resultado = await UsuarioService.eliminarRolDeUsuario(id, roleId, performedBy);
      res.status(200).json({
        message: "Rol eliminado con éxito del usuario",
        resultado,
      });
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarRolDeUsuarioPorNombre(req, res) {
    const { id, roleName } = req.params;
    const performedBy = req.user.id;
    try {
      const resultado = await UsuarioService.eliminarRolDeUsuarioPorNombre(
        id,
        roleName,
        performedBy
      );
      res.status(200).json({
        message: "Rol eliminado con éxito del usuario",
        resultado,
      });
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async activarRolDeUsuarioPorNombre(req, res) {
    const { id, roleName } = req.params;
    const performedBy = req.user.id;
    try {
      const resultado = await UsuarioService.activarRolDeUsuarioPorNombre(
        id,
        roleName,
        performedBy
      );
      res.status(200).json({
        message: "Rol activado con éxito del usuario",
        resultado,
      });
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarUsuariosPorRolPaginado(req, res) {
    const { page = 1 } = req.params;
    const {
      idCoord,
      role,
      pageSize = 9,
      sortBy = "fechaCreacion",
      sortOrder = "DESC",
      searchCriterias = [],
    } = req.body;

    try {
      const result = await UsuarioService.listarUsuariosPorRolPaginado(
        role,
        page,
        pageSize,
        sortBy,
        sortOrder,
        idCoord,
        searchCriterias
      );
      res.status(200).json({
        message: "Usuarios listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },
  async listarAlumnosAsiganadosTutorFijo(req, res) {
    const {
      page,
      pageSize,
      sortBy = 'nombres',
      sortOrder = 'ASC',
      searchCriterias = [],
    } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "El idTutor es necesario" });
    }
    try {
      const result = await UsuarioService.listarAlumnosAsiganadosTutorFijo(
        id,
        page,
        pageSize,
        sortBy,
        sortOrder,
        searchCriterias
      );
      res.status(200).json({
        message: "Alumnos asignados listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar alumnos asignados:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarUsuariosFacultadPaginado(req, res) {
    const { page = 1 } = req.params;
    const {
      facultadId,
      nombreFacultad,
      roles,
      pageSize = 9,
      sortBy = "nombres",
      sortOrder = "ASC",
    } = req.body;

    if (!facultadId && !nombreFacultad) {
      return res.status(400).json({
        message:
          "Debe proporcionar al menos uno de los siguientes campos: facultadId o nombreFacultad",
        data: [],
      });
    }

    try {
      const result = await UsuarioService.listarUsuariosFacultadPaginado(
        facultadId,
        nombreFacultad,
        roles,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      res.status(200).json({
        message: "Usuarios listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar usuarios por facultad:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarUsuariosPorCoordinadorPaginado(req, res) {
    const { page = 1 } = req.params;
    const {
      idCoord,
      roles,
      pageSize = 9,
      sortBy = "nombres",
      sortOrder = "ASC",
    } = req.body;

    if (!idCoord) {
      return res.status(400).json({
        message: "Debe proporcionar el id del coordinador",
        data: [],
      });
    }

    try {
      const result = await UsuarioService.listarUsuariosPorCoordinadorPaginado(
        idCoord,
        roles,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      res.status(200).json({
        message: "Usuarios listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar usuarios por coordinador:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarTutoresAlumnoPaginado(req, res) {
    console.log("Entra");
    const { idAlumno, nombreTutor, page = 1, pageSize = 10 } = req.body;

    try {
      const result = await UsuarioService.listarTutoresAlumnoPaginado(
        idAlumno,
        nombreTutor,
        page,
        pageSize
      );
      res.status(200).json({
        message: "Tutores listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar tutores del alumno:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarTutoresPorTipoTutoriaPaginado(req, res) {
    const { tipoTutoria, nombreTutor, page = 1, pageSize = 10 } = req.body;

    try {
      const result = await UsuarioService.listarTutoresPorTipoTutoriaPaginado(
        tipoTutoria,
        nombreTutor,
        page,
        pageSize
      );
      res.status(200).json({
        message: "Tutores listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar tutores por tipo de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarAlumnosAsignadosTutor(req, res) {
    const {
      idTutor,
      tipoTutoria,
      nombreAlumno,
      primerApellido,
      codigo,
      correo,
      page = 1,
      pageSize = 10,
    } = req.body;

    try {
      const result = await UsuarioService.listarAlumnosAsignadosTutor(
        idTutor,
        tipoTutoria,
        nombreAlumno,
        primerApellido,
        codigo,
        correo,
        page,
        pageSize
      );
      res.status(200).json({
        message: "Alumnos asignados al tutor listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar alumnos asignados al tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },

  async listarAlumnosTipoTutoriaExcluidos(req, res) {
    const {
      idTutor,
      tipoTutoria,
      nombreAlumno,
      primerApellido,
      codigo,
      correo,
      page = 1,
      pageSize = 10,
    } = req.body;

    try {
      const result = await UsuarioService.listarAlumnosTipoTutoriaExcluidos(
        idTutor,
        tipoTutoria,
        nombreAlumno,
        primerApellido,
        codigo,
        correo,
        page,
        pageSize
      );
      res.status(200).json({
        message:
          "Alumnos del tipo de tutoría listados con éxito, excluyendo los asignados al tutor",
        data: result,
      });
    } catch (error) {
      console.error(
        "Error al listar alumnos del tipo de tutoría excluidos:",
        error
      );
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async asignarAlumnoTutor(req, res) {
    const { idAlumno, idTutor, tipoTutoria } = req.body;
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.asignarAlumnoTutor(
        idAlumno,
        idTutor,
        tipoTutoria,
        performedBy
      );
      res.status(200).json({
        message: "Alumno asignado al tutor con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al asignar alumno al tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async desasignarAlumnoTutor(req, res) {
    const { idAlumno, idTutor, tipoTutoria } = req.body;

    try {
      const result = await UsuarioService.desasignarAlumnoTutor(
        idAlumno,
        idTutor,
        tipoTutoria
      );
      res.status(200).json({
        message: "Alumno desasignado del tutor con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al desasignar alumno del tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async cargarMasivamenteAlumnosTutoria(req, res) {
    const { idTipoTutoria, alumnos } = req.body;
    const performedBy = req.user.id;
    try {
      for (const alumno of alumnos) {
        const nuevaAsignacion =
          await TipoTutoriaService.agregarUsuarioATipoTutoria(
            alumno.id_usuario,
            idTipoTutoria,
            alumno.roles,
            performedBy
          );
      }
      res.status(201).json({
        message: "Alumnos cargados correctamente al tipo de tutoría.",
      });
    } catch (error) {
      console.error(
        "Error en la carga masiva de alumnos al tipo de tutoría:",
        error
      );
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message:
          "Error al realizar la carga masiva de alumnos al tipo de tutoría",
        error: error.message,
      });
    }
  },

  async reiniciarTemporales(req, res) {
    const { tipoTutoria } = req.body;
    const transaction = await sequelize.transaction();
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.reiniciarTemporales(
        tipoTutoria,
        transaction,
        performedBy
      );
      await transaction.commit();
      res.status(200).json({
        message: "Temporales reiniciados con éxito",
        data: result,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error al reiniciar temporales:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error al reiniciar temporales",
        error: error.message,
      });
    }
  },
  async buscarTutores(req, res) {
    const { tipoTutoria, inputSearch, page = 1, pageSize = 9 } = req.body;
    console.log(req.body);

    try {
      const resultados = await UsuarioService.buscarTutoresPorTipoTutoria(
        tipoTutoria,
        inputSearch,
        page,
        pageSize
      );
      res.status(200).json(resultados);
    } catch (error) {
      console.error("Error al buscar tutores.", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
        .status(500)
        .json({ error: { message: "Error interno del servidor" } });
    }
  },

  async getUsuariosPorTipoTutoria(req, res) {
    const { searchValue, id_tipoTutoria, pageSize, sortBy, sortOrder, page } =
      req.body;

    try {
      const result = await UsuarioService.listarUsuariosPorTipoTutoria(
        searchValue,
        id_tipoTutoria,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al listar usuarios por tipo de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
        .status(500)
        .json({ message: "Error al listar usuarios por tipo de tutoría." });
    }
  },

  async listarTutoresYSolicitudes(req, res) {
    const {
      idAlumno,
      pageSize,
      sortTutorBy,
      sortTutorOrder,
      sortSolicitud,
      sortSolicitudOrder,
      searchCriterias,
    } = req.body;
    const userId = req.user.id;
    try {
      const result = await UsuarioService.listarTutoresYSolicitudes(
        idAlumno,
        pageSize,
        sortTutorBy,
        sortTutorOrder,
        sortSolicitud,
        sortSolicitudOrder,
        searchCriterias,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al listar tutores y solicitudes:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
        .status(500)
        .json({ message: "Error al listar tutores y solicitudes." });
    }
  },

  async enviarCorreoRechazo(req, res) {
    const { tutorId, alumnoId, tipoTutoriaId, motivoRechazo } = req.body;

    try {
      await UsuarioService.enviarCorreoRechazo(
        tutorId,
        alumnoId,
        tipoTutoriaId,
        motivoRechazo
      );
      res.status(200).json({
        message: "Correo enviado con éxito",
      });
    } catch (error) {
      console.error("Error al enviar correo de rechazo:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async cargarUsuariosTutoria(req, res) {
    const { idTipoTutoria, alumnos } = req.body;
    const performedBy = req.user.id;

    if (!idTipoTutoria || !Array.isArray(alumnos)) {
      return res.status(400).json({ message: "Datos de entrada inválidos" });
    }

    try {
      const result = await UsuarioService.cargarUsuariosTutoria(
        idTipoTutoria,
        alumnos,
        performedBy
      );
      res.status(200).json({
        message: "Usuarios cargados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al cargar usuarios a la tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async listarAlumnosTutoriaSinTutor(req, res) {
    const {
      id_Tutor,
      id_tipoTutoria,
      page = 1,
      pageSize = 9,
      sortBy = "nombres",
      sortOrder = "ASC",
      searchValue = "",
    } = req.body;

    if (!id_Tutor || !id_tipoTutoria) {
      return res.status(400).json({
        message:
          "Debe proporcionar el id del tutor y el id del tipo de tutoría",
        data: [],
      });
    }

    try {
      const result = await UsuarioService.listarAlumnosTutoriaSinTutor(
        id_Tutor,
        id_tipoTutoria,
        page,
        pageSize,
        sortBy,
        sortOrder,
        searchValue
      );
      res.status(200).json({
        message: "Alumnos listados con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al listar alumnos de la tutoría sin tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async listarTiposTutoriaPorTutor(req, res) {
    try {
      const { idTutor } = req.body;
      const resultado = await UsuarioService.listarTiposTutoriaPorTutor(
        idTutor
      );
      return res.status(200).json(resultado);
    } catch (error) {
      console.error("Error al listar tipos de tutoría por tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      return res
        .status(500)
        .json({
          message: "Error al listar tipos de tutoría por tutor",
          error: error.message,
        });
    }
  },

  async registrarResponsableTutoria(req, res) {
    const {
      codigo,
      nombre,
      primerApellido,
      segundoApellido,
      correo,
      idFacultad,
    } = req.body;
    const performedBy = req.user.id;
    try {
      const nuevoUsuario = await UsuarioService.registrarResponsableTutoria({
        codigo,
        nombre,
        primerApellido,
        segundoApellido,
        correo,
        idFacultad,
        performedBy
      });
      res.status(201).json({
        message: "Responsable de tutoría registrado con éxito",
        data: nuevoUsuario,
      });
    } catch (error) {
      console.error("Error al registrar responsable de tutoría:", error);

      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      if (error.message === "Ya existe un usuario con el mismo código") {
        res
          .status(409)
          .json({ error: "Ya existe un usuario con el mismo código" });
      } else if (error.message === "Ya existe un usuario con el mismo correo") {
        res
          .status(409)
          .json({ error: "Ya existe un usuario con el mismo correo" });
      } else if (
        error.message ===
        "Ya existe un responsable de tutoría para la facultad seleccionada"
      ) {
        res
          .status(409)
          .json({
            error:
              "Ya existe un responsable de tutoría para la facultad seleccionada",
          });
      } else {
        res
          .status(500)
          .json({ error: error.message || "Error interno del servidor" });
      }
    }
  },

  async listarResponsableTutoria(req, res) {
    try {
      const responsable = await UsuarioService.listarResponsableTutoria();
      res.status(200).json({
        message: "Responsable de tutoría listado con éxito",
        data: responsable,
      });
    } catch (error) {
      console.error("Error al listar responsable de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async editarResponsableTutoria(req, res) {
    const {
      codigoNuevo,
      codigo,
      nombre,
      primerApellido,
      segundoApellido,
      correo,
      correoNuevo,
      idFacultad,
      idFacultadNuevo,
    } = req.body;
    const performedBy = req.user.id;
    try {
      const responsableEditado = await UsuarioService.editarResponsableTutoria({
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
      });
      res.status(200).json({
        message: "Responsable de tutoría editado con éxito",
        data: responsableEditado,
      });
    } catch (error) {
      console.error("Error al registrar responsable de tutoría:", error);

      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error

      if (error.message === "Ya existe un usuario con el mismo código") {
        res
          .status(409)
          .json({ error: "Ya existe un usuario con el mismo código" });
      } else if (error.message === "Ya existe un usuario con el mismo correo") {
        res
          .status(409)
          .json({ error: "Ya existe un usuario con el mismo correo" });
      } else if (
        error.message ===
        "Ya existe un responsable de tutoría para la facultad seleccionada"
      ) {
        res
          .status(409)
          .json({
            error:
              "Ya existe un responsable de tutoría para la facultad seleccionada",
          });
      } else {
        res
          .status(500)
          .json({ error: error.message || "Error interno del servidor" });
      }
    }
  },

  async eliminarResponsableTutoria(req, res) {
    const { codigo } = req.body;
    const performedBy = req.user.id;
    try {
      const responsableEliminado =
        await UsuarioService.eliminarResponsableTutoria(codigo, performedBy);
      res.status(200).json({
        message: "Responsable de tutoría eliminado con éxito",
        data: responsableEliminado,
      });
    } catch (error) {
      console.error("Error al eliminar responsable de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async activarResponsableTutoria(req, res) {
    const { codigo } = req.body;
    const performedBy = req.user.id;
    try {
      const responsableActivado =
        await UsuarioService.activarResponsableTutoria(codigo, performedBy);
      res.status(200).json({
        message: "Responsable de tutoría activado con éxito",
        data: responsableActivado,
      });
    } catch (error) {
      console.error("Error al activar responsable de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: error.message });
    }
  },
  async agregarRolTutor(req, res) {
    const { idAlumno } = req.body;
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.agregarRolTutor(idAlumno, performedBy);
      res
        .status(200)
        .json({ message: "Rol de tutor agregado con éxito", data: result });
    } catch (error) {
      console.error("Error al agregar rol de tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async desactivarRolTutor(req, res) {
    const { idAlumno } = req.body;
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.desactivarRolTutor(idAlumno, performedBy);
      res
        .status(200)
        .json({ message: "Rol de tutor desactivado con éxito", data: result });
    } catch (error) {
      console.error("Error al desactivar rol de tutor:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async agregarRolAlumno(req, res) {
    const { idTutor } = req.body;
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.agregarRolAlumno(idTutor, performedBy);
      res
        .status(200)
        .json({ message: "Rol de alumno agregado con éxito", data: result });
    } catch (error) {
      console.error("Error al agregar rol de alumno:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async desactivarRolAlumno(req, res) {
    const { idTutor } = req.body;
    const performedBy = req.user.id;
    try {
      const result = await UsuarioService.desactivarRolAlumno(idTutor, performedBy);
      res
        .status(200)
        .json({ message: "Rol de alumno desactivado con éxito", data: result });
    } catch (error) {
      console.error("Error al desactivar rol de alumno:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async asignarUsuarioTipoTutoriaPorRol(req, res) {
    const { idUsuario, idTipoTutoria, esTutor } = req.body;
    const performedBy = req.user.id;
    try {
      const resultado = await UsuarioService.asignarUsuarioTipoTutoriaPorRol(
        idUsuario,
        idTipoTutoria,
        esTutor,
        performedBy
      );
      res.status(201).json({
        message: "Usuario asignado al tipo de tutoría con éxito",
        data: resultado,
      });
    } catch (error) {
      console.error("Error al asignar usuario al tipo de tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },
  async listarUsuariosPorCodigoRol(req, res) {
    const { datos, idCoord } = req.body;
    try {
      // Crear un arreglo para almacenar los usuarios válidos
      const usuariosValidos = [];
      for (const dato of datos) {
        const { codigo, rol } = dato;
        let aux = codigo.toString();
        while (aux.length < 8) {
          aux = "0" + aux;
        }
        const cod = aux;
        if (!cod || !rol) {
          return res.status(400).json({
            message: "Debe proporcionar el codigo del usuario y el rol",
            data: [],
          });
        }
        const resultado = await UsuarioService.listarUsuariosPorCodigoRol(
          cod,
          rol,
          idCoord
        );
        // Verificar si el resultado es exitoso y agregarlo al arreglo
        if (resultado.status === "success") {
          usuariosValidos.push(resultado.data);
        } else {
          // Aquí puedes decidir si quieres devolver los errores individuales o solo ignorarlos
          console.log(
            `Error con el código ${cod} y rol ${rol}: ${resultado.message}`
          );
        }
      }

      res.status(201).json({
        message: "Listado de usuarios por codigoRol con éxito",
        data: usuariosValidos,
      });
    } catch (error) {
      //console.error("Error al listar de usuarios por codigoRol:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error al listar de usuarios por codigoRol",
        error: error.message,
      });
    }
  },
  async verificarAlumnosHistoricoNotas(req, res) {
    try {
      const idCoord = req.body.idCoord;
      const filesData = req.files.map((file, index) => ({
        name: file.originalname,
        data: file.buffer, // El archivo como buffer
        codigo: req.body[`codigo_${index}`],
      }));

      const alumnosValidos =
        await UsuarioService.verificarAlumnosHistoricoNotas(idCoord, filesData);
      res.status(200).json({
        message: "Alumnos verificados con éxito",
        data: alumnosValidos,
      });
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error al verificar los alumnos",
        error: error.message,
      });
    }
  },

  async handlePasswordReset(req, res) {
    const { email, newPassword, token } = req.body;

    if (email) {
      try {
        const usuario = await Usuario.findOne({
          where: { email, esActivo: true },
        });
        if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        console.log(usuario);

        // Crear un token de restablecimiento
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Establecer la caducidad del token a 1 hora
        const resetExpires = Date.now() + 3600000; // 1 hora

        console.log(resetToken, resetExpires);

        await PasswordResetToken.create({
          fid_usuario: usuario.id_usuario,
          token: resetToken,
          expires: resetExpires,
        });

        // Enviar el correo electrónico
        const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

        console.log(resetLink);

        const mailOptions = {
          to: usuario.email,
          from: '"Equipo de Soporte" <mentify.soft@gmail.com>',
          subject: "Restablecimiento de contraseña",
          html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Hola ${usuario.nombres},</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña. Por favor, haz clic en el enlace de abajo para hacer el cambio:</p>
                    <p style="text-align: center;">
                        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #00C1BC; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
                    </p>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
                    <p>Gracias,</p>
                    <p style="font-weight: bold;">Equipo de Soporte</p>
                </div>
            `,
        };
        console.log(mailOptions);

        await transporter.sendMail(mailOptions);

        return res
          .status(200)
          .json({
            message: "Correo de restablecimiento de contraseña enviado",
          });
      } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    if (token && newPassword) {
      try {
        console.log("Token:", token);
        console.log("Current Time:", Date.now());

        const moment = require("moment");
        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        console.log(now);

        const resetToken = await PasswordResetToken.findOne({
          where: {
            token: token.id,
            expires: {
              [Op.gt]: now,
            },
          },
          include: {
            model: Usuario,
            as: "Usuario",
          },
        });

        if (!resetToken) {
          return res.status(400).json({ error: "Token inválido o expirado" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await resetToken.Usuario.update({
          contrasenha: hashedPassword,
        });

        await resetToken.destroy();

        return res
          .status(200)
          .json({ message: "Contraseña restablecida correctamente" });
      } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    return res.status(400).json({ error: "Solicitud inválida" });
  },
  async cargarMasivamenteNotasAlumnos(req, res) {
    const { alumnos, id_Creador } = req.body;
    const performedBy = req.user.id;

    if (!alumnos || !id_Creador) {
      return res.status(400).json({ message: "Datos de entrada inválidos" });
    }

    try {
      const result = await UsuarioService.cargarMasivamenteNotasAlumnos(
        alumnos,
        id_Creador,
        performedBy
      );
      res.status(200).json({
        message: "Notas cargadas con éxito",
        data: result,
      });
    } catch (error) {
      console.error("Error al cargar notas a la tutoría:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async listadoAlumnosEncuesta(req, res) {
    const {
      idCoord,
      page = 1,
      pageSize = 9,
      sortBy = "fechaCreacion",
      sortOrder = "DESC",
      searchValue = "",
    } = req.body;
    try {
      const resultado = await UsuarioService.listadoAlumnosEncuesta(
        idCoord,
        searchValue,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({
        message: "Error al listar alumnos con citas y encuestas",
        error: error.message,
      });
    }
  },

  async registrarDerivacion(req, res) {
    const {
      motivoDerivacion,
      antecedentes,
      comentarios,
      idAlumno,
      idTutor,
      tipoTutoria,
      unidadAcademica,
      idCita,
      facultad
    } = req.body;

    try {
      const performedBy = req.user.id;
      const resultado = await UsuarioService.registrarDerivacion({
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
      });

      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      if (error.message === "El alumno ya fue derivado") {
        res.status(409).json({ error: "El alumno ya fue derivado" });
      } else {
        res
          .status(500)
          .json({ error: error.message || "Error interno del servidor" });
      }
    }
  },

  async obtenerDerivacionDetalle(req, res) {
    const { idCita } = req.body;
    try {
      const resultado = await UsuarioService.obtenerDerivacionDetalle({
        idCita,
      });
      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error 
      res
        .status(500)
        .json({ error: error.message || "Error interno del servidor" });
    }
  },

  async listarDerivaciones(req, res) {
    const { idResponsable } = req.body;
    try {
      const resultado = await UsuarioService.listarDerivaciones({
        idResponsable,
      });
      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
    }
  },

  async enviarDerivacion(req, res) {
    const {
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
      facultad
    } = req.body;
    try {
      const performedBy = req.user.id;
      const resultado = await UsuarioService.enviarDerivacion({
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
      });
      res.status(200).json(resultado);
    } catch (error) {
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
    }
  },
  
  async obtenerFacultadesDisponibles(req, res) {
    try {
      const result = await UsuarioService.obtenerFacultadesDisponibles();
      res.status(200).json({
        message: "Facultades obtenidas con éxito",
        data: result,
      });
    } catch (error) {

      console.error("Error al obtener facultades:", error);
      await logError(error, req.user.id, req.originalUrl, req.method, req.body); // Log error
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = UsuarioController;