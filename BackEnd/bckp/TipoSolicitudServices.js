const TipoSolicitud = require('./models/TipoSolicitud');


const TipoSolicitudService = {
    async insertar(tipoSolicitudData){
        return await TipoSolicitudService.create({
            nombre: tipoSolicitudData.nombre_estado,
            descripcion: tipoSolicitudData.descripcion_estado,
            es_activo: 1
        });
    },

    async obtenerTodos(){
        return await TipoSolicitud.findAll();
    },

    async obtenerPorId(id){
        return await TipoSolicitud.findByPk(id);
    }



};


// Insert a new TipoSolicitud
async function insertar(tipoSolicitud) {
    try {
        const nuevaTipoSolicitud = await TipoSolicitud.create(tipoSolicitud);
        return nuevaTipoSolicitud;
    } catch (error) {
        throw new Error('Error al insertar tipo de solicitud');
    }
}

// Retrieve all TipoSolicitud
async function obtenerTodos() {
    try {
        const tiposSolicitud = await TipoSolicitud.findAll();
        return tiposSolicitud;
    } catch (error) {
        throw new Error('Error al obtener los tipos de solicitud');
    }
}

// Retrieve a single TipoSolicitud by ID
async function obtenerPorId(id) {
    try {
        const tipoSolicitud = await TipoSolicitud.findByPk(id);
        if (!tipoSolicitud) {
            throw new Error('Tipo de solicitud no encontrado');
        }
        return tipoSolicitud;
    } catch (error) {
        throw new Error('Error al obtener el tipo de solicitud');
    }
}

// Update a TipoSolicitud
async function actualizar(id, datosActualizados) {
    try {
        const resultado = await TipoSolicitud.update(datosActualizados, {
            where: { idTipoSolicitud: id }
        });
        if (resultado[0] === 1) {
            return await TipoSolicitud.findByPk(id);
        }
        throw new Error('No se encontró el tipo de solicitud o no se realizó ninguna actualización');
    } catch (error) {
        throw new Error('Error al actualizar el tipo de solicitud');
    }
}

// Logically delete a TipoSolicitud by setting esActivo to 0
async function eliminar(id) {
    try {
        const resultado = await TipoSolicitud.update({ es_activo: 0 }, {
            where: { idTipoSolicitud: id }
        });
        if (resultado[0] === 1) {
            return { message: 'Tipo de solicitud desactivado exitosamente' };
        }
        throw new Error('No se encontró el tipo de solicitud para desactivar');
    } catch (error) {
        throw new Error('Error al desactivar el tipo de solicitud');
    }
}

module.exports = {
    insertar,
    obtenerTodos,
    obtenerPorId,
    actualizar,
    eliminar
};