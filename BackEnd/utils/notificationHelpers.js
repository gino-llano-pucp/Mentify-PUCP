const db = require('../models');
const Notificacion = db.Notificacion;
const moment = require('moment');

async function crearNotificacion(fid_usuario, fid_sesionCita, tipo, detallesCita, transaction = null, performedBy = null) {
  return await Notificacion.create({
      fid_usuario,
      fid_sesionCita,
      tipo,
      fechaHoraInicio: detallesCita.fechaHoraInicio,
      fechaHoraFin: detallesCita.fechaHoraFin,
      modalidad: detallesCita.modalidad,
      lugar: detallesCita.lugar,
      fechaHora: new Date(), // Momento en que se crea la notificación
      leido: false
  }, { transaction , performedBy, individualHooks: true});
}

const formatNotification = (notification) => {
  const { SesionCita, tipo, fechaHoraInicio, fechaHoraFin, modalidad, lugar, fechaCreacion, leido, id_notificacion } = notification;
  const { Tutor, TipoTutoria } = SesionCita;

  // Establece español como el locale predeterminado
  moment.locale('es');
  const timeAgo = moment(fechaCreacion).fromNow();

  // Estructura básica de la notificación
  let formattedNotification = {
    id: id_notificacion,
    leido: leido,
    tipoTutoria: TipoTutoria.nombre,
    tipo: tipo,
    avatar: Tutor.imagen,
    time: `${moment(fechaHoraInicio).format('MMMM D, YYYY')} - ${moment(fechaHoraInicio).format('h:mm A')} a ${moment(fechaHoraFin).format('h:mm A')}`,
    tutor: `${Tutor.nombres} ${Tutor.primerApellido}`,
    details: `${modalidad} - Lugar: ${lugar}`,
    ago: timeAgo
  };
  
  // Formatos específicos según el tipo de notificación
  switch (tipo) {
    case 'confirmación':
      formattedNotification.title = `ha programado una sesión de tutoría.`;
      break;
    case 'cambio':
      formattedNotification.title = `ha modificado los detalles de una sesión.`;
      break;
    case 'cancelación':
      formattedNotification.title = `ha cancelado una sesión de tutoría.`;
      break;
  }

  return formattedNotification;
};

module.exports = {
    crearNotificacion,
    formatNotification
};
