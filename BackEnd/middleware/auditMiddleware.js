const cls = require('cls-hooked');
const namespace = cls.getNamespace('my-namespace');

const logAction = async (accion, instance, options) => {
    const primaryKeyField = instance.constructor.primaryKeyAttribute;
    const req = namespace.get('req');

    await instance.sequelize.models.AuditLog.create({
        id_usuario: req.options.id_usuario,
        accion: accion,
        nombreTabla: instance.constructor.name,
        id_fila: instance[primaryKeyField],
        fechaAccion: new Date(),
    });
};

module.exports = logAction;
