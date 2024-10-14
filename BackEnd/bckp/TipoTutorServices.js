const TipoTutor = require('./models/TipoTutor');


const TipoTutorService = {

    async insertar(tipoTutorService){
        return await TipoTutor.create({
            nombre: tipoTutorService.nombre_tipo_tutor,
            descripcion: tipoTutorService.descripcion_tipo_tutor,
            es_activo: 1
        });
    },

    async obtenerTodos(){
        return await TipoTutor.findAll();
    }, 
    async obtenerPorId(id){
        return await TipoTutor.findByPk(id);
    }

};


async function insertar(tipoTutor) {
    try {
        const nuevoTipoTutor = await TipoTutor.create(tipoTutor);
        return nuevoTipoTutor;
    } catch (error) {
        throw new Error('Error al insertar tipo de tutor');
    }
}

async function obtenerTodos() {
    try {
        const tiposTutor = await TipoTutor.findAll();
        return tiposTutor;
    } catch (error) {
        throw new Error('Error al obtener los tipos de tutor');
    }
}

async function obtenerPorId(id) {
    try {
        const tipoTutor = await TipoTutor.findByPk(id);
        if (!tipoTutor) {
            throw new Error('Tipo de tutor no encontrado');
        }
        return tipoTutor;
    } catch (error) {
        throw new Error('Error al obtener el tipo de tutor');
    }
}

async function actualizar(id, datosActualizados) {
    try {
        const resultado = await TipoTutor.update(datosActualizados, {
            where: { idTipoTutor: id }
        });
        if (resultado[0] === 1) {
            return await TipoTutor.findByPk(id);
        }
        throw new Error('No se encontró el tipo de tutor o no se realizó ninguna actualización');
    } catch (error) {
        throw new Error('Error al actualizar el tipo de tutor');
    }
}

async function eliminar(id) {
    try {
        const resultado = await TipoTutor.update({ esActivo: 0 }, {
            where: { idTipoTutor: id }
        });
        if (resultado[0] === 1) {
            return { message: 'Tipo de tutor desactivado exitosamente' };
        }
        throw new Error('No se encontró el tipo de tutor para desactivar');
    } catch (error) {
        throw new Error('Error al desactivar el tipo de tutor');
    }
}

module.exports = {
    insertar,
    obtenerTodos,
    obtenerPorId,
    actualizar,
    eliminar
};
