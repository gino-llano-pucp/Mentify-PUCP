const AuditServices = require('../services/AuditServices');

const AuditController = {
  async obtenerLogs(req, res) {
    try {
      const { page, pageSize, fechaDesde, fechaHasta, searchCriterias } = req.body;
      const result = await AuditServices.getAuditLogs({ 
        page, 
        pageSize, 
        fechaDesde, 
        fechaHasta,
        userSearch: searchCriterias.find(criteria => criteria.field === 'performedBy')?.value,
        tableSearch: searchCriterias.find(criteria => criteria.field === 'tableName')?.value
      });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener los logs de auditoría:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = AuditController;
