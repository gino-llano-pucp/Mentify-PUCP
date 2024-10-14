const db = require('../models');
const { Sequelize, Op, where, or } = require('sequelize');
const momentM = require('moment');
const SesionCita = db.SesionCita;
const Disponibilidad = db.Disponibilidad;
const Usuario = db.Usuario;
const TipoTutoria = db.TipoTutoria;
const AsignacionTutorAlumno = db.AsignacionTutorAlumno;
const TipoModalidad = db.TipoModalidad;
const AlumnoSesionCita = db.AlumnoSesionCita;
const Programa = db.Programa;
const CompromisoCita = db.CompromisoCita;
const ResultadoCita = db.ResultadoCita;
const sequelize = db.sequelize;
const EstadoCita = db.EstadoCita;
const SolicitudTutorFijo = db.SolicitudTutorFijo;
const Encuesta = db.Encuesta;
const Pregunta = db.Pregunta;
const Respuesta = db.Respuesta;
const Opcion = db.Opcion;
const EstadoEncuesta = db.EstadoEncuesta;
const HistorialCitas = db.HistorialCitas;
const AsistenciaSesionCita = db.AsistenciaCita;
const Facultad = db.Facultad
const EncuestaMaestra = db.EncuestaMaestra
const EstadoCompromisoCita = db.EstadoCompromisoCita;
const Derivacion = db.Derivacion;

const moment = require('moment-timezone');
const { format, parse, parseISO, isEqual, isBefore, isAfter, isWithinInterval } = require('date-fns');
const { crearNotificacion } = require('../utils/notificationHelpers');

const buscarRangoFechas = (disponibilidades, fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    console.log("Fecha de inicio de la cita:", inicio);
    console.log("Fecha de fin de la cita:", fin);

    for (let i = 0; i < disponibilidades.length; i++) {
        const dispInicio = new Date(disponibilidades[i].fechaHoraInicio);
        const dispFin = new Date(disponibilidades[i].fechaHoraFin);

        console.log(`Disponibilidad ${i} - Inicio: ${dispInicio}, Fin: ${dispFin}`);
        
        if (inicio >= dispInicio && fin <= dispFin) {
            return i;
        }
    }

    return -1; // Retorna -1 si no encuentra una disponibilidad adecuada
};

const dividirRangoFecha = (inicioOriginal, finOriginal, inicioCita, finCita) => {
    const rangos = [];
    if (inicioOriginal < inicioCita) {
        rangos.push({ inicio: inicioOriginal, fin: inicioCita });
    }
    if (finCita < finOriginal) {
        rangos.push({ inicio: finCita, fin: finOriginal });
    }
    return rangos;
};


const SesionCitaServices = {
    async insertarXTutorIndividual(citaData, idTutor, performedBy) {
        console.log("data de la cita: ", citaData);
        try {
            const modalidad = await TipoModalidad.findOne({
                where: {
                    nombre: citaData.modalidad.tipo
                }
            });
            
            // Convertir las fechas a UTC
            const fechaHoraInicioUTC = moment.tz(citaData.fechaHoraInicio, 'America/Lima').utc().format();
            const fechaHoraFinUTC = moment.tz(citaData.fechaHoraFin, 'America/Lima').utc().format();
    
            // Validar si ya existe una cita con el mismo tutor, tipo de tutoría y en el mismo horario
            const existingCita = await SesionCita.findOne({
                where: {
                    fid_tutor: idTutor,
                    fid_tipoTutoria: citaData.idTipoDeTutoria,
                    fid_alumno: citaData.idAlumno,
                    fechaHoraInicio: citaData.fechaHoraInicio,
                    fechaHoraFin: citaData.fechaHoraFin,
                }
            });
    
            if (existingCita) {
                throw new Error('Ya existe una cita con estos mismos detalles');
            }
            
            // Registar cita por el alumno
            const sesionCita = await SesionCita.create({
                fid_tutor: idTutor,
                fid_tipoTutoria: citaData.idTipoDeTutoria,
                fechaHoraInicio: fechaHoraInicioUTC,
                fechaHoraFin: fechaHoraFinUTC,
                fid_alumno: citaData.idAlumno,
                fid_tipoModalidad: modalidad.id_tipoModalidad,
                fid_estado_cita: 1, //ESTADO PROGRAMADO
                lugar_link: citaData.modalidad.valor,
                esActivo: true,
            }, { performedBy, individualHooks: true });
    
            return sesionCita;
            //falta validar que existan los fid
            
        } catch (error) {
            throw error;
        }
    },

    async registrarCita(citaData, idTutor, performedBy) {
        const { idTipoDeTutoria, idAlumnos, fechaHoraInicio, fechaHoraFin } = citaData;

        return await sequelize.transaction(async (t) => {
            const modalidad = await TipoModalidad.findOne({
                where: { nombre: citaData.modalidad.tipo },
                transaction: t  // Incluye la transacción
            });

            const correctedFechaHoraInicio = moment(fechaHoraInicio);
            const correctedFechaHoraFin = moment(fechaHoraFin);

            if (!correctedFechaHoraInicio.isValid() || !correctedFechaHoraFin.isValid()) {
                throw new Error("Formato de fecha incorrecto.");
            }

            const fechaHoraInicioUTC = moment.tz(correctedFechaHoraInicio, 'America/Lima').utc().toDate();
            const fechaHoraFinUTC = moment.tz(correctedFechaHoraFin, 'America/Lima').utc().toDate();

            const disponibilidadActual = await Disponibilidad.findAll({
                where: { fid_tutor: idTutor, esActivo: true },
                transaction: t  // Incluye la transacción
            });

            const posicionDisponibilidad = buscarRangoFechas(disponibilidadActual, fechaHoraInicioUTC, fechaHoraFinUTC);
            if (posicionDisponibilidad === -1) {
                throw new Error("ERROR NO HAY DISPONIBILIDAD");
            }

            const disponibilidadCorrespondiente = disponibilidadActual[posicionDisponibilidad];
            const nuevaDisponibilidad = dividirRangoFecha(disponibilidadCorrespondiente.fechaHoraInicio, disponibilidadCorrespondiente.fechaHoraFin, fechaHoraInicioUTC, fechaHoraFinUTC);
            const arregloDisponibilidades = [];

            for (let i = 0; i < nuevaDisponibilidad.length; i++) {
                arregloDisponibilidades.push({
                    fid_tutor: idTutor,
                    fechaHoraInicio: nuevaDisponibilidad[i].inicio,
                    fechaHoraFin: nuevaDisponibilidad[i].fin,
                    esActivo: true
                });
            }

            // Actualizar la disponibilidad existente a no activa
            await Disponibilidad.update({ esActivo: false }, {
                where: { id_disponibilidad: disponibilidadCorrespondiente.id_disponibilidad },
                transaction: t,
                performedBy,
                individualHooks: true
            });

            // Insertar las nuevas disponibilidades
            const nuevasDisponibilidades = await Disponibilidad.bulkCreate(arregloDisponibilidades, { transaction: t, performedBy, individualHooks: true});

            const nuevaCita = await SesionCita.create({
                fid_tutor: idTutor,
                fid_tipoTutoria: idTipoDeTutoria,
                fechaHoraInicio: fechaHoraInicioUTC,
                fechaHoraFin: fechaHoraFinUTC,
                fid_tipoModalidad: modalidad.id_tipoModalidad,
                fid_estado_cita: 1,
                lugar_link: citaData.modalidad.valor,
                esActivo: true
            }, { transaction: t, performedBy, individualHooks: true});

            if (!nuevaCita) {
                throw new Error('Error al crear la sesión de cita');
            }

            for (let idAlumno of idAlumnos) {
                await AlumnoSesionCita.create({
                    fid_alumno: idAlumno,
                    fid_sesionCita: nuevaCita.id_cita
                }, { transaction: t, performedBy, individualHooks: true});

                await crearNotificacion(
                    idAlumno,
                    nuevaCita.id_cita,
                    "confirmación",
                    {
                        fechaHoraInicio: nuevaCita.fechaHoraInicio,
                        fechaHoraFin: nuevaCita.fechaHoraFin,
                        modalidad: modalidad.nombre,
                        lugar: nuevaCita.lugar_link
                    },
                    t,
                    performedBy
                );
            }

            return {
                cita: nuevaCita,
                disponibilidades: nuevasDisponibilidades
            };
        });
    },

    async insertarXTutorGrupal(citaData, performedBy) {
      const t = await sequelize.transaction(); // Iniciar una transacción
      try {
          const modalidad = await TipoModalidad.findOne({
              where: { nombre: citaData.modalidad.tipo }
          }, { transaction: t });
  
          const asignaciones = await AsignacionTutorAlumno.findAll({
              where: {
                  fid_tutor: citaData.idTutor,
                  fid_tipoTutoria: citaData.idTipoDeTutoria
              }
          }, { transaction: t });
  
          if (asignaciones.length === 0) {
              throw new Error('No hay alumnos asignados a este tutor y tipo de tutoría');
          }
  
          // Preparar inserciones verificando duplicados
          let citasParaCrear = [];
          let errores = [];
          for (const asignacion of asignaciones) {
              // Verificar si ya existe una cita
              const existingCita = await SesionCita.findOne({
                  where: {
                      fid_tutor: citaData.idTutor,
                      fid_tipoTutoria: citaData.idTipoDeTutoria,
                      fid_alumno: asignacion.fid_alumno,
                      fechaHoraInicio: citaData.fechaHoraInicio,
                      fechaHoraFin: citaData.fechaHoraFin,
                  },
                  transaction: t
              });
              
              if (!existingCita) {
                  citasParaCrear.push({
                      fid_tutor: citaData.idTutor,
                      fid_tipoTutoria: citaData.idTipoDeTutoria,
                      fechaHoraInicio: citaData.fechaHoraInicio,
                      fechaHoraFin: citaData.fechaHoraFin,
                      fid_alumno: asignacion.fid_alumno,
                      fid_tipoModalidad: modalidad.id_tipoModalidad,
                      fid_estado_cita: 1, //ESTADO PROGRAMADO
                      lugar_link: citaData.modalidad.valor,
                      esActivo: true
                  });
              } else {
                  throw new Error('Ya existe una cita con estos mismos detalles');
              }
          }
          
          
          // Insertar en batch si hay citas para crear
          let citasCreadas = [];
          if (citasParaCrear.length > 0) {
              citasCreadas = await SesionCita.bulkCreate(citasParaCrear, { transaction: t, performedBy, individualHooks: true});
          }
  
          await t.commit(); // Comprometer la transacción
          return { citasCreadas, errores };
      } catch (error) {
          await t.rollback(); // Revertir la transacción en caso de error
          throw error;
      }
  },
  
  
  

    async cancelarCita(idCita,data,performedBy) {
        const motivo = data.motivoRechazo;
        const t = await sequelize.transaction(); // Inicia una transacción
    
        try {
            const cita = await SesionCita.findByPk(idCita, { transaction: t });
            if (!cita) {
                throw new Error('La cita no existe');
            }
    
            // Verifica si la cita ya está desactivada
            if (!cita.fid_estado_cita == 3) {
                throw new Error('La cita ya está cancelada y no puede ser cancelada nuevamente');
            }
    
            // Realiza un eliminado lógico actualizando el campo 'esActivo' y el estado de la cita
            await cita.update({
                esActivo: true,
                fid_estado_cita: 3, // Estado 'cancelado'
                motivoRechazo: motivo
            }, { transaction: t , performedBy, individualHooks: true});
    
            // Obtener los IDs de los alumnos asociados a la cita
            const alumnosCita = await AlumnoSesionCita.findAll({
                where: { fid_sesionCita: idCita },
                transaction: t
            });
            const idAlumnos = alumnosCita.map(alumno => alumno.fid_alumno);

            const modalidad = await TipoModalidad.findOne({
                where: { id_tipoModalidad: cita.fid_tipoModalidad },
                transaction: t  // Incluye la transacción
            });
    
            // Crear una notificación de tipo 'cancelación' para cada alumno asociado
            for (const idAlumno of idAlumnos) {
                await crearNotificacion(idAlumno, idCita, 'cancelación', {
                    fechaHoraInicio: cita.fechaHoraInicio, // Incluir estos datos si es relevante
                    fechaHoraFin: cita.fechaHoraFin,
                    modalidad: modalidad.nombre,
                    lugar: cita.lugar_link
                }, t, performedBy);
            }
    
            await t.commit(); // Comprometer la transacción
            return { message: 'Cita cancelada correctamente' };
      } catch (error) {
          throw error;
      }
  },
  async editarSesionCita(idCita, citaData, userId, performedBy) {
    console.log("cita data: ", citaData);
    
    const t = await sequelize.transaction(); // Iniciar una transacción
    try {
        const cita = await SesionCita.findByPk(idCita, { transaction: t });
        if (!cita) {
            throw new Error('La cita no existe');
        }

        // Validar que la cita no está cancelada antes de editar
        if (!cita.esActivo) {
            throw new Error('No se puede editar una cita cancelada');
        }
    
        const modalidad = await TipoModalidad.findOne({
                where: { nombre: citaData.modalidad }
        }, { transaction: t });
        
        // Obtener los IDs de los alumnos asociados a la cita
        const alumnosCita = await AlumnoSesionCita.findAll({
            where: { fid_sesionCita: idCita },
            transaction: t
        });
        const idAlumnos = alumnosCita.map(alumno => alumno.fid_alumno);
        
        // Actualizar los campos de la cita
        await cita.update({
            fechaHoraInicio: citaData.fechaHoraInicio,
            fechaHoraFin: citaData.fechaHoraFin,
            fid_tipoModalidad: modalidad.id_tipoModalidad,
            lugar_link: citaData.lugar_link
        }, { transaction: t , performedBy, individualHooks: true});

        /* // Registrar el estado nuevo de la cita después de aplicar los cambios
        await HistorialCitas.create({
            citaId: cita.id_cita,
            fechaHoraInicio: cita.fechaHoraInicio,
            fechaHoraFin: cita.fechaHoraFin,
            tipoModalidad: modalidad.id_tipoModalidad,
            lugar: citaData.lugar_link,
            estado: cita.fid_estado_cita,
            usuarioModifico: userId,
            fechaModificacion: new Date()
        }, { transaction: t }); */

        // Crear notificaciones de cambio para todos los alumnos asociados
        for (let idAlumno of idAlumnos) {
            await crearNotificacion(
                idAlumno,
                idCita,
                "cambio",
                {
                    fechaHoraInicio: citaData.fechaHoraInicio,
                    fechaHoraFin: citaData.fechaHoraFin,
                    modalidad: modalidad.nombre,
                    lugar: citaData.lugar_link
                },
                t,
                performedBy
            );
        }

        await t.commit(); // Comprometer la transacción
        return { message: 'Cita actualizada correctamente' };
    } catch (error) {
        await t.rollback(); // Revertir la transacción en caso de error
        throw error;
    }
},
async  listarCitasXTutor(idTutor) {
  try {
      // Función para obtener citas por estado
      async function obtenerCitasPorEstado(estadoCita) {
          return await SesionCita.findAll({
              where: {
                  fid_tutor: idTutor,
                  fid_estado_cita: estadoCita, // Usamos el parámetro para filtrar por estado
                  esActivo: true
              },
              include: [
                  { model: Usuario, as: 'Tutor', attributes: ['nombres', 'primerApellido', 'segundoApellido'] },
                  { 
                      model: Usuario, 
                      as: 'Alumnos', 
                      through: { attributes: [] },
                      attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen']
                  },
                  { model: TipoTutoria, as: 'TipoTutoria', attributes: ['nombre'] },
                  { model: TipoModalidad, as: 'TipoModalidad', attributes: ['nombre'] }
              ]
          });
      }

      // Función para convertir datos de cita
      const convertCitas = (citas) => citas.map(cita => ({
          idCita: cita.id_cita,
          fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
          fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
          lugarLink: cita.lugar_link,
          estadoCita: cita.estadoCita,
          Tutor: cita.Tutor ? `${cita.Tutor.nombres} ${cita.Tutor.primerApellido} ${cita.Tutor.segundoApellido}` : null,
          Alumnos: cita.Alumnos ? cita.Alumnos.map(alumno => ({
              nombres: alumno.nombres,
              primerApellido: alumno.primerApellido,
              segundoApellido: alumno.segundoApellido,
              email: alumno.email,
              avatar: alumno.imagen
          })) : [],
          TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
          TipoModalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null
      }));

      // Obtener citas por cada estado
      const citasProgramadas = await obtenerCitasPorEstado(1);
      const citasCanceladas = await obtenerCitasPorEstado(3);
      const citasCompletadas = await obtenerCitasPorEstado(2);

      return {
          programadas: convertCitas(citasProgramadas),
          canceladas: convertCitas(citasCanceladas),
          completadas: convertCitas(citasCompletadas)
      };
  } catch (error) {
      console.error("Error listing appointments by tutor", error);
      throw error;
  }
},

async  listarCitasXAlumno(idAlumno) {
  try {
      const citas = await SesionCita.findAll({
          include: [
              {
                  model: Usuario,
                  as: 'Alumnos',
                  where: { id_usuario: idAlumno },
                  attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email'],
                  through: {
                      model: AlumnoSesionCita,
                      attributes: []
                  },
                  required: true
              },
              {
                  model: Usuario,
                  as: 'Tutor',
                  attributes: ['nombres', 'primerApellido', 'segundoApellido','email','codigo','imagen']    
              },
              {
                  model: EstadoCita,
                  as: 'EstadoCita',
                  attributes: ['nombre']
              },
              { model: TipoTutoria, as: 'TipoTutoria', attributes: ['nombre'] },
              { model: TipoModalidad, as: 'TipoModalidad', attributes: ['nombre'] }
          ],
          where: {
              esActivo: true
          },
          raw: true,
          nest: true
      });

      const programadas = [];
      const canceladas = [];
      const completadas = [];

      citas.forEach(cita => {
          // Formatear la cita de acuerdo a los atributos requeridos
          const formattedCita = {
              idCita: cita['id_cita'],
              Tutor: cita.Tutor,
              estadoCita: cita['EstadoCita.nombre'],
              fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
              fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
              lugarLink: cita['lugar_link'],
              TipoTutoria : cita.TipoTutoria.nombre,
              TipoModalidad: cita.TipoModalidad.nombre
          };

          switch (cita.fid_estado_cita) {
              case 1:
                  programadas.push(formattedCita);
                  break;
              case 2:
                  completadas.push(formattedCita);
                  break;
              case 3:
                  canceladas.push(formattedCita);
                  break;
              default:
                  break;
          }
      });

      return {
          'Citas programadas': programadas,
          'Citas completadas': completadas,
          'Citas canceladas': canceladas
      };
  } catch (error) {
      throw error;
  }
},




async registrarCitaGrupal(citaData, performedBy) {
    const { idTutor, idTipoDeTutoria, Alumnos, fechaHoraInicio, fechaHoraFin, modalidad, link } = citaData;
    //obtengo todas las disponibilidades actuales del tutor
    const disponibilidadActual = await Disponibilidad.findAll({
        where: {
            fid_tutor: idTutor,
            esActivo: true
        }
    });

    //console.log(disponibilidadActual);
    //asumiendo que las horas de inicio y fin estan dentro de las horas del tutor
    //busco dentro de todas las disponibilidades del tutor cual es la que se busca
    //esto lo hago porque en bd yo no se cual es la disponibilidad seleccionada para poder editarla
    const posicionDisponibilidad = buscarRangoFechas(disponibilidadActual, fechaHoraInicio, fechaHoraFin);
    if(!posicionDisponibilidad.length){
        return "ERROR NO HAY DISPONIBILIDAD";
    }
    const disponibilidadCorrespondiente = disponibilidadActual[posicionDisponibilidad];
    const nuevaDisponibilidad = dividirRangoFecha(disponibilidadCorrespondiente.fechaHoraInicio,
        disponibilidadCorrespondiente.fechaHoraFin, parseISO(fechaHoraInicio), parseISO(fechaHoraFin));
    
    const arregloDisponibilidades = []
    for(let i = 0; i < nuevaDisponibilidad.length; i++){
        arregloDisponibilidades.push({
            fid_tutor: idTutor,
            fechaHoraInicio: nuevaDisponibilidad[i].inicio,
            fechaHoraFin: nuevaDisponibilidad[i].fin,
            esActivo: true
        })
    }
    console.log(arregloDisponibilidades)
    //elimino la disponibilidad anterior
    await Disponibilidad.update({
        esActivo: false
    },
    {
        where: {
            id_disponibilidad: disponibilidadCorrespondiente.id_disponibilidad
        },
        performedBy,
        individualHooks: true
    });

    return await Disponibilidad.bulkCreate(arregloDisponibilidades, { performedBy, individualHooks: true });
},
async obtenerDetalleCita(idCita) {
    try {
        const cita = await SesionCita.findByPk(idCita, {
            include: [
                { model: db.TipoTutoria, as: 'TipoTutoria', attributes: ['nombre', 'id_tipoTutoria'] },
                { model: db.TipoModalidad, as: 'TipoModalidad', attributes: ['nombre'] },
                {
                    model: db.Usuario,
                    as: 'Alumnos',
                    attributes: ['id_usuario', 'email', 'codigo', 'nombres', 'primerApellido', 'segundoApellido', 'imagen'],
                    through: { attributes: [] },
                    include: [
                        { model: db.Programa, as: 'Programa', attributes: ['nombre'] },
                        { model: db.Facultad, as: 'Facultad', attributes: ['nombre'] }
                    ],
                    order: [['nombres', 'ASC']]
                },
                { model: db.Usuario, as: 'Tutor', attributes: ['id_usuario', 'email', 'codigo', 'nombres', 'primerApellido', 'segundoApellido', 'imagen'] },
                { model: db.ResultadoCita, as: 'Resultado' },
                {
                    model: db.CompromisoCita,
                    as: 'CompromisosCita',
                    attributes: ['nombre', 'fid_estado_compromiso'],
                    where: { fid_sesionCita: idCita },
                    required: false
                },
                {
                    model: db.AsistenciaCita,
                    as: 'Asistencias',
                    attributes: ['fid_alumno', 'asistio'],
                    where: { fid_sesionCita: idCita },
                    required: false
                }
            ]
        });

        if (!cita) {
            throw new Error('La cita no existe');
        }

        // Ordenar los alumnos por nombres
        const alumnosOrdenados = cita.Alumnos.sort((a, b) => {
            if (a.nombres < b.nombres) {
                return -1;
            }
            if (a.nombres > b.nombres) {
                return 1;
            }
            return 0;
        });

        console.log('alumnosOrdenados', alumnosOrdenados.map(alumno => alumno.nombres));
        
        const detalleCita = {
            nombreTipoDeTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
            idTipoDeTutoria: cita.TipoTutoria ? cita.TipoTutoria.id_tipoTutoria : null,
            idCita: idCita,
            start: cita.fechaHoraInicio,
            end: cita.fechaHoraFin,
            motivoRechazo: cita.motivoRechazo,
            modalidad: {
                tipo: cita.TipoModalidad ? cita.TipoModalidad.nombre : null,
                valor: cita.lugar_link
            },
            alumnos: alumnosOrdenados.map(alumno => ({
                idAlumno: alumno.id_usuario,
                email: alumno.email,
                codigo: alumno.codigo,
                nombres: alumno.nombres,
                primerApellido: alumno.primerApellido,
                segundoApellido: alumno.segundoApellido,
                imagen: alumno.imagen,
                programaOFacultad: alumno.Programa ? alumno.Programa.nombre : (alumno.Facultad ? alumno.Facultad.nombre : 'No asignado')
            })),
            tutor: cita.Tutor ? {
                idTutor: cita.Tutor.id_usuario,
                email: cita.Tutor.email,
                codigo: cita.Tutor.codigo,
                nombres: cita.Tutor.nombres,
                primerApellido: cita.Tutor.primerApellido,
                segundoApellido: cita.Tutor.segundoApellido,
                imagen: cita.Tutor.imagen
            } : null,
            resultado: cita.Resultado ? {
                es_derivado: cita.Resultado.es_derivado,
                detalleResultado: cita.Resultado.detalleResultado,
            } : null,
            compromisos: cita.CompromisosCita ? cita.CompromisosCita.map(comp => ({
                compromiso: comp.nombre,
                estado: comp.fid_estado_compromiso
            })) : [],
            asistencias: cita.Asistencias ? cita.Asistencias.map(asistencia => ({
                idAlumno: asistencia.fid_alumno,
                asistio: asistencia.asistio
            })) : []
        };

        console.log('detalleCita', detalleCita);

        return detalleCita;
    } catch (error) {
        throw error;
    }
},


async listarCitas(idTutor, idAlumno, fechaDesde, fechaHasta, idTipoTutoria, page, pageSize, orderBy, sortOrder) {
    idTutor = parseInt(idTutor);
    idAlumno = parseInt(idAlumno);
    page = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (page - 1) * limit;

    // Manejo de un solo idTipoTutoria o un arreglo de ids
    const idsTipoTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [parseInt(idTipoTutoria)];

    // Parse and format dates to ISO format
    let formattedFechaDesde = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').toISOString() : null;
    let formattedFechaHasta = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').toISOString() : null;

    // Calculate the difference in days
    let differenceInDays = 0;
    if (formattedFechaDesde && formattedFechaHasta) {
        differenceInDays = moment(formattedFechaHasta).diff(moment(formattedFechaDesde), 'days');
    }
    console.log(`Difference in days: ${differenceInDays}`);

    // Construir condiciones de búsqueda
    let whereConditions = {
        fid_tutor: idTutor,
        fid_tipoTutoria: {
            [Op.in]: idsTipoTutoria
        },
        esActivo: true,
        fid_estado_cita: {
            [Op.ne]: 3 // Asumiendo que 3 es el estado cancelado
        }
    };

    // Añadir condiciones de fecha si están definidas
    if (formattedFechaDesde && formattedFechaHasta) {
        whereConditions.fechaHoraInicio = {
            // Hacer un rango de fechas entre fechaDesde y fechaHasta pero que incluya la fechaHasta
            [Op.between]: [formattedFechaDesde, moment(formattedFechaHasta).add(1, 'days').toISOString()]
        };
    } else if (formattedFechaDesde) {
        whereConditions.fechaHoraInicio = {
            [Op.gte]: formattedFechaDesde
        };
    } else if (formattedFechaHasta) {
        whereConditions.fechaHoraInicio = {
            [Op.lte]: moment(formattedFechaHasta).add(1, 'days').toISOString()
        };
    }

    const citas = await SesionCita.findAndCountAll({
        where: whereConditions,
        include: [
            {
                model: TipoTutoria,
                as: 'TipoTutoria',
                attributes: ['id_tipoTutoria', 'nombre']
            },
            {
                model: AlumnoSesionCita,
                as: 'AlumnoSesionCitas',
                where: {
                    fid_alumno: idAlumno
                },
                required: true
            }
        ],
        limit: limit,
        offset: offset,
        order: [[orderBy, sortOrder]]
    });

    const formattedCitas = citas.rows.map(cita => ({
        idCita: cita.id_cita,
        idTipoTutoria: cita.TipoTutoria.id_tipoTutoria,
        nombreTipoTutoria: cita.TipoTutoria.nombre,
        fechaCita: moment(cita.fechaHoraInicio).format('YYYY-MM-DD'),
        horaInicio: moment(cita.fechaHoraInicio).format('HH:mm'),
        horaFin: moment(cita.fechaHoraFin).format('HH:mm'),
        ubicacion: cita.lugar_link
    }));

    return {
        totalPages: Math.ceil(citas.count / limit),
        currentPage: parseInt(page),
        totalCitas: citas.count,
        citas: formattedCitas
    };
},




  async crearCitaAlumno(citaData, idTutor, performedBy) {
    console.log("data de la cita: ", citaData);
        try {
            const modalidad = await TipoModalidad.findOne({
                where: {
                    nombre: citaData.modalidad.tipo
                }
            });
            console.log(modalidad)
            

            // Convertir las fechas a UTC
            const fechaHoraInicioUTC = moment.tz(citaData.fechaHoraInicio, 'America/Lima').utc().format();
            const fechaHoraFinUTC = moment.tz(citaData.fechaHoraFin, 'America/Lima').utc().format();
    
            // Validar si ya existe una cita con el mismo tutor, tipo de tutoría y en el mismo horario
            const existingCita = await SesionCita.findOne({
                where: {
                    fid_tutor: idTutor,
                    fid_tipoTutoria: citaData.idTipoTutoria,
                    fid_alumno: citaData.idAlumno,
                    fechaHoraInicio: citaData.fechaHoraInicio,
                    fechaHoraFin: citaData.fechaHoraFin,
                }
            });
    
            if (existingCita) {
                throw new Error('Ya existe una cita con estos mismos detalles');
            }
            
            // Registar cita por el alumno
            const sesionCita = await SesionCita.create({
                fid_tutor: idTutor,
                fid_tipoTutoria: citaData.idTipoTutoria,
                fechaHoraInicio: fechaHoraInicioUTC,
                fechaHoraFin: fechaHoraFinUTC,
                fid_alumno: null,
                fid_tipoModalidad: modalidad.id_tipoModalidad,
                fid_estado_cita: 1, //ESTADO PROGRAMADO
                lugar_link: '-',
                esActivo: true,
            }, { performedBy, individualHooks: true });

            const alumnoSesionCita = await AlumnoSesionCita.create({
                fid_alumno: citaData.idAlumno,
                fid_sesionCita: sesionCita.id_cita
            }, { performedBy, individualHooks: true });

            return sesionCita;
        } catch (error) {
            throw error;
        }
  },

  async listarCitasProgramadas({ idTutor, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        const today = moment().toDate();  // Obtiene la fecha y hora actual
        console.log("today is: ", today);

        // Primero, obtener los IDs de los estados que quieres excluir
        const excludedStatuses = ['Cancelado', 'Completado'];
        const excludedIds = await EstadoCita.findAll({
            where: { nombre: { [Op.in]: excludedStatuses } },
            attributes: ['id_estado_cita'],
            raw: true
        }).then(statuses => statuses.map(status => status.id_estado_cita));

        // Filtrar citas que están programadas y cuya fecha de inicio es futura o actual
        const whereConditions = {
            fid_tutor: idTutor,
            //fechaHoraFin: { [Op.gte]: today }, // Mayor o igual a la fecha actual ( Se validara en front)
            fid_estado_cita: { [Op.notIn]: excludedIds }, // Excluir estados Cancelado y Completado
            esActivo: true
        };

        const totalCitas = await SesionCita.count({
            where: whereConditions
        });

        const citas = await SesionCita.findAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                { model: Usuario, as: 'Alumnos', attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen'] },
                { model: Usuario, as: 'Tutor', attributes: ['nombres','primerApellido','segundoApellido'] },
                {
                    model: sequelize.models.TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre']
                }, 
                {
                    model: sequelize.models.TipoModalidad,
                    as: 'TipoModalidad',
                    attributes: ['nombre']
                },
                {
                    model: sequelize.models.EstadoCita,
                    as: 'EstadoCita',
                    attributes: ['nombre']
                }
            ]
        });

        const convertCitas = (citas) => {
            const transformedCitas = citas.map(cita => ({
                idCita: cita.id_cita,
                fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
                fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
                ubicacion: cita.lugar_link,
                estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : 'Desconocido',
                Tutor: cita.Tutor ? `${cita.Tutor.nombres} ${cita.Tutor.primerApellido} ${cita.Tutor.segundoApellido}` : null,
                Alumnos: cita.Alumnos ? cita.Alumnos.map(alumno => ({
                    nombres: alumno.nombres,
                    primerApellido: alumno.primerApellido,
                    segundoApellido: alumno.segundoApellido,
                    email: alumno.email,
                    avatar: alumno.imagen
                })) : [],
                TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
                modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null
            }));

            /* // Ordenar las citas transformadas en orden descendente por fechaHoraInicio
            transformedCitas.sort((a, b) => {
                const dateA = new Date(a.fechaHoraInicio);
                const dateB = new Date(b.fechaHoraInicio);
                return dateB - dateA; // Orden descendente
            }); */

            return transformedCitas;
        };

        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },

    async listarCitasFinalizadas({ idTutor, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        const today = moment().startOf('day').toDate(); // Tomando el inicio del día actual
    
        // Filtrar citas que están finalizadas o canceladas y cuya fecha de inicio es pasada
        const whereConditions = {
            fid_tutor: idTutor,
            fechaHoraInicio: {
                [Op.lt]: today // Menor que la fecha actual
            },
            esActivo: true, 
            fid_estado_cita: {
                [Op.or]: [2] // Estados finalizados y cancelado de las citas
            }
        };
    
        const totalCitas = await SesionCita.count({
            where: whereConditions
        });
    
        const citas = await SesionCita.findAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                { model: Usuario, as: 'Alumnos', attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen'] },
                { model: Usuario, as: 'Tutor', attributes: ['nombres','primerApellido','segundoApellido'] },
                {
                    model: sequelize.models.TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre']
                }, 
                {
                    model: sequelize.models.TipoModalidad,
                    as: 'TipoModalidad',
                    attributes: ['nombre']
                },
                {
                    model: sequelize.models.EstadoCita,
                    as: 'EstadoCita',
                    attributes: ['nombre']
                }
                
            ]
        });
    
        const convertCitas = (citas) => citas.map(cita => ({
            idCita: cita.id_cita,
            fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
            fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
            ubicacion: cita.lugar_link,
            estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : "Estado no definido",
            Tutor: cita.Tutor ? `${cita.Tutor.nombres} ${cita.Tutor.primerApellido} ${cita.Tutor.segundoApellido}` : null,
            Alumnos: cita.Alumnos ? cita.Alumnos.map(alumno => ({
                nombres: alumno.nombres,
                primerApellido: alumno.primerApellido,
                segundoApellido: alumno.segundoApellido,
                email: alumno.email,
                avatar: alumno.imagen
            })) : [],
            TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
            modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null
        }));
    
        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },
    async listarCitasCanceladas({ idTutor, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        const today = moment().startOf('day').toDate(); // Tomando el inicio del día actual
    
        // Filtrar citas que están canceladas y cuya fecha de inicio es pasada
        const whereConditions = {
            fid_tutor: idTutor,
            
            esActivo: true,
            fid_estado_cita: 3 // Estado cancelado de las citas
        };
    
        const totalCitas = await SesionCita.count({
            where: whereConditions
        });
    
        const citas = await SesionCita.findAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                { model: Usuario, as: 'Alumnos', attributes: ['id_usuario', 'nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen'] },
                { model: Usuario, as: 'Tutor', attributes: ['nombres', 'primerApellido', 'segundoApellido'] },
                {
                    model: sequelize.models.TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre']
                }, 
                {
                    model: sequelize.models.TipoModalidad,
                    as: 'TipoModalidad',
                    attributes: ['nombre']
                },
                {
                    model: sequelize.models.EstadoCita,
                    as: 'EstadoCita',
                    attributes: ['nombre']
                }
            ]
        });
    
        const convertCitas = (citas) => citas.map(cita => ({
            idCita: cita.id_cita,
            fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
            fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
            ubicacion: cita.lugar_link,
            estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : "Estado no definido",
            Tutor: cita.Tutor ? `${cita.Tutor.nombres} ${cita.Tutor.primerApellido} ${cita.Tutor.segundoApellido}` : null,
            Alumnos: cita.Alumnos ? cita.Alumnos.map(alumno => ({
                nombres: alumno.nombres,
                primerApellido: alumno.primerApellido,
                segundoApellido: alumno.segundoApellido,
                email: alumno.email,
                avatar: alumno.imagen
            })) : [],
            TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
            modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null,
            motivoRechazo: cita.motivoRechazo
        }));
    
        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },
    
    async obtenerEstadisticasCitas(idFacultad, searchCriteria) {
        const { fechaDesde, fechaHasta, idPrograma, idTipoTutoria } = searchCriteria;
        const fechaInicio = fechaDesde ? new Date(fechaDesde) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last month by default
        const fechaFin = fechaHasta ? new Date(fechaHasta) : new Date();
        
        const idsPrograma = Array.isArray(idPrograma) ? idPrograma : [idPrograma];
        const idsTipoTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [idTipoTutoria];
    
        const whereConditions = {
            fid_facultad: idFacultad,
            fid_programa: {
                [Op.in]: idsPrograma
            },
            fid_tipoTutoria: {
                [Op.in]: idsTipoTutoria
            },
            fechaHoraInicio: {
                [Op.between]: [fechaInicio, fechaFin]
            },
            esActivo: true
        };
    
        // Fetching data for citas
        const citas = await SesionCita.findAll({
            where: whereConditions,
            include: [
                {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['id_tipoTutoria', 'nombre']
                },
                {
                    model: Usuario,
                    as: 'Tutor',
                    attributes: ['id_usuario', 'nombres', 'primerApellido']
                },
                {
                    model: Usuario,
                    as: 'Alumno',
                    attributes: ['id_usuario', 'nombres', 'primerApellido']
                }
            ],
            order: [['fechaHoraInicio', 'ASC']]
        });
    
        const registroCitas = citas.map(cita => ({
            fechaCita: cita.fechaHoraInicio.toISOString().split('T')[0],
            cantidadCitasRegistradas: cita.length,
            cantidadCitasRealizadas: cita.filter(c => c.fid_estado_cita !== 3).length, // Assuming 3 is the canceled state
            cantidadCitasCanceladas: cita.filter(c => c.fid_estado_cita === 3).length // Assuming 3 is the canceled state
        }));
    
        const registroAsistencias = await CompromisoCita.findAll({
            where: whereConditions,
            include: [
                {
                    model: ResultadoCita,
                    as: 'ResultadoCita',
                    attributes: ['id_resultado', 'asistencia']
                },
                {
                    model: SesionCita,
                    as: 'SesionCita',
                    attributes: ['id_cita', 'fid_tipoModalidad']
                }
            ]
        });
    
        const cantidadAlumnosAtendidos = registroAsistencias.reduce((sum, asistencia) => sum + asistencia.ResultadoCita.asistencia ? 1 : 0, 0);
        const cantidadAlumnosAtendidosPorDia = cantidadAlumnosAtendidos / ((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
        const cantidadAlumnosAtendidosPorSemana = cantidadAlumnosAtendidos / ((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24 * 7));
        const proporcionModalidadVirtualCitas = (registroAsistencias.filter(asistencia => asistencia.SesionCita.fid_tipoModalidad === 1).length / registroAsistencias.length) * 100; // Assuming 1 is the virtual modality
        const proporcionCompromisosCompletados = (registroAsistencias.filter(asistencia => asistencia.es_activo).length / registroAsistencias.length) * 100;
    
        return {
            registroCitas,
            registroAsistencias: [
                {
                    formatoCita: 'Individual',
                    cantidadAlumnos: cantidadAlumnosAtendidos
                }
            ],
            cantidadAlumnosAtendidos,
            cantidadAlumnosAtendidosPorDia,
            cantidadAlumnosAtendidosPorSemana,
            proporcionModalidadVirtualCitas,
            proporcionCompromisosCompletados
        };
    },
    async obtenerReporteTutor(idCoordinador, searchCriteria) {
        idCoordinador = parseInt(idCoordinador);
        const { fechaDesde, fechaHasta, idTipoTutoria } = searchCriteria;
    
        const idsTipoTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [idTipoTutoria];
    
        const fromDate = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').startOf('day').subtract(5, 'hours').toISOString() : moment().subtract(30, 'days').startOf('day').subtract(5, 'hours').toISOString();
        const toDate = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').endOf('day').subtract(5, 'hours').toISOString() : moment().endOf('day').subtract(5, 'hours').toISOString();

        console.log("fromDate (original UTC): ", fromDate);
        console.log("toDate (original UTC): ", toDate);
    
        const citasAtendidas = await SesionCita.findAll({
            where: {
                fid_tipoTutoria: { [Op.in]: idsTipoTutoria },
                fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                esActivo: true,
                fid_estado_cita: { [Op.ne]: 3 },
                fid_resultado: { [Op.ne]: null }
            },
            include: [{
                model: ResultadoCita,
                as: 'Resultado',
                where: { asistencia: 1, es_activo: 1 },
                attributes: []
            }],
            attributes: [
                [Sequelize.fn('DATE', Sequelize.fn('CONVERT_TZ', Sequelize.col('fechaHoraInicio'), '+00:00', '-05:00')), 'fecha'],
                [Sequelize.fn('COUNT', Sequelize.col('id_cita')), 'cantidadCitasAtendidas'],
            ],
            group: ['fecha'],
            order: [['fecha', 'ASC']],
        });
    
        const topTutores = await Usuario.findAll({
            include: [{
                model: SesionCita,
                as: 'SesionesCitaTutor',
                attributes: [],
                where: {
                    fid_tipoTutoria: { [Op.in]: idsTipoTutoria },
                    fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                    esActivo: true,
                    fid_estado_cita: { [Op.ne]: 3 },
                    fid_resultado: { [Op.ne]: null }
                },
                include: [{
                    model: ResultadoCita,
                    as: 'Resultado',
                    where: { asistencia: 1, es_activo: 1 },
                    attributes: []
                }],
            }],
            attributes: [
                'nombres',
                'primerApellido',
                [Sequelize.fn('COUNT', Sequelize.col('SesionesCitaTutor.id_cita')), 'citasAtendidas'],
            ],
            group: ['Usuario.id_usuario'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('SesionesCitaTutor.id_cita')), 'DESC']],
            limit: 5,
            subQuery: false,
        });
    
        const solicitudesAsignacion = await SolicitudTutorFijo.findAll({
            where: {
                fid_tipoTutoria: { [Op.in]: idsTipoTutoria },
                fechaRegistro: { [Op.between]: [fromDate, toDate] },
                esActivo: true
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.fn('CONVERT_TZ', Sequelize.col('fechaRegistro'), '+00:00', '-05:00')), 'fecha'],
                [Sequelize.fn('COUNT', Sequelize.col('id_solicitud')), 'cantidadSolicitudesAsignacion'],
            ],
            group: ['fecha'],
            order: [['fecha', 'ASC']],
        });
    
        const totalDias = moment(toDate).diff(moment(fromDate), 'days') + 1;
        const totalSemanas = moment(toDate).diff(moment(fromDate), 'weeks') + 1;
    
        const cantidadTotalCitasAtendidas = citasAtendidas.reduce((sum, cita) => sum + parseInt(cita.dataValues.cantidadCitasAtendidas), 0);
        const cantidadPromedioCitasAtendidasTutor = Array.isArray(idTipoTutoria) ? (cantidadTotalCitasAtendidas / idTipoTutoria.length).toFixed(2) : cantidadTotalCitasAtendidas;
        const cantidadPromedioCitasDiarioAtendidasTutor = totalDias? Array.isArray(idTipoTutoria) ? (cantidadTotalCitasAtendidas / idTipoTutoria.length).toFixed(2) / totalDias : cantidadTotalCitasAtendidas / totalDias : 0;
        
        const cantidadTotalSolicitudesRegistradas = solicitudesAsignacion.reduce((sum, solicitud) => sum + parseInt(solicitud.dataValues.cantidadSolicitudesAsignacion), 0);
        const cantidadPromedioSolicitudesDiariasRegistradas = totalDias? (cantidadTotalSolicitudesRegistradas / totalDias).toFixed(2) : 0;
        
        const citasVirtuales = await SesionCita.count({
            where: {
                fid_tipoTutoria: { [Op.in]: idsTipoTutoria },
                fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                esActivo: true,
                fid_resultado: { [Op.ne]: null }
            },
            include: [{
                model: TipoModalidad,
                as: 'TipoModalidad',
                where: { nombre: 'Virtual' },
            }, {
                model: ResultadoCita,
                as: 'Resultado',
                where: { asistencia: 1, es_activo: 1 },
            }],
        });
        
        const totalCitas = await SesionCita.count({
            where: {
                fid_tipoTutoria: { [Op.in]: idsTipoTutoria },
                fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                esActivo: true,
                fid_resultado: { [Op.ne]: null }
            },
            include: [{
                model: ResultadoCita,
                as: 'Resultado',
                where: { asistencia: 1, es_activo: 1 },
            }],
        });
        
        const proporcionModalidadVirtualCitas = totalCitas ? ((citasVirtuales / totalCitas) * 100).toFixed(2) : 0;
        
        
        return {
            citasAtendidas,
            topTutores,
            solicitudesAsignacion,
            cantidadTotalCitasAtendidas,
            cantidadPromedioCitasAtendidasTutor,
            cantidadPromedioCitasDiarioAtendidasTutor,
            cantidadTotalSolicitudesRegistradas,
            cantidadPromedioSolicitudesDiariasRegistradas,
            proporcionModalidadVirtualCitas,
        };
    },
    
 


    async obtenerReporteEncuestas(idCoordinador, searchCriteria) {
    idCoordinador = parseInt(idCoordinador);
    const { fechaDesde, fechaHasta, idTipoTutoria, cantidadElementos } = searchCriteria;

    const idsTipoTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [idTipoTutoria];

    const fromDate = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').startOf('day').subtract(5, 'hours').toISOString() : moment().subtract(30, 'days').startOf('day').subtract(5, 'hours').toISOString();
    const toDate = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').endOf('day').subtract(5, 'hours').toISOString() : moment().endOf('day').subtract(5, 'hours').toISOString();

    try {
        /*const coordinador = await Usuario.findOne({
            where: { id_usuario: idCoordinador },
            include: [
                {
                    model: Facultad,
                    as: 'Facultad',
                    attributes: ['id_facultad']
                }
            ]
        });*/

        const facultad = await Facultad.findOne({
            where: { fid_usuario: idCoordinador, esActivo: true },
            attributes: ['id_facultad', 'nombre']
        });

        if (!facultad ) {
            throw new Error('No se encontró la facultad para el coordinador dado.');
        }
        /*const facultad = await Facultad.findOne({
            where: { fid_usuario: idCoordinador, esActivo: true },
            attributes: ['id_facultad', 'nombre']
        });*/

        const fidFacultad = facultad.id_facultad
    
        // Fetch the most recent EncuestaMaestra
        const recentEncuestaMaestra = await EncuestaMaestra.findOne({
            where: { fid_facultad: fidFacultad },
            order: [['fechaCreacion', 'DESC']],
            attributes: ['id_encuesta_maestra', 'fechaCreacion']
        });

        console.log("recentEncuestaMaestra", recentEncuestaMaestra);

        if (!recentEncuestaMaestra) {
            throw new Error('No se encontró ninguna EncuestaMaestra para la facultad dada.');
        }

        const encuestaMaestraId = recentEncuestaMaestra.id_encuesta_maestra;

        const encuestas = await Encuesta.findAll({
            where: {
                fid_encuesta_maestra: encuestaMaestraId,
                
                esActivo: true,
                fid_estado_encuesta: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: Respuesta,
                    as: 'Respuestas',
                    include: [{
                        model: Opcion,
                        as: 'Opcion',
                        include: [{
                            model: Pregunta,
                            as: 'Pregunta'
                        }]
                    }]
                },
                {
                    model: EstadoEncuesta,
                    as: 'EstadoEncuesta'
                }
            ]
        });
    

        const utilidadCitas = [];
        const satisfaccionExpectativas = [];
        const interesTutores = [];
        const valoracionCitas = [];
        let cantidadEncuestasRespondidas = 0;
        // fechaCreacion de la última encuesta maestra
        let ultimaEncuestaFecha = recentEncuestaMaestra.fechaCreacion;

        const categoriasUtilidad = { 'Nada útil': 0, 'Poco útil': 0, 'Útil': 0, 'Muy útil': 0, 'Demasiado útil': 0 };
        const categoriasSatisfaccion = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        const categoriasInteres = { 'Sí': 0, 'Parcialmente': 0, 'No': 0 };
        const categoriasValoracion = { 'Sí': 0, 'Parcialmente': 0, 'No': 0 };

        encuestas.forEach(encuesta => {
            encuesta.Respuestas.forEach(respuesta => {
                const preguntaId = respuesta.Opcion.Pregunta.id_pregunta;
                const opcionEnunciado = respuesta.Opcion.enunciado;

                switch (preguntaId) {
                    case 1:
                        categoriasUtilidad[opcionEnunciado] += 1;
                        break;
                    case 2:
                        categoriasSatisfaccion[opcionEnunciado] += 1;
                        break;
                    case 3:
                        categoriasInteres[opcionEnunciado] += 1;
                        break;
                    case 4:
                        categoriasValoracion[opcionEnunciado] += 1;
                        break;
                }
            });

            // Si el respuesta.id_respuesta no es nulo, entonces contar encuesta como realizada
            if (encuesta.Respuestas.length > 0) {
                cantidadEncuestasRespondidas += 1;
            }
        });

        const formatearCategorias = (categorias) => {
            return Object.keys(categorias).map(categoria => ({
                categoria,
                cantidad: categorias[categoria]
            }));
        };

        const proporcionEncuestasRespondidas = encuestas.length ? ((cantidadEncuestasRespondidas / encuestas.length) * 100).toFixed(2) + '%' : '0%';

        return {
            utilidadCitas: formatearCategorias(categoriasUtilidad),
            satisfaccionExpectativas: formatearCategorias(categoriasSatisfaccion),
            interesTutores: formatearCategorias(categoriasInteres),
            valoracionCitas: formatearCategorias(categoriasValoracion),
            proporcionEncuestasRespondidas,
            cantidadEncuestasRealizadas: encuestas.length,
            fechaUltimaEncuesta: ultimaEncuestaFecha ? moment(ultimaEncuestaFecha).format('DD-MM-YYYY') : null,
        };
    } catch (error) {
        console.error("Error obteniendo reporte de encuestas:", error);
        throw new Error("Error al obtener el reporte de encuestas");
    }
},

    
      async obtenerReporteAlumno(idCoordinador, searchCriteria) {
        idCoordinador = parseInt(idCoordinador);
        const { fechaDesde, fechaHasta, idTipoTutoria } = searchCriteria;
        const tiposTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [idTipoTutoria];
    
        const fromDate = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').startOf('day').subtract(5, 'hours').toISOString() : moment().subtract(30, 'days').startOf('day').subtract(5, 'hours').toISOString();
        const toDate = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').endOf('day').subtract(5, 'hours').toISOString() : moment().endOf('day').subtract(5, 'hours').toISOString();
    
        const sesiones = await SesionCita.findAll({
            where: {
                fid_tipoTutoria: { [Op.in]: tiposTutoria },
                fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                esActivo: true
            },
            attributes: ['id_cita']
        });
        const sessionIds = sesiones.map(session => session.id_cita);

        console.log("sessionIds: ", sessionIds);
    
        const registroCitas = await SesionCita.findAll({
            where: {
                id_cita: { [Op.in]: sessionIds }
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio')), 'fechaCita'],
                [Sequelize.fn('COUNT', Sequelize.col('id_cita')), 'cantidadCitasRegistradas'],
                [Sequelize.literal('CAST(SUM(CASE WHEN fid_estado_cita = 2 THEN 1 ELSE 0 END) AS UNSIGNED)'), 'cantidadCitasRealizadas'],
                [Sequelize.literal('CAST(SUM(CASE WHEN fid_estado_cita = 3 THEN 1 ELSE 0 END) AS UNSIGNED)'), 'cantidadCitasCanceladas']
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio')), 'ASC']]
        });

        console.log("registroCitas: ");
        // imprimir detalle del los registros
        registroCitas.forEach(cita => {
            console.log("cita: ", cita.dataValues);
        });
    
        const registroAsistencias = await AsistenciaSesionCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds }
            },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('AsistenciaCita.fid_alumno')), 'cantidadAlumnos']
            ]
        });

        console.log("registroAsistencias: ");
        // imprimir detalle del los registros
        registroAsistencias.forEach(asistencia => {
            console.log("asistencia: ", asistencia.dataValues);
        });

        const cantidadAlumnosAtendidos = await AsistenciaSesionCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds },
                asistio: true
            }
        });
        
        console.log("cantidadAlumnosAtendidos: ", cantidadAlumnosAtendidos);
    
        const cantidadAlumnosAtendidosPorDia = await AsistenciaSesionCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds},
                asistio: true
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('SesionCita.fechaHoraInicio')), 'fecha'],
                [Sequelize.fn('COUNT', Sequelize.col('AsistenciaCita.fid_alumno')), 'cantidadAlumnos']
            ],
            include: [{
                model: SesionCita,
                as: 'SesionCita',
                attributes: []
            }],
            group: [Sequelize.fn('DATE', Sequelize.col('SesionCita.fechaHoraInicio'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('SesionCita.fechaHoraInicio')), 'ASC']]
        });
    
        const cantidadAlumnosAtendidosPorSemana = await AsistenciaSesionCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds },
                asistio: true
            },
            attributes: [
                [Sequelize.fn('WEEK', Sequelize.col('SesionCita.fechaHoraInicio')), 'semana'],
                [Sequelize.fn('COUNT', Sequelize.col('AsistenciaCita.fid_alumno')), 'cantidadAlumnos']
            ],
            include: [{
                model: SesionCita,
                as: 'SesionCita',
                attributes: []
            }],
            group: [Sequelize.fn('WEEK', Sequelize.col('SesionCita.fechaHoraInicio'))],
            order: [[Sequelize.fn('WEEK', Sequelize.col('SesionCita.fechaHoraInicio')), 'ASC']]
        });
    
        // cantidad de alumnos Agrupados por sesiones citas con group by
        

        const cantidadAlumnosAtendidosGrupal = await AsistenciaSesionCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds },
                asistio: true
            },
            include: [{
                model: SesionCita,
                as: 'SesionCita',
                attributes: []
            }],
            group: ['SesionCita.id_cita'] 
        });

        console.log("cantidadAlumnosAtendidosGrupal: ", cantidadAlumnosAtendidosGrupal);
        console.log("cantidadAlumnosAtendidosGrupal.lentgh: ", cantidadAlumnosAtendidosGrupal.length);
        

        const citasRealizadas = sessionIds.length;
        const proporcionAsistenciaCitas = (cantidadAlumnosAtendidosGrupal.length / citasRealizadas) * 100;
    
        const modalidadVirtualCitas = await SesionCita.findAll({
            where: {
                id_cita: { [Op.in]: sessionIds },
                fid_tipoModalidad: 2 // Assuming 2 is the virtual modality
            }
        });
    
        const citasModalidadVirtual = modalidadVirtualCitas.length;
        const proporcionModalidadVirtualCitas = (citasModalidadVirtual / citasRealizadas) * 100;
    
        const compromisosCompletados = await CompromisoCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds },
                fid_estado_compromiso: 3 // Assuming 3 is the completed state
            }
        });
    
        const totalCompromisos = await CompromisoCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds }
            }
        });
    
        const proporcionCompromisosCompletados = (compromisosCompletados / totalCompromisos) * 100;
        
        // Calculate averages using moment
        const totalDias = moment(toDate).diff(moment(fromDate), 'days') + 1;
        const totalSemanas = moment(toDate).diff(moment(fromDate), 'weeks') + 1;
    
        const sumaAlumnosPorDia = cantidadAlumnosAtendidosPorDia.reduce((sum, item) => sum + item.dataValues.cantidadAlumnos, 0);
        const promedioAlumnosPorDia = totalDias? sumaAlumnosPorDia / totalDias : 0;
    
        const sumaAlumnosPorSemana = cantidadAlumnosAtendidosPorSemana.reduce((sum, item) => sum + item.dataValues.cantidadAlumnos, 0);
        const promedioAlumnosPorSemana = totalSemanas? sumaAlumnosPorSemana / totalSemanas : 0;
    
        return {
            registroCitas,
            registroAsistencias,
            cantidadAlumnosAtendidos,
            promedioAlumnosPorDia,
            promedioAlumnosPorSemana,
            proporcionAsistenciaCitas,
            proporcionModalidadVirtualCitas,
            proporcionCompromisosCompletados
        };
    },
    
    async listarCitasXTutorTokenJson(idTutor) {
        try {
            const citas = await SesionCita.findAll({
                where: {
                    fid_tutor: idTutor,
                    esActivo: true
                },
                attributes: ['id_cita', 'fechaHoraInicio', 'fechaHoraFin', 'lugar_link', 'fid_estado_cita', 'fid_tipoTutoria', 'fid_tipoModalidad'],
                include: [
                    {
                        model: Usuario,  // Asegurarse que Usuario se refiere al alumno aquí
                        as: 'Alumnos',   // Cambiar a 'Alumnos' si es como se relaciona en el modelo
                        attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: TipoTutoria,
                        as: 'TipoTutoria',
                        attributes: ['nombre']
                    },
                    {
                        model: TipoModalidad,
                        as: 'TipoModalidad',
                        attributes: ['nombre']
                    },
                    {
                        model: EstadoCita,
                        as: 'EstadoCita',
                        attributes: ['nombre']
                    }
                ],
                nest: true
            });
    
            const programadas = [];
            const canceladas = [];
            const completadas = [];
    
            citas.forEach(cita => {
                const formattedCita = {
                    idCita: cita.id_cita,
                    fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
                    fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
                    lugarLink: cita.lugar_link,
                    estadoCita: cita.EstadoCita.nombre,
                    Alumnos: cita.Alumnos,
                    TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
                    TipoModalidad: cita.TipoModalidad.nombre
                };
    
                switch (cita.fid_estado_cita) {
                    case 1:
                        programadas.push(formattedCita);
                        break;
                    case 2:
                        completadas.push(formattedCita);
                        break;
                    case 3:
                        canceladas.push(formattedCita);
                        break;
                    default:
                        break;
                }
            });
    
            return {
                'Citas programadas': programadas,
                'Citas completadas': completadas,
                'Citas canceladas': canceladas
            };
        } catch (error) {
            console.error("Error listing appointments by tutor", error);
            throw error;
        }
    },
    async listarCitasProgramadasAlumno({ idAlumno, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        const today = moment().toDate();  // Obtiene la fecha y hora actual
        console.log("today is: ", today);
    
        // Primero, obtener los IDs de los estados que quieres excluir
        const excludedStatuses = ['Cancelado', 'Completado'];
        const excludedIds = await EstadoCita.findAll({
            where: { nombre: { [Op.in]: excludedStatuses } },
            attributes: ['id_estado_cita'],
            raw: true
        }).then(statuses => statuses.map(status => status.id_estado_cita));
    
        const totalCitas = await SesionCita.count({
            include: [{
                model: AlumnoSesionCita,
                as: 'AlumnoSesionCitas',
                where: { fid_alumno: idAlumno }, // Correct filtering within include
                attributes: []
            }],
            where: {
                //fechaHoraFin: { [Op.gte]: today }, Se valida en front
                fid_estado_cita: { [Op.notIn]: excludedIds },
                esActivo: true
            }
        });
    
        const citas = await SesionCita.findAll({
            where: {
                //fechaHoraFin: { [Op.gte]: today },
                fid_estado_cita: { [Op.notIn]: excludedIds },
                esActivo: true
            },
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                {
                    model: Usuario,
                    as: 'Tutor',
                    attributes: ['nombres', 'primerApellido', 'segundoApellido','email','imagen']
                },
                {
                    model: TipoTutoria,
                    as: 'TipoTutoria',
                    attributes: ['nombre']
                },
                {
                    model: TipoModalidad,
                    as: 'TipoModalidad',
                    attributes: ['nombre']
                },
                {
                    model: EstadoCita,
                    as: 'EstadoCita',
                    attributes: ['nombre']
                },
                {
                    model: AlumnoSesionCita,
                    as: 'AlumnoSesionCitas',
                    required: true,
                    where: { fid_alumno: idAlumno },
                    include: [{
                        model: Usuario,
                        as: 'Alumno',
                        attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen']
                    }]
                }
            ]
        });
    
        // Transformación de las citas aquí
        const convertCitas = (citas) => {
            const transformedCitas = citas.map(cita => ({
                idCita: cita.id_cita,
                fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
                fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
                ubicacion: cita.lugar_link,
                estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : 'Desconocido',
                Tutor: cita.Tutor,
                TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
                modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null
            }));
    
            return transformedCitas;
        };
    
        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },
    async listarCitasFinalizadasAlumno({ idAlumno, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        const today = moment().toDate();  // Obtiene la fecha y hora actual
        const statusCancelled = 'Completado';
        const cancelledStatusIds = await EstadoCita.findAll({
            where: { nombre: statusCancelled },
            attributes: ['id_estado_cita'],
            raw: true
        }).then(statuses => statuses.map(status => status.id_estado_cita));
    
        const totalCitas = await SesionCita.count({
            include: [{
                model: AlumnoSesionCita,
                as: 'AlumnoSesionCitas',
                where: { 
                    fid_alumno: idAlumno,
                    
                 },
                required: true,  // Esto asegura que el JOIN con AlumnoSesionCita sea INNER JOIN
                attributes: []
            }],
            where: {
                //fechaHoraFin: { [Op.lt]: today },  // Se considerara completada si se regitro resultados y compromisos
                fid_estado_cita: { [Op.in]: cancelledStatusIds },
                esActivo: true
            }
        });
    
        const citas = await SesionCita.findAll({
            where: {
                //fechaHoraFin: { [Op.lt]: today },
                fid_estado_cita: { [Op.in]: cancelledStatusIds },
                esActivo: true
            },
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                {
                    model: AlumnoSesionCita,
                    as: 'AlumnoSesionCitas',
                    required: true,  // Asegurar que sólo se incluyan citas con la relación especificada
                    where: { fid_alumno: idAlumno },
                    include: [{
                        model: Usuario,
                        as: 'Alumno',
                        attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen']
                    }]
                },
                { model: Usuario, as: 'Tutor', attributes: ['nombres', 'primerApellido', 'segundoApellido','email','imagen'] },
                { model: TipoTutoria, as: 'TipoTutoria', attributes: ['nombre'] },
                { model: TipoModalidad, as: 'TipoModalidad', attributes: ['nombre'] },
                { model: EstadoCita, as: 'EstadoCita', attributes: ['nombre'] }
            ]
        });
    
        // Transformación de las citas aquí
        const convertCitas = (citas) => citas.map(cita => ({
            idCita: cita.id_cita,
            fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
            fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
            ubicacion: cita.lugar_link,
            estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : 'Desconocido',
            Tutor: cita.Tutor,
            TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
            modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null,
            Alumno: cita.AlumnoSesionCitas.map(al => ({
                nombres: al.Alumno.nombres,
                primerApellido: al.Alumno.primerApellido,
                segundoApellido: al.Alumno.segundoApellido,
                email: al.Alumno.email,
                imagen: al.Alumno.imagen
            }))
        }));
    
        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },
    
    async listarCitasCanceladasAlumno({ idAlumno, page, pageSize, sortBy, sortOrder }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        const statusCancelled = 'Cancelado';  // Asumiendo que el estado 'Cancelado' está definido así en tu DB
    
        // Obtener IDs de estado 'Cancelado'
        const cancelledStatusIds = await EstadoCita.findAll({
            where: { nombre: statusCancelled },
            attributes: ['id_estado_cita'],
            raw: true
        }).then(statuses => statuses.map(status => status.id_estado_cita));
    
        const totalCitas = await SesionCita.count({
            include: [{
                model: AlumnoSesionCita,
                as: 'AlumnoSesionCitas',
                where: { fid_alumno: idAlumno },
                required: true,  // Esto asegura que el JOIN con AlumnoSesionCita sea INNER JOIN
                attributes: []
            }],
            where: {
                fid_estado_cita: { [Op.in]: cancelledStatusIds },
                esActivo: true
            }
        });
    
        const citas = await SesionCita.findAll({
            where: {
                fid_estado_cita: { [Op.in]: cancelledStatusIds },
                esActivo: true
            },
            limit: limit,
            offset: offset,
            order: [
                [sortBy || 'fechaHoraInicio', sortOrder || 'ASC']
            ],
            include: [
                {
                    model: AlumnoSesionCita,
                    as: 'AlumnoSesionCitas',
                    required: true,  // Asegurar que sólo se incluyan citas con la relación especificada
                    where: { fid_alumno: idAlumno },
                    include: [{
                        model: Usuario,
                        as: 'Alumno',
                        attributes: ['nombres', 'primerApellido', 'segundoApellido', 'email', 'imagen']
                    }]
                },
                { model: Usuario, as: 'Tutor', attributes: ['nombres', 'primerApellido', 'segundoApellido','email','imagen'] },
                { model: TipoTutoria, as: 'TipoTutoria', attributes: ['nombre'] },
                { model: TipoModalidad, as: 'TipoModalidad', attributes: ['nombre'] },
                { model: EstadoCita, as: 'EstadoCita', attributes: ['nombre'] }
            ]
        });
    
        // Transformación de las citas aquí
        const convertCitas = (citas) => citas.map(cita => ({
            idCita: cita.id_cita,
            fechaHoraInicio: moment(cita.fechaHoraInicio).tz('America/Lima').format(),
            fechaHoraFin: moment(cita.fechaHoraFin).tz('America/Lima').format(),
            ubicacion: cita.lugar_link,
            estadoCita: cita.EstadoCita ? cita.EstadoCita.nombre : 'Desconocido',
            Tutor: cita.Tutor,
            TipoTutoria: cita.TipoTutoria ? cita.TipoTutoria.nombre : null,
            modalidad: cita.TipoModalidad ? cita.TipoModalidad.nombre : null,
            motivoRechazo: cita.motivoRechazo,
            Alumno: cita.AlumnoSesionCitas.map(al => ({
                nombres: al.Alumno.nombres,
                primerApellido: al.Alumno.primerApellido,
                segundoApellido: al.Alumno.segundoApellido,
                email: al.Alumno.email,
                imagen: al.Alumno.imagen
            }))
        }));
    
        return {
            totalPages: Math.ceil(totalCitas / limit),
            currentPage: parseInt(page),
            totalCitas: totalCitas,
            citas: convertCitas(citas)
        };
    },
    async obtenerReporteAlumnosParaTutor(idAlumno, idTipoTutoria, fechaDesde, fechaHasta) {

        const tiposTutoria = Array.isArray(idTipoTutoria) ? idTipoTutoria : [idTipoTutoria];
        const fromDate = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').startOf('day').subtract(5, 'hours').toISOString() : moment().subtract(30, 'days').startOf('day').subtract(5, 'hours').toISOString();
        const toDate = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').endOf('day').subtract(5, 'hours').toISOString() : moment().endOf('day').subtract(5, 'hours').toISOString();
    
        const sesiones = await SesionCita.findAll({
            where: {
                fid_tipoTutoria: { [Op.in]: tiposTutoria },
                fechaHoraInicio: { [Op.between]: [fromDate, toDate] },
                esActivo: true,
            },
            attributes: ['id_cita']
        });

        // Filtrar alumnos de las sesiones de la tabla AlumnoSesionCita
        const alumnos = await AlumnoSesionCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sesiones.map(session => session.id_cita) },
                fid_alumno: idAlumno
            },
            attributes: ['fid_alumno', 'fid_sesionCita']
        });

        // filtra de sesiones solo las que tienen al alumno
        const sessionIds = alumnos.map(alumno => alumno.fid_sesionCita);
    
        const registroCitas = await SesionCita.findAll({
            where: {
                id_cita: { [Op.in]: sessionIds }
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio')), 'fechaCita'],
                [Sequelize.fn('COUNT', Sequelize.col('id_cita')), 'cantidadCitasRegistradas'],
                [Sequelize.literal('CAST(SUM(CASE WHEN fid_estado_cita = 2 THEN 1 ELSE 0 END) AS UNSIGNED)'), 'cantidadCitasRealizadas'],
                [Sequelize.literal('CAST(SUM(CASE WHEN fid_estado_cita = 3 THEN 1 ELSE 0 END) AS UNSIGNED)'), 'cantidadCitasCanceladas']
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('fechaHoraInicio')), 'ASC']]
        });
    
        const cantidadCitasAtendidas = await AsistenciaSesionCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds },
                asistio: true,
                fid_alumno: idAlumno
            }
        });
    
        const modalidadVirtualCitas = await SesionCita.count({
            where: {
                id_cita: { [Op.in]: sessionIds },
                fid_tipoModalidad: 2,// Assuming 2 is the virtual modality
            }
        });
    
        console.log('sessionIds: ', sessionIds);
        console.log('registroCitas: ', registroCitas);
        // Calcular citas realizadas de cantidad de registros de citas
        const citasRealizadas = registroCitas.reduce((sum, cita) => sum + cita.dataValues.cantidadCitasRealizadas, 0);
        

        const proporcionModalidadCitasVirtual = citasRealizadas ? (modalidadVirtualCitas / citasRealizadas) * 100: 0;
    
        const proporcionAsistenciaCitas = citasRealizadas ? (cantidadCitasAtendidas / citasRealizadas) * 100: 0;
        console.log("proporcionAsistenciaCitas: ", proporcionAsistenciaCitas);
        console.log("cantidadCitasAtendidas: ", cantidadCitasAtendidas);
        console.log("citasRealizadas: ", citasRealizadas);
    
        const derivaciones = await Derivacion.count({
            where: {
                fid_cita: { [Op.in]: sessionIds },
                fid_alumno: idAlumno,
                esActivo: true,
                fid_tipoTutoria: { [Op.in]: tiposTutoria }
            }
        });
    
        const compromisos = await CompromisoCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds},
                es_activo: true
            },
            attributes: [
                'fid_estado_compromiso',
                [Sequelize.fn('COUNT', Sequelize.col('fid_estado_compromiso')), 'cantidad']
            ],
            group: ['fid_estado_compromiso']
        });

        // imprimir con formato para ver categoria y nombre
        console.log("compromisos: ");
        compromisos.forEach(compromiso => {
            console.log("compromiso: ", compromiso.dataValues);
        });
    
        // Si es fid_estado_compromiso es 1, mostrar categoria 'Comprometido'
        // Si es fid_estado_compromiso es 2, mostrar categoria 'Ejecución'
        // Si es fid_estado_compromiso es 3, mostrar categoria 'Finalizado'
        /*const estadoCompromisos = compromisos.map(compromiso => ({
            categoria: compromiso.dataValues.fid_estado_compromiso === 1 ? 'Comprometido' : compromiso.dataValues.fid_estado_compromiso === 2 ? 'Ejecución' : 'Finalizado',
            cantidad: compromiso.dataValues.cantidad
        }));*/
        
        
        
        let estadoCompromisos = [
            { categoria: 'Comprometido', cantidad: compromisos.find(compromiso => compromiso.fid_estado_compromiso === 1)?.dataValues.cantidad || 0 },
            { categoria: 'Ejecución', cantidad: compromisos.find(compromiso => compromiso.fid_estado_compromiso === 2)?.dataValues.cantidad || 0},
            { categoria: 'Finalizado', cantidad: compromisos.find(compromiso => compromiso.fid_estado_compromiso === 3)?.dataValues.cantidad || 0}
        ];
        
        console.log("estadoCompromisos: ", estadoCompromisos);

        const objetivosFinalizados = await CompromisoCita.findAll({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds},
                fid_estado_compromiso: 3
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fechaActualizacion')), 'fecha'],
                [Sequelize.fn('COUNT', Sequelize.col('id_compromiso')), 'cantidadFinalizados']
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('fechaActualizacion'))]
        });
    
        const totalObjetivos = await CompromisoCita.count({
            where: {
                fid_sesionCita: { [Op.in]: sessionIds},
                es_activo: true
            }
        });

        const totalObjetivosFinalizados = objetivosFinalizados.reduce((sum, objetivo) => sum + objetivo.dataValues.cantidadFinalizados, 0); 
    
        const proporcionObjetivosFinalizados = totalObjetivos? (totalObjetivosFinalizados / totalObjetivos) * 100 : 0;
    
        return {
            registroCitas,
            proporcionModalidadCitasVirtual,
            proporcionAsistenciaCitas,
            cantidadCitasAtendidas,
            estadoCompromisos,
            cantidadDerivaciones: derivaciones,
            trazabilidadObjetivosFinalizados: objetivosFinalizados,
            proporcionObjetivosFinalizados
        };
    }    
}


module.exports = SesionCitaServices;
