const express = require('express');
const router = express.Router();
const HistoricoEstudianteController = require('../controllers/HistoricoEstudianteController');
const { verifyToken } = require('../middleware/authMiddleware');


router.use(verifyToken);
// Route to create a new HistoricoEstudiante entry
router.post('/register', HistoricoEstudianteController.createHistoricoEstudiante);

// Route to list all HistoricoEstudiante entries
router.get('/list-all', HistoricoEstudianteController.getAll);

// Route to get HistoricoEstudiante by ID using POST
router.post('/get-by-id', HistoricoEstudianteController.getById);

// Route to update HistoricoEstudiante using POST
router.post('/update', HistoricoEstudianteController.update);

// Route to delete HistoricoEstudiante logically using POST
router.post('/delete', HistoricoEstudianteController.deleteLogical);

// Route to get HistoricoEstudiante by ID using POST
router.post('/getHistoricoPorEstudiante', HistoricoEstudianteController.getByAlumno);

module.exports = router;
