const HistoricoEstudianteServices = require('../services/HistoricoEstudianteServices');

const HistoricoEstudianteController = {
    async createHistoricoEstudiante(req, res) {
        const data = req.body;
        const performedBy = req.user.id;
        try {
            const newHistoricoEstudiante = await HistoricoEstudianteServices.insert(data, performedBy);
            res.status(201).json({
                message: "HistoricoEstudiante created successfully",
                newHistoricoEstudiante
            });
        } catch (err) {
            console.error("Error creating HistoricoEstudiante", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAll(req, res) {
        try {
            const historicoList = await HistoricoEstudianteServices.getAll();
            res.status(200).json({
                message: "Data retrieved successfully",
                historicoList
            });
        } catch (err) {
            console.error("Error retrieving HistoricoEstudiante data", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req, res) {
        const { id } = req.body;
        try {
            const historico = await HistoricoEstudianteServices.getById(id);
            if (!historico) {
                return res.status(404).json({ error: 'HistoricoEstudiante not found' });
            }
            res.status(200).json({
                message: "HistoricoEstudiante retrieved successfully",
                historico
            });
        } catch (err) {
            console.error("Error retrieving HistoricoEstudiante:", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res) {
        const { id, ...updateData } = req.body;
        const performedBy = req.user.id;
        try {
            const updatedHistoricoEstudiante = await HistoricoEstudianteServices.update(id, updateData, performedBy);
            if (!updatedHistoricoEstudiante) {
                return res.status(404).json({ error: 'HistoricoEstudiante not found' });
            }
            res.status(200).json({
                message: "HistoricoEstudiante updated successfully",
                updatedHistoricoEstudiante
            });
        } catch (err) {
            console.error("Error updating HistoricoEstudiante:", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteLogical(req, res) {
        const { id } = req.body;
        const performedBy = req.user.id;
        try {
            const result = await HistoricoEstudianteServices.deleteLogical(id, performedBy);
            if (!result) {
                return res.status(404).json({ error: 'HistoricoEstudiante not found' });
            }
            res.status(200).json({
                message: "HistoricoEstudiante deleted successfully",
                result
            });
        } catch (err) {
            console.error("Error deleting HistoricoEstudiante:", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getByAlumno(req, res) {
        const { idAlumno } = req.body;
        try {
            const historico = await HistoricoEstudianteServices.getByAlumno(idAlumno);
            if (!historico) {
                return res.status(404).json({ error: 'HistoricoEstudiante not found' });
            }
            res.status(200).json({
                message: "HistoricoEstudiante retrieved successfully",
                historico
            });
        } catch (err) {
            console.error("Error retrieving HistoricoEstudiante:", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = HistoricoEstudianteController;
