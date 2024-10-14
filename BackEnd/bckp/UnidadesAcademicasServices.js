const UnidadesAcademicas = require('./models/UnidadesAcademicasModel');

async function insertar(unidadAcademica) {
    try {
        const nuevaUnidadAcademica = await UnidadesAcademicas.create(unidadAcademica);
        return nuevaUnidadAcademica;
    } catch (error) {
        throw new Error('Error al insertar una unidad académica');
    }
}

async function obtenerTodos() {
    try {
        const unidadesAcademicas = await UnidadesAcademicas.findAll();
        return unidadesAcademicas;
    } catch (error) {
        throw new Error('Error al obtener las unidades académicas');
    }
}

async function obtenerPorId(id) {
    try {
        const unidadAcademica = await UnidadesAcademicas.findByPk(id);
        return unidadAcademica;
    } catch (error) {
        throw new Error('Error al obtener la unidad académica');
    }
}

async function actualizar(id, datosActualizados) {
    try {
        const resultado = await UnidadesAcademicas.update(datosActualizados, {
            where: { id_unidad_academica: id }
        });
        if (resultado[0] === 1) {
            return await UnidadesAcademicas.findByPk(id);
        }
        throw new Error('No se encontró la unidad académica o no se realizó ninguna actualización');
    } catch (error) {
        throw new Error('Error al actualizar la unidad académica');
    }
}

async function eliminar(id) {
    try {
        const resultado = await UnidadesAcademicas.update({ es_activo: 0 }, {
            where: { id_unidad_academica: id }
        });
        if (resultado[0] === 1) {
            return { message: 'Unidad académica desactivada exitosamente' };
        }
        throw new Error('No se encontró la unidad académica para desactivar');
    } catch (error) {
        throw new Error('Error al desactivar la unidad académica');
    }
}

module.exports = {
    insertar,
    obtenerTodos,
    obtenerPorId,
    actualizar,
    eliminar
};