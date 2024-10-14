const TipoTutoriaServices = require('../services/TipoTutoriaServices');
const db = require('../models');
const TipoTutoria = db.TipoTutoria;
const Roles_Usuario = db.Roles_Usuario;
const Usuario = db.Usuario;
const Rol = db.Rol;
const { Op } = require('sequelize');
const logError = require('../utils/loggingErrors');
const { es } = require('date-fns/locale');

/*const { TipoObligatoriedad, TipoPermanencia, TipoTutor, TipoFormato } = require('../models'); */

const TipoTutoriaController = {
    async createTipoTutoria(req, res) {
        const { nombre, tipo_obligatoriedad, tipo_permanencia, tipo_tutor, tipo_formato } = req.body;
        const userId = req.user.id;
        const performedBy = req.user.id;

        // Verificación de campos requeridos
        if (!nombre || !tipo_obligatoriedad || !tipo_permanencia || !tipo_formato) {
            return res.status(400).json({ error: { message: 'Todos los campos excepto id_tipoTutor son obligatorios' } });
        }
    
        try {
          // Verificar el rol del usuario coordinador en roles_usuario
          const rolesUsuario = await Roles_Usuario.findOne({
            where: {
              id_usuario: userId,
              id_rol: {
                [Op.in]: [1, 2]
              },
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
          const coordinador = await Usuario.findByPk(userId);

          if (!coordinador) {
            throw new Error("Coordinador no encontrado");
          }
          let id_fact_prog = null;
          let esFacultad = false;
          if (rolCoordinador.nombre === "Coordinador de Facultad") {
            id_fact_prog = await TipoTutoriaServices.getFacultadIdByUserId(
              userId
            );

            if (!id_fact_prog) {
              return res.status(400).json({
                error: {
                  message: "El coordinador no está asociado a ninguna facultad",
                },
              });
            }
            esFacultad = true;
          } else if (rolCoordinador.nombre === "Coordinador de Programa") {
            id_fact_prog = await TipoTutoriaServices.getProgramaIdByUserId(
              userId
            );

            if (!id_fact_prog) {
              return res.status(400).json({
                error: {
                  message: "El coordinador no está asociado a ningún programa",
                },
              });
            }
            esFacultad = false;
          }

          // Insertar null en fid_tipo_tutor si id_tipoFormato es igual a 2
          const fid_tipo_tutor =
            tipo_formato === "2" ? null : parseInt(tipo_tutor);

          if(esFacultad) {
            const tipoTutoEncontra = await TipoTutoria.findOne({
                where: {
                  nombre: nombre,
                  fid_facultad: id_fact_prog
                },
              });
              if(tipoTutoEncontra){
                return res.status(500).json({
                  message:
                    "El tipo de tutoría ya existe",
                });
              }
          }else{
            const tipoTutoEncontra = await TipoTutoria.findOne({
                where: {
                  nombre: nombre,
                  fid_programa: id_fact_prog
                },
              });
              if (tipoTutoEncontra) {
                return res.status(500).json({
                  message:
                    "El tipo de tutoría ya existe",
                });
              }
          }

          const nuevoTipoTutoria = await TipoTutoriaServices.createTipoTutoria({
            nombre,
            id_tipo_obligatoriedad: parseInt(tipo_obligatoriedad),
            id_tipo_permanencia: parseInt(tipo_permanencia),
            id_tipo_tutor: fid_tipo_tutor,
            id_tipo_formato: parseInt(tipo_formato),
            id_fact_prog,
            esFacultad,
            performedBy
          });

          res.status(201).json({
            message: "TipoTutoria creado con éxito",
            nuevoTipoTutoria,
          });
        } catch (err) {
            console.error("Error creando el tipo de tutoría.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    
    async getTiposTutoriaPorCoordinador(req, res) {
        const { inputSearch, idCoord, estado, page, pageSize, sortBy, sortOrder } = req.body;

        try {
            const result = await TipoTutoriaServices.listarTiposTutoriaPorCoordinador(inputSearch, idCoord, estado, page, pageSize, sortBy, sortOrder);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error al listar tipos de tutoría:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ message: 'Error al listar tipos de tutoría.' });
        }
    },
    
    async listarTiposTutoriaAsignados(req, res) {
        const { codigoUsuario, rol } = req.body;

        try {
            const tiposTutoria = await TipoTutoriaServices.listarTiposTutoriaAsignados(codigoUsuario, rol);
            res.status(200).json(tiposTutoria);
        } catch (error) {
          await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(400).json({ error: error.message });
        }
    },
    /*async listarTiposTutoriaParaCoordinador(req, res) {
        try {
            const { codigoCoordinador } = req.query; // Suponiendo que el código del coordinador viene como query param
            const tiposTutoria = await TipoTutoriaServices.listarTiposTutoriaParaCoordinador(codigoCoordinador);
            res.status(200).json(tiposTutoria);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },*/

    async getAllTipoTutorias(req, res) {
        try {
            const tipoTutorias = await TipoTutoriaServices.getAllTipoTutorias();
            res.status(200).json(tipoTutorias);
        } catch (err) {
            console.error("Error obteniendo los TipoTutoria.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTiposTutoriaByFacultad(req, res) {
        const userId = req.user.id;

        try {
            const tiposTutoria = await TipoTutoriaServices.getTiposTutoriaByFacultad(userId);
            res.status(200).json(tiposTutoria);
        } catch (err) {
            console.error("Error obteniendo los tipos de tutoría.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoTutoriaById(req, res) {
        const { id } = req.params;
        try {
            const tipoTutoria = await TipoTutoriaServices.getTipoTutoriaById(id);
            if (!tipoTutoria) {
                return res.status(404).json({ error: 'TipoTutoria no encontrado' });
            }
            res.status(200).json(tipoTutoria);
        } catch (err) {
            console.error("Error obteniendo el TipoTutoria.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoTutoria(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const performedBy = req.user.id;
        try {
            const tipoTutoriaActualizado = await TipoTutoriaServices.updateTipoTutoria(id, updateData, performedBy);
            if (!tipoTutoriaActualizado) {
                return res.status(404).json({ error: 'TipoTutoria no encontrado' });
            }
            res.status(200).json({
                message: "TipoTutoria actualizado con éxito",
                tipoTutoriaActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoTutoria.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoTutoria(req, res) {
        const { id } = req.params;
        const performedBy = req.user.id;
        try {
            const result = await TipoTutoriaServices.deleteLogicalTipoTutoria(id, performedBy);
            if (!result) {
                return res.status(404).json({ error: 'TipoTutoria no encontrado' });
            }
            res.status(200).json({
                message: "TipoTutoria eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoTutoria.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    
    async agregarUsuarioATipoTutoria(req, res) {
        const { idUsuario, idTipoTutoria,nameRol } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaAsignacion =
              await TipoTutoriaServices.agregarUsuarioATipoTutoria(
                idUsuario,
                idTipoTutoria,
                nameRol,
                performedBy
              );
            res.status(201).json({ message: 'Usuario asignado al tipo de tutoría con éxito', nuevaAsignacion });
        } catch (error) {
            console.error('Error al asignar usuario al tipo de tutoría:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);  
            res.status(400).json({ error: error.message });
        }
    },

    // Método para reiniciar tipos de tutoría temporales
    async reiniciarTemporales(req, res) {
        const { idCoor } = req.body;
        const performedBy = req.user.id;
        if (!idCoor) {
            return res.status(400).json({
                message: "Debe proporcionar el id del coordinador",
                data: []
            });
        }

        try {
            const result = await TipoTutoriaServices.reiniciarTemporales(idCoor, performedBy);
            res.status(200).json({
                message: "Tipos de tutoría temporales reiniciados con éxito",
                result
            });
        } catch (error) {
            console.error('Error al reiniciar tipos de tutoría temporales:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);  
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async listarTiposTutoriaAlumno(req, res) {
        const { idAlumno } = req.body;
        
        if (!idAlumno) {
            return res.status(400).json({
                message: "Debe proporcionar el id del alumno",
                data: []
            });
        }

        try {
            const result = await TipoTutoriaServices.listarTiposTutoriaAlumno(idAlumno);
            res.status(200).json({
                message: "Tipos de tutoría listados con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar tipos de tutoría para el alumno:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async listarTiposTutoriaPorCoordinador(req, res) {
        const { idCoord } = req.body;

        if (!idCoord) {
            return res.status(400).json({
                message: "Debe proporcionar el id del coordinador",
                data: []
            });
        }

        try {
            const result = await TipoTutoriaServices.listarTiposTutoriaPorCoordinador2(idCoord);
            res.status(200).json({
                message: "Tipos de tutoría listados con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar tipos de tutoría para el coordinador:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    async listarTiposTutoriaReporte(req, res) {
        try {
            const { idCoordinador, idPrograma, filtroFacultadPrograma} = req.body;
            const tiposTutoria = await TipoTutoriaServices.listarTiposTutoriaReporte(idCoordinador, idPrograma, filtroFacultadPrograma);
            res.status(200).json(tiposTutoria);
          } catch (error) {
            console.log(error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: error.message });
        }
      },
};

module.exports = TipoTutoriaController;
