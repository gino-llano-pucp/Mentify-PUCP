
const InstitucionServices = require('../services/InstitucionServices');

module.exports = {
  listar: async (req, res) => {
    try {
      const institucion = await InstitucionServices.listar();
      res.status(200).json(institucion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  editar: 
    async (req, res) => {
      const { id } = req.params;
      const datos = req.body;
      const performedBy = req.user.id;
      try {
          const institucionActualizada = await InstitucionServices.editar(id, datos, performedBy);
          res.status(200).json(institucionActualizada);
      } catch (error) {
          console.error("Error editing institution:", error);
          res.status(500).json({ message: "Error interno al editar la institución.", details: error.message });
      }
    }
};
