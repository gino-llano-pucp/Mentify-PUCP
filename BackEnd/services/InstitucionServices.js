const db = require('../models/')
const Institucion = db.Institucion;

module.exports = {
  listar: async () => {
    const institucion = await Institucion.findOne({ where: { id: 1 } });
    if (!institucion) {
      return null
    }

    const logoBase64 = institucion.logo ? institucion.logo.toString('base64') : null;

    return {
        nombre: institucion.nombre,
        siglas: institucion.siglas,
        logo: logoBase64,
        mensaje: 'Datos de la institución actualizados con éxito.'
    };
  },
  editar: async (id, datos, performedBy) => {
    const { foto, ...restDatos } = datos;
    const newDatos = { ...restDatos, logo: foto ? Buffer.from(foto, 'base64') : null };

    console.log("datos: ", newDatos);

    let institucion = await Institucion.findByPk(id);

    if (!institucion) {
        institucion = await Institucion.create({ id: 1, ...newDatos }, {performedBy, individualHooks: true}); // Crear con id = 1
        return {
            nombre: institucion.nombre,
            siglas: institucion.siglas,
            logo: institucion.logo.toString('base64'), // Convertir el BLOB a base64 para la respuesta
            mensaje: 'Institución creada con éxito.'
        };
    } else {
        await institucion.update(newDatos, { performedBy, individualHooks: true });
        return {
            nombre: institucion.nombre,
            siglas: institucion.siglas,
            logo: institucion.logo.toString('base64'), // Convertir el BLOB a base64 para la respuesta
            mensaje: 'Datos de la institución actualizados con éxito.'
        };
    }
  }
};
