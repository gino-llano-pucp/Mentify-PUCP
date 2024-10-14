const db = require('../models');
const EstadoCompromiso = db.EstadoCompromisoCita;

const EstadoCompromisoService = {
  async insertar(estadoCompromisoData){
    return await EstadoCompromiso.create({
      nombre: estadoCompromisoData.nombre,
      descripcion: estadoCompromisoData.descripcion,
      es_activo: 1
    });
  },

  async obtenerTodos(){
    return await EstadoCompromiso.findAll({
      where: {
        es_activo: 1
      }
    });
  },

  async obtenerPorId(id){
    return await EstadoCompromiso.findByPk(id);
  },
  
  async actualizar(id, datosActualizados) {
    const estadoCompromiso = await EstadoCompromiso.findByPk(id);
    if(!estadoCompromiso){
      return null;
    }
    await estadoCompromiso.update({
      nombre: datosActualizados.nombre_estado,
      descripcion: datosActualizados.descripcion_estado,
      es_activo: datosActualizados.es_activo
    },
    {
      where: {
        id_estado_compromiso: id
      }
    });
    return estadoCompromiso;
  },
  async eliminar(id){
    const estadoCompromiso = await EstadoCompromiso.findByPk(id);
    if(!estadoCompromiso){
      return null;
    }
    await estadoCompromiso.update({
      es_activo: 0
    },
    {
      where: {
        id_estado_compromiso: id
      }
    });
    return estadoCompromiso;
  }
};

module.exports = EstadoCompromisoService;
