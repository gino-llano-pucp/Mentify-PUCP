'use strict';
const { update, orderBy } = require('lodash');
const db = require('../models');
const TipoTutoria = db.TipoTutoria;
const Facultad = db.Facultad;
const Programa = db.Programa;
const Usuario = db.Usuario;
const Rol = db.Rol;
const Roles_Usuario = db.Roles_Usuario;
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const AsignacionTipoTutoria = db.AsignacionTipoTutoria;
const TipoObligatoriedad = db.TipoObligatoriedad;
const TipoFormato = db.TipoFormato;
const TipoTutor = db.TipoTutor;
const TipoPermanencia = db.TipoPermanencia;
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const EstadoSolicitudTutorFijo = db.EstadoSolicitudTutorFijo;
const sequelize = db.sequelize;
const { Op, where } = require('sequelize');
const { parse } = require('next/dist/build/swc');
const AsignacionTipoTutoriaServices = require('../services/AsignacionTipoTutoriaServices');
const UsuarioService = require('../services/UsuarioService');
const { es } = require('date-fns/locale');

const TipoTutoriaServices = {
  async getIdFromName(modelName, name) {
    const model = db[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }
    const record = await model.findOne({ where: { nombre: name } });
    if (record) {
      const idField = Object.keys(record.dataValues).find((key) =>
        key.startsWith("id_")
      );
      return record[idField];
    }
    return null;
  },

  async getFacultadIdByUserId(userId) {
    const record = await Facultad.findOne({ where: { fid_usuario: userId } });
    if (record) {
      return record.id_facultad;
    }
    return null;
  },

  async getProgramaIdByUserId(userId) {
    const record = await Programa.findOne({ where: { fid_usuario: userId } });
    if (record) {
      return record.id_programa;
    }
    return null;
  },

  async listarTiposTutoriaPorCoordinador(
    inputSearch,
    idCoord,
    estado,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;

    const coordinador = await Usuario.findByPk(idCoord, {
      include: {
        model: Rol,
        as: "Roles",
        where: {
          nombre: {
            [Op.like]: "%Coordinador%",
          },
          es_activo: true, // Filtrar solo roles activos
        },
        through: { attributes: [], where: { es_activo: true }},
      },
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

    let whereConditions = {};
    if (rolCoordinador.nombre === "Coordinador de Programa") {
      const programa = await Programa.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      });
      if(programa){
        whereConditions.fid_programa = programa.id_programa;
      }
    } else if (rolCoordinador.nombre === "Coordinador de Facultad") {
      const facultad = await Facultad.findOne({
        where: { fid_usuario: idCoord, esActivo: true },
      });
      if(facultad){
        whereConditions.fid_facultad = facultad.id_facultad;
      }
    }

    if (inputSearch) {
      whereConditions = {
        ...whereConditions,
        nombre: { [Op.like]: `%${inputSearch}%` },
      };
    }

    if (estado && estado !== "Todos") {
      whereConditions.esActivo = estado === "Activo";
    }

    const tiposTutoria = await TipoTutoria.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: TipoObligatoriedad,
          as: "TipoObligatoriedad",
          attributes: ["nombre"],
        },
        { model: TipoFormato, as: "TipoFormato", attributes: ["nombre"] },
        { model: TipoTutor, as: "TipoTutor", attributes: ["nombre"] },
        {
          model: TipoPermanencia,
          as: "TipoPermanencia",
          attributes: ["nombre"],
        },
      ],
      order: [
        ["nombre", "ASC"],
      ]
    });

    const tiposTutoriaWithDetails = tiposTutoria.rows.map((tipoTutoria) => ({
      id: tipoTutoria.id_tipoTutoria,
      nombreTutoria: tipoTutoria.nombre,
      obligatoriedad: tipoTutoria.TipoObligatoriedad
        ? tipoTutoria.TipoObligatoriedad.nombre
        : null,
      formato: tipoTutoria.TipoFormato ? tipoTutoria.TipoFormato.nombre : null,
      tipoTutor: tipoTutoria.TipoTutor ? tipoTutoria.TipoTutor.nombre : null,
      duracion: tipoTutoria.TipoPermanencia
        ? tipoTutoria.TipoPermanencia.nombre
        : null,
      esActivo: tipoTutoria.esActivo,
    }));

    return {
      totalPages: Math.ceil(tiposTutoria.count / limit),
      currentPage: parseInt(page),
      totalTiposTutoria: tiposTutoria.count,
      tiposTutoria: tiposTutoriaWithDetails,
    };
  },

  async getTiposTutoriaByFacultad(userId) {
    const facultad = await db.Facultad.findOne({
      where: { fid_usuario: userId },
    });
    if (!facultad) {
      throw new Error("El usuario no está asociado a ninguna facultad");
    }

    const query = `
            SELECT 
                tt.id_tipoTutoria AS id,
                tt.nombre AS nombreTutoria,
                ob.nombre AS obligatoriedad,
                fo.nombre AS formato,
                tu.nombre AS tipoTutor,
                pe.nombre AS duracion,
                tt.esActivo
            FROM TipoTutoria tt
            LEFT JOIN TipoObligatoriedad ob ON tt.fid_tipoObligatoriedad = ob.id_tipoObligatoriedad
            LEFT JOIN TipoFormato fo ON tt.fid_tipoFormato = fo.id_tipoFormato
            LEFT JOIN TipoTutor tu ON tt.fid_tipoTutor = tu.id_tipoTutor
            LEFT JOIN TipoPermanencia pe ON tt.fid_tipoPermanencia = pe.id_tipoPermanencia
            WHERE tt.fid_facultad = :facultadId;
        `;

    const tiposTutoria = await sequelize.query(query, {
      replacements: { facultadId: facultad.id_facultad },
      type: sequelize.QueryTypes.SELECT,
    });

    return tiposTutoria;
  },

  async createTipoTutoria({
    nombre,
    id_tipo_obligatoriedad,
    id_tipo_permanencia,
    id_tipo_tutor,
    id_tipo_formato,
    id_fact_prog,
    esFacultad,
    performedBy,
  }) {

    if (esFacultad) { 
      return await TipoTutoria.create({
        nombre: nombre,
        fid_tipoObligatoriedad: id_tipo_obligatoriedad,
        fid_tipoPermanencia: id_tipo_permanencia,
        fid_tipoTutor: id_tipo_tutor,
        fid_tipoFormato: id_tipo_formato,
        fid_facultad: id_fact_prog,
        esActivo: true,
      }, { performedBy, individualHooks: true});
    } else {
      return await TipoTutoria.create({
        nombre: nombre,
        fid_tipoObligatoriedad: id_tipo_obligatoriedad,
        fid_tipoPermanencia: id_tipo_permanencia,
        fid_tipoTutor: id_tipo_tutor,
        fid_tipoFormato: id_tipo_formato,
        fid_programa: id_fact_prog,
        esActivo: true,
      }, { performedBy, individualHooks: true});
    }
  },
  async listarTiposTutoriaAsignados(codigoAlumno, rol) {
    // Buscar al alumno por su código
    const usuario = await Usuario.findOne({
      where: { codigo: codigoAlumno },
      include: {
        model: Rol,
        as: "Roles",
        where: { nombre: rol },
        through: { attributes: [] },
      },
    });

    if (!usuario) {
      throw new Error(`${rol} no encontrado o no es un ${rol}`);
    }

    // Obtener los tipos de tutoría asignados al usuario
    let asignaciones;
    if (rol === "Alumno") {
      asignaciones = await AsignacionTutorAlumno.findAll({
        where: { fid_alumno: usuario.id_usuario, esActivo: true },
        include: {
          model: TipoTutoria,
          as: "TipoTutoria",
          attributes: ["id_tipoTutoria", "nombre"],
        },
      });
    } else if (rol === "Tutor") {
      asignaciones = await AsignacionTipoTutoria.findAll({
        where: { fid_tutor: usuario.id_usuario, esActivo: true },
        include: {
          model: TipoTutoria,
          as: "TipoTutoria",
          attributes: ["id_tipoTutoria", "nombre"],
        },
      });
    } else {
      throw new Error("Rol no soportado");
    }

    return asignaciones.map((asignacion) => asignacion.TipoTutoria);
  },
  /*// Método para obtener todos los tipos de tutorías para un coordinador
    async listarTiposTutoriaParaCoordinador(codigoCoordinador) {
        // Buscar al coordinador por su código
        const coordinador = await Usuario.findOne({
            where: { codigo: codigoCoordinador },
            include: {
                model: Rol,
                as: 'Roles',
                where: { nombre: 'Coordinador de Facultad' },
                through: { attributes: [] }
            }
        });

        if (!coordinador) {
            throw new Error('Coordinador no encontrado o no es un Coordinador');
        }

        // Obtener la facultad del coordinador
        const fid_facultad = coordinador.fid_facultad;

        // Buscar todos los tipos de tutoría asociados a la facultad del coordinador
        const tiposTutoria = await TipoTutoria.findAll({
            where: { fid_facultad: fid_facultad, esActivo: true }
        });

        return tiposTutoria;
    },*/

  async getAllTipoTutorias() {
    return await TipoTutoria.findAll();
  },

  async getTipoTutoriaById(id) {
    return await TipoTutoria.findByPk(id);
  },

  async updateTipoTutoria(id, updateData, performedBy) {
    const tipoTutoria = await TipoTutoria.findByPk(id);
    if (!tipoTutoria) {
      return null;
    }
    console.log(updateData);

    if(updateData.esActivo && updateData.esActivo !== tipoTutoria.esActivo){
      await tipoTutoria.update({
        esActivo: updateData.esActivo,
      }, { performedBy, individualHooks: true});

      return tipoTutoria;
    }

    if(updateData.fid_tipoTutor !== tipoTutoria.fid_tipoTutor || updateData.fid_tipoFormato !== tipoTutoria.fid_tipoFormato){

      const asignaciones = await AsignacionTipoTutoria.findAll({
        where: { fid_tipoTutoria: id,
                  esActivo: true },
      });

      for(const asignacion of asignaciones){
        if(asignacion.esTutor === true){

          await SolicitudTutorFijo.update(
            {
              esActivo: false // Actualizar a inactivo
            },
            {
              where: {
                fid_tutor: asignacion.fid_usuario,
                esActivo: true,
                fid_estadoSolicitud: 1
              },
              performedBy,
              individualHooks: true
            }
          );

          const asignacionTutorAlumno = await AsignacionTutorAlumno.findAll({
            where: {
                fid_tutor: asignacion.fid_usuario,
                fid_tipoTutoria: id,
                esActivo: true
            },
          })
          for (const asignacionTA of asignacionTutorAlumno) {
              await UsuarioService.desasignarAlumnoTutor(asignacionTA.fid_alumno, asignacion.fid_usuario, id, performedBy)
          }
        }
      }
    }

    if (updateData.fid_tipoTutor) {
      await tipoTutoria.update({
        nombre: updateData.nombre,
        fid_tipoObligatoriedad: updateData.fid_tipoObligatoriedad,
        fid_tipoPermanencia: updateData.fid_tipoPermanencia,
        fid_tipoTutor: updateData.fid_tipoTutor,
        fid_tipoFormato: updateData.fid_tipoFormato,
        esActivo: updateData.esActivo,
      }, { performedBy, individualHooks: true});
    } else {
      await tipoTutoria.update({
        nombre: updateData.nombre,
        fid_tipoObligatoriedad: updateData.fid_tipoObligatoriedad,
        fid_tipoPermanencia: updateData.fid_tipoPermanencia,
        fid_tipoFormato: updateData.fid_tipoFormato,
        fid_tipoTutor: null,
        esActivo: updateData.esActivo,
      }, { performedBy, individualHooks: true});
    }

    return tipoTutoria;
  },

  async deleteLogicalTipoTutoria(id, performedBy) {
    const tipoTutoria = await TipoTutoria.findByPk(id);
    if (!tipoTutoria) {
      return null;
    }
    await tipoTutoria.update({ esActivo: false }, { performedBy, individualHooks: true});

    const asignaciones = await AsignacionTipoTutoria.findAll({
      where: { fid_tipoTutoria: id,
                esActivo: true },
    });

    for(const asignacion of asignaciones){
      if(asignacion.esTutor === true){
        await SolicitudTutorFijo.update(
          {
            esActivo: false // Actualizar a inactivo
          },
          {
            where: {
              fid_tutor: asignacion.fid_usuario,
              esActivo: true,
              fid_estadoSolicitud: 1
            },
            performedBy,
            individualHooks: true
          }
        );
      }

      await AsignacionTipoTutoriaServices.eliminarAsignacionTipoTutoria(asignacion.fid_usuario, id, performedBy)
    }
    return tipoTutoria;
  },
  async obtenerIdPorNombre(nombre) {
    const tipoTutoria = await TipoTutoria.findOne({
      where: {
        nombre: nombre,
      },
    });
    return tipoTutoria.id_tipoTutoria;
  },
  async agregarUsuarioATipoTutoria(idUsuario, idTipoTutoria, nameRol, performedBy) {
    // Validar que el usuario exista y esté activo
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    if (!usuario.esActivo) {
      throw new Error("El usuario no está activo");
    }

    // Validar que el tipo de tutoría exista
    const tipoTutoria = await TipoTutoria.findByPk(idTipoTutoria);
    if (!tipoTutoria) {
      throw new Error("Tipo de Tutoría no encontrado");
    }

    let valorcito = false;
    // Verificar que el usuario tenga el rol correspondiente
    if (nameRol === "Tutor") {
      valorcito = true;
    }

    // Verificar si la asignación ya existe
    const asignacionExistente = await AsignacionTipoTutoria.findOne({
      where: {
        fid_usuario: idUsuario,
        fid_tipoTutoria: idTipoTutoria,
      },
    });
    if (asignacionExistente) {
      // Si la asignación ya existe, esactivo es true
      await asignacionExistente.update({ esActivo: true, esTutor: valorcito }, { performedBy, individualHooks: true});
      return asignacionExistente;
    }

    // Crear la nueva asignación
    const nuevaAsignacion = await AsignacionTipoTutoria.create({
      fid_usuario: idUsuario,
      fid_tipoTutoria: idTipoTutoria,
      esTutor: valorcito,
      esActivo: true,
    }, { performedBy, individualHooks: true});

    return nuevaAsignacion;
  },

  async reiniciarTemporales(idCoor, performedBy) {
      idCoor = parseInt(idCoor);
      try {
          // Obtener facultad o programa del coordinador
          const facultad = await Facultad.findOne({
              where: { fid_usuario: idCoor, esActivo: true },
          });
          const programa = await Programa.findOne({
              where: { fid_usuario: idCoor, esActivo: true },
          });

          if (!facultad && !programa) {
              throw new Error(
                  "El coordinador no está asociado a ninguna facultad o programa"
              );
          }

          let tiposTutoriaTemporales;

          if (facultad) {
              // Obtener todos los tipos de tutoría temporales de la facultad
              tiposTutoriaTemporales = await TipoTutoria.findAll({
                  where: {
                      fid_facultad: facultad.id_facultad,
                      fid_tipoPermanencia: 2,
                  },
              });
          } else if (programa) {
              // Obtener todos los tipos de tutoría temporales del programa
              tiposTutoriaTemporales = await TipoTutoria.findAll({
                  where: {
                      fid_programa: programa.id_programa,
                      fid_tipoPermanencia: 2,
                  },
              });
          }

          console.log("tiposTutoriaTemporales: ");
          console.log(tiposTutoriaTemporales);

          // Vaciar usuarios de los tipos de tutoría temporales
          for (const tipoTutoria of tiposTutoriaTemporales) {

              const asignaciones = await AsignacionTipoTutoria.findAll({
                  where: { fid_tipoTutoria: tipoTutoria.id_tipoTutoria, esActivo: true },
              });

              for (const asignacion of asignaciones) {
                if(asignacion.esTutor === false){
                  await AsignacionTipoTutoriaServices.eliminarAsignacionTipoTutoria(asignacion.fid_usuario, tipoTutoria.id_tipoTutoria, performedBy)
                }
              }
          }

          return {
              message: "Usuarios de los tipos de tutoría temporales vaciados con éxito, y solicitudes de asignación inactivadas",
          };
      } catch (error) {
          throw new Error(
              "Error al reiniciar tipos de tutoría temporales: " + error.message
          );
      }
  },

  async listarTiposTutoriaAlumno(idAlumno) {
    idAlumno = parseInt(idAlumno);
    try {
      // Verificar que el usuario tiene el rol de alumno
      const alumnoRol = await Rol.findOne({
        where: { nombre: "Alumno" },
        attributes: ["id_rol"],
      });

      if (!alumnoRol) {
        throw new Error("Rol de Alumno no encontrado");
      }

      const rolesUsuario = await Roles_Usuario.findOne({
        where: {
          id_usuario: idAlumno,
          id_rol: alumnoRol.id_rol,
          es_activo: true,
        },
      });

      if (!rolesUsuario) {
        throw new Error(
          "El usuario no tiene el rol de alumno o no está activo"
        );
      }

      // Obtener los tipos de tutoría a los que el alumno ya está asignado con un tutor activo
      const asignaciones = await AsignacionTutorAlumno.findAll({
        where: { fid_alumno: idAlumno, esActivo: true },
        attributes: ["fid_tipoTutoria"],
      });

      const tiposAsignados = asignaciones.map(
        (asignacion) => asignacion.fid_tipoTutoria
      );

      // Obtener los tipos de tutoría con solicitudes pendientes
      const solicitudesPendientes = await SolicitudTutorFijo.findAll({
        where: {
          fid_alumno: idAlumno,
          fid_estadoSolicitud: 1, // Pendiente, En espera
          esActivo: true,
        },
        attributes: ["fid_tipoTutoria"],
      });

      const tiposSolicitadosPendientes = solicitudesPendientes.map(
        (solicitud) => solicitud.fid_tipoTutoria
      );

      // Combinar los tipos de tutoría asignados y con solicitudes pendientes
      const tiposExcluir = [
        ...new Set([...tiposAsignados, ...tiposSolicitadosPendientes]),
      ];

      // Obtener todos los tipos de tutoría asignados al alumno, excluyendo aquellos con tutor asignado o solicitudes pendientes
      const tiposTutoriaAsignados = await AsignacionTipoTutoria.findAll({
        where: {
          fid_usuario: idAlumno,
          esTutor: false,
          esActivo: true,
        },
        attributes: ["fid_tipoTutoria"],
      });

      const tiposAsignadosIds = tiposTutoriaAsignados.map(
        (asignacion) => asignacion.fid_tipoTutoria
      );

      const tiposTutoria = await TipoTutoria.findAll({
        where: {
          id_tipoTutoria: {
            [Op.in]: tiposAsignadosIds,
            [Op.notIn]: tiposExcluir,
          },
          fid_tipoTutor: 2,
          esActivo: true,
        },
        attributes: ["id_tipoTutoria", "nombre"],
        order: [["nombre", "ASC"]],
      });

      return tiposTutoria.map((tipo) => ({
        id: tipo.id_tipoTutoria,
        nombreTutoria: tipo.nombre,
      }));
    } catch (error) {
      throw new Error(
        "Error al listar tipos de tutoría para el alumno: " + error.message
      );
    }
  },

  async listarTiposTutoriaPorCoordinador2(idCoord) {
    try {
      idCoord = parseInt(idCoord);
      console.log("idCoord: " + idCoord);
      if (isNaN(idCoord)) {
        throw new Error("El ID del coordinador no es válido");
      }

      // Obtener el rol de coordinador de facultad o programa
      const rolCoordinadorFacultad = 1; // ID del rol de Coordinador de Facultad
      const rolCoordinadorPrograma = 2; // ID del rol de Coordinador de Programa

      // Verificar el rol del usuario coordinador en roles_usuario
      const rolesUsuario = await Roles_Usuario.findOne({
        where: {
          id_usuario: idCoord,
          id_rol: { [Op.in]: [rolCoordinadorFacultad, rolCoordinadorPrograma] },
          es_activo: true,
        },
      });

      if (!rolesUsuario) {
        throw new Error(
          "El usuario no tiene el rol de coordinador o no está activo"
        );
      }

      const rolCoordinador = await Rol.findByPk(rolesUsuario.id_rol);

      // Buscar el coordinador en la tabla Usuario
      const coordinador = await Usuario.findByPk(idCoord);

      if (!coordinador) {
        throw new Error("Coordinador no encontrado");
      }

      let whereConditions = {
        fid_tipoTutor: 2, // Filtro para que sea del tipo tutor específico
        esActivo: true,
      };

      if (rolCoordinador.nombre === "Coordinador de Facultad") {
        const facultad = await Facultad.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
        if (facultad) {
          whereConditions.fid_facultad = facultad.id_facultad;
        } else {
          throw new Error(
            "El coordinador de facultad no tiene una facultad asignada"
          );
        }
      } else if (rolCoordinador.nombre === "Coordinador de Programa") {
        const programa = await Programa.findOne({
          where: { fid_usuario: idCoord, esActivo: true },
        });
        if (programa) {
          whereConditions.fid_programa = programa.id_programa;
        } else {
          throw new Error(
            "El coordinador de programa no tiene un programa asignado"
          );
        }
      } else {
        throw new Error("Rol de coordinador no válido");
      }

      const tiposTutoria = await TipoTutoria.findAll({
        where: whereConditions,
        attributes: ["id_tipoTutoria", "nombre"],
        order: [["nombre", "ASC"]],
      });

      return tiposTutoria.map((tipo) => ({
        id: tipo.id_tipoTutoria,
        nombreTutoria: tipo.nombre,
      }));
    } catch (error) {
      throw new Error(
        "Error al listar tipos de tutoría para el coordinador: " + error.message
      );
    }
  },
  async listarTiposTutoriaReporte(idCoordinador, idPrograma, filtroFacultadPrograma) {
    idCoordinador = parseInt(idCoordinador);
    const whereConditions = {};
  
    // Fetch the coordinator with roles based on idCoordinador
    const coordinador = await Usuario.findOne({
      where: { id_usuario: idCoordinador },
      include: [
        {
          model: Rol,
          as: 'Roles',
          where: { nombre: { [Op.in]: ['Coordinador de Facultad', 'Coordinador de Programa'] } },
          through: { attributes: [], where: { es_activo: true }}
        }
      ]
    });
  
    if (!coordinador) {
      throw new Error('Coordinador no encontrado');
    }
  
    const esCoordinadorFacultad = coordinador.Roles.some(rol => rol.nombre === 'Coordinador de Facultad');
    const esCoordinadorPrograma = coordinador.Roles.some(rol => rol.nombre === 'Coordinador de Programa');

    console.log('esCoordinadorFacultad: ' + esCoordinadorFacultad);
    console.log('esCoordinadorPrograma: ' + esCoordinadorPrograma);
    console.log('idPrograma: ' + idPrograma); 
  
    let facultad, programa;
  
    if (esCoordinadorFacultad) {
          // Find the faculty where the user is the coordinator
          facultad = await Facultad.findOne({
            where: { fid_usuario: idCoordinador, esActivo: true },
            attributes: ['id_facultad']
          });
      
          if ( !facultad ) {
            throw new Error('Facultad no encontrada para el Coordinador de Facultad');
          }

          if (filtroFacultadPrograma === 0) {
            whereConditions[Op.or] = [
                { fid_programa: { [Op.in]: Array.isArray(idPrograma) ? idPrograma : [idPrograma] } },
                { fid_facultad: facultad.id_facultad }
            ];
          } else if (filtroFacultadPrograma === 1) {
              whereConditions.fid_facultad = facultad.id_facultad;
          } else if (filtroFacultadPrograma === 2) {
              whereConditions.fid_programa = { [Op.in]: Array.isArray(idPrograma) ? idPrograma : [idPrograma] };
          }


    } else if (esCoordinadorPrograma) {
          // Find the program where the user is the coordinator
          programa = await Programa.findOne({
            where: { fid_usuario: idCoordinador, esActivo: true },
            attributes: ['id_programa']
          });
      
          if ( !programa ) {
            throw new Error('Programa no encontrado para el Coordinador de Programa');
          }


          whereConditions.fid_programa = {
            [Op.in]: [programa.id_programa]
          };
          

    } else {
      throw new Error('Usuario no tiene rol de Coordinador de Facultad ni Coordinador de Programa');
    }

    console.log('whereConditions: ');
    console.log(whereConditions);
  
    const tiposTutoria = await TipoTutoria.findAll({
      where: whereConditions,
      attributes: ['id_tipoTutoria', 'nombre'],
      order: [['nombre', 'ASC']]
    });
  
    return tiposTutoria.map(tipo => ({
      id: tipo.id_tipoTutoria,
      nombreTutoria: tipo.nombre,
    }));
  }
  
  

};

module.exports = TipoTutoriaServices;
