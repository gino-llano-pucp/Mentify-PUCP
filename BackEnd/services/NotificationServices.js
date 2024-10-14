const { formatNotification } = require('../utils/notificationHelpers');
const db = require('../models/')
const SesionCita = db.SesionCita;
const Usuario = db.Usuario;
const Notificacion = db.Notificacion;
const TipoModalidad = db.TipoModalidad;
const TipoTutoria = db.TipoTutoria;

exports.fetchNotificationsForUser = async (userId) => {
    // Recuperar notificaciones específicas para el usuario
    const notifications = await Notificacion.findAll({
        where: { fid_usuario: userId },
        include: [{
            model: SesionCita,
            as: 'SesionCita',
            include: [{
                model: Usuario,
                as: 'Tutor'
            }, {
                model: TipoTutoria,
                as: 'TipoTutoria',
                attributes: ['nombre']
            }
        ]
        }],
        order: [['fechaCreacion', 'DESC']]
    });

    // Formatear cada notificación para su presentación
    return notifications.map(notification => formatNotification(notification));
};

exports.markNotificationsAsRead = async (notificationIds, performedBy) => {
    await Notificacion.update(
        { leido: true },
        {
            where: {
                id_notificacion: notificationIds
            },
            performedBy,
            individualHooks: true
        }
    );
};
