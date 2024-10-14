const ErrorLogService = require('../services/ErrorLogService');

const ErrorLogController = {
    async listarPaginacion(req, res) {
        const { 
            page = 1, 
            pageSize = 10, 
            sortBy = 'timestamp', 
            sortOrder = 'DESC', 
            searchCriterias = [],
            fechaDesde,
            fechaHasta
        } = req.body;

        try {
            const result = await ErrorLogService.listarPorPaginacion({ 
                page, 
                pageSize, 
                fechaDesde, 
                fechaHasta,
                userSearch: searchCriterias.find(criteria => criteria.field === 'performedBy')?.value,
                errorTypeSearch: searchCriterias.find(criteria => criteria.field === 'errorType')?.value,
                sortBy,
                sortOrder
            });
            res.status(200).json({
                message: "Error logs listed successfully",
                data: result
            });
        } catch (error) {
            console.error('Error listing error logs:', error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
};

module.exports = ErrorLogController;