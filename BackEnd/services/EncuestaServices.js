const jwt = require("jsonwebtoken");
const db = require("../models/");
const { Sequelize, Op, where } = require("sequelize");
const sequelize = db.sequelize;
const moment = require('moment-timezone');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { at } = require("lodash");
const { id } = require("date-fns/locale");
const { group } = require("console");
const { off } = require("process");
const Usuario = db.Usuario;
const Encuesta = db.Encuesta;
const EstadoEncuesta = db.EstadoEncuesta;
const Facultad = db.Facultad;
const Programa = db.Programa;
const Pregunta = db.Pregunta;
const Opcion = db.Opcion;
const Respuesta = db.Respuesta;
const EncuestaMaestra = db.EncuestaMaestra;
const SesionCita = db.SesionCita;
const Rol = db.Rol;


const EncuestaService = {
  async registrarEncuesta(idCoord, performedBy) {
    try {
      const coordinador = await Usuario.findByPk(idCoord, {
        include: [
          {
            model: Rol,
            as: "Roles",
            where: { es_activo: true },
            through: { attributes: [] },
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

      if(esCoordinadorFacultad){
        whereConditions.fid_facultad = coordinador.fid_facultad;
      }
      // ? Enviar encuestas a alumnos que han tenido al menos 1 cita con resultado
      // ? desde el envío de la anterior encuesta (Si no se ha enviado ninguna, 
      // ? enviar a todos que han tenido al menos 1 cita con resultado)
      // ? Si, se envía una encuesta cuando otra ya esta "vigente", esta otra se cambia a esto de
      // ! "Finalizada" (acabo el plazo o hay otra encuesta vigente)
      // ? Crear Tabla Maestra de Encuesta, que agruepe encuestas.
      // ? Esta Tabla tendra el estado de vigente y finalizado.
      // ? Las "subEncuestas" tendran estado de Pendiente y Respondido.
      // ? La tabla Encuesta sera la "subEncuesta". Agregar fid_Encuesta_Maestra para el manejo de grupos.
      const alumnos = await Usuario.findAll({
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
          {
            model: Encuesta,
            as: "EncuestasAlumno",
            where: {
              [Op.or]: [
                { fid_alumno: { [Op.ne]: idTipoTutoria } },
                { id_encuesta: idTipoTutoria, esActivo: false },
              ],
              [Op.or]: [{ es_activo: false }, { id_encuesta: null }],
            },
            attributes: [],
          },
          {
            model: Programa,
            as: "Programa",
            attributes: ["nombre"],
          },
        ],
        distinct: true,
      });

      const encuesta = await Encuesta.create({
        fid_alumno: fid_alumno,
        fid_coord: idCoord,
        fechaEnvio: new Date(),
        fid_estado_encuesta: 1,
      }, { performedBy, individualHooks: true });
      return encuesta;
    } catch (error) {
      return error;
    }
  },
  async listarEncuestas(
    inputSearch,
    estadoEncuesta,
    page,
    pageSize,
    sortBy,
    sortOrder
  ) {
    const limit = parseInt(pageSize) || 9;
    const offset = (page - 1) * limit;

    let whereConditions = {};
    let estadoConditions = {};

    if (inputSearch) {
      // Filtrar por búsqueda en nombre o apellido del alumno
      whereConditions = {
        [Op.or]: [
          { nombres: { [Op.like]: `%${inputSearch}%` } },
          { primerApellido: { [Op.like]: `%${inputSearch}%` } },
          { segundoApellido: { [Op.like]: `%${inputSearch}%` } },
          { email: { [Op.like]: `%${inputSearch}%` } },
          { codigo: { [Op.like]: `%${inputSearch}%` } },
        ],
      };
    }

    // Filtrar por estado de la encuesta
    if (estadoEncuesta !== "Todos") {
      estadoConditions = {
        "$EstadoEncuesta.nombre$": estadoEncuesta,
      };
    }
    try {
      const encuestas = await Encuesta.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: Usuario,
            as: "Alumno",
            attributes: [
              "id_usuario",
              "nombres",
              "primerApellido",
              "segundoApellido",
              "email",
              "codigo",
            ], // Añade los atributos que realmente necesitas
            where: whereConditions, // Aplica el filtro solo si hay inputSearch
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
          {
            model: EstadoEncuesta,
            as: "EstadoEncuesta",
            attributes: ["nombre"],
            where: estadoConditions,
          },
        ],
      });

      const formattedEncuestas = encuestas.rows.map((encuesta) => ({
        id: encuesta.id_encuesta,
        titulo: encuesta.titulo,
        fechaCreacion: encuesta.fechaCreacion,
        fechaActualizacion: encuesta.fechaActualizacion,
        fechaEnvio: encuesta.fecha_envio,
        esActivo: encuesta.es_activo,
        
        alumno: {
          id: encuesta.Alumno.id_usuario,
          nombres: encuesta.Alumno.nombres,
          primerApellido: encuesta.Alumno.primerApellido,
          segundoApellido: encuesta.Alumno.segundoApellido,
          email: encuesta.Alumno.email,
          codigo: encuesta.Alumno.codigo,
          facultad: encuesta.Alumno.Facultad ? encuesta.Alumno.Facultad.nombre : null,
          programa: encuesta.Alumno.Programa ? encuesta.Alumno.Programa.nombre : null,
        },
        EstadoEncuesta: encuesta.EstadoEncuesta
          ? encuesta.EstadoEncuesta.nombre
          : null,
      }));

      return {
        message: "Encuestas listadas con éxito",
        data: {
          totalPages: Math.ceil(encuestas.count / limit),
          currentPage: parseInt(page),
          totalEncuestas: encuestas.count,
          encuestas: formattedEncuestas,
        },
      };
    } catch (error) {
      console.error("Error al listar encuestas:", error);
      throw new Error("Error al listar encuestas");
    }
  },
  async listadoPreguntasOpciones(idEncuesta) {
    idEncuesta = parseInt(idEncuesta, 10);
  
    console.log('Fetching preguntas for idEncuesta:', idEncuesta);
  
    // Fetching preguntas with their opciones
    const preguntas = await Pregunta.findAll({
      include: [
        {
          model: Opcion,
          as: 'Opciones',
          attributes: ['id_opcion', 'enunciado'],
        }
      ]
    });
    console.log('Preguntas fetched:', preguntas);
  
    console.log('Fetching respuestas for idEncuesta:', idEncuesta);
    // Fetching respuestas related to the given idEncuesta
    const respuestas = await Respuesta.findAll({
      where: { fid_encuesta: idEncuesta },
      attributes: ['fid_opcion']
    });
    console.log('Respuestas fetched:', respuestas);
  
    // Mapping respuestas to a simpler structure for easier lookup
    const respuestaOpciones = respuestas.map(r => r.fid_opcion);
  
    // Creating the result array
    const result = preguntas.map(pregunta => {
      console.log('Processing pregunta:', pregunta);
      const opciones = pregunta.Opciones.map(opcion => {
        console.log('Processing opcion:', opcion);
        return {
          idOpcion: opcion.id_opcion,
          nombreOpcion: opcion.enunciado
        };
      });
  
      // Find the selected option for the current question
      const opcionSeleccionada = opciones.find(opcion => respuestaOpciones.includes(opcion.idOpcion));
  
      return {
        preguntaId: pregunta.id_pregunta,
        descripcionPregunta: pregunta.enunciado,
        opciones,
        opcionSeleccionada: opcionSeleccionada ? opcionSeleccionada.idOpcion : null
      };
    });
  
    console.log('Result:', result);
  
    return result;
  },
  
  async listarEncuestasAlumno(idAlumno, page = 1, pageSize = 9, searchCriteria) {
    let { fechaDesde, fechaHasta, estado } = searchCriteria;
    estado = parseInt(estado);
  
    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;
  
    const fromDate = fechaDesde ? moment(fechaDesde, 'DD-MM-YYYY').startOf('day').toDate() : null;
    const toDate = fechaHasta ? moment(fechaHasta, 'DD-MM-YYYY').endOf('day').toDate() : null;
    
    let whereConditions = {
      fid_alumno: idAlumno,
      esActivo: true,
      fid_estado_encuesta: estado
    };
  
    let otherWhereConditions = { esActivo: true };

    // si estado es 1, entonces solo mostrar encuestas vigentes
    if (estado === 1) {
      otherWhereConditions.fid_estado_encuesta_maestra = 1;
    }

    if (fromDate && toDate) {
      otherWhereConditions.fechaCreacion = {
        [Op.between]: [fromDate, toDate]
      };
    }

  
    try {
      const encuestas = await Encuesta.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Respuesta,
            as: 'Respuestas',
            required: false,
            attributes: ['id_respuesta', 'fechaCreacion', 'fechaActualizacion']
          },
          {
            model: EncuestaMaestra,
            as: 'EncuestaMaestra',
            where: otherWhereConditions,
            required: true
          }
        ],
        limit: limit,
        offset: offset,
        order: [['fechaActualizacion', 'DESC']],
        group: ['id_encuesta'],
        subQuery: false
      });
      

      const formattedEncuestas = encuestas.rows.map(encuesta => ({
        idEncuesta: encuesta.id_encuesta,
        fechaEncuesta: encuesta.fechaCreacion,
        fechaRespuesta: encuesta.Respuestas.length > 0 ? encuesta.Respuestas[0].fechaCreacion : null,
        
      }));

      const totalPages = Math.ceil(encuestas.count.length / limit);

      return {
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalEncuestas: formattedEncuestas.length,
        encuestas: formattedEncuestas
      };
    } catch (error) {
      console.error("Error al listar encuestas:", error);
      throw new Error("Error al listar encuestas");
    }
},

  async registroRespuestas(idEncuesta, respuestas, performedBy) {
    idEncuesta = parseInt(idEncuesta, 10);
    // Validar que la encuesta existe
    const encuesta = await Encuesta.findByPk(idEncuesta);
    if (!encuesta) {
      throw new Error('Encuesta no encontrada');
    }

    console.log(respuestas);
 
    const preguntas = await Pregunta.findAll();


    if (preguntas.length !== respuestas.length) {
      throw new Error('El numero de respuestas no coincide con el numero de preguntas');
    }

    // Crear las respuestas
    const respuestasCreadas = [];
    for (const idOpcion of respuestas) {
      const respuesta = await Respuesta.create({
        fid_encuesta: idEncuesta,
        fid_opcion: idOpcion,
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }, { performedBy, individualHooks: true });
      respuestasCreadas.push(respuesta);
    }

    // Actualizar el estado de la encuesta
    await encuesta.update({
      fid_estado_encuesta: 2
    }, { performedBy, individualHooks: true });
    
    return respuestasCreadas;
  }

};

module.exports = EncuestaService;
