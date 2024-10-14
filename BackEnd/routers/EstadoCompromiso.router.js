const router = require('express').Router();
const EstadoCompromisoController = require('../controllers/EstadoCompromisoController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

//para listar todos
router.get('/estadoCompromiso', EstadoCompromisoController.obtenerTodos);

//añadir 
router.post('/estadoCompromiso', EstadoCompromisoController.crearEstadoCompromiso);

//actualizar por id
router.put('/estadoCompromiso/:id', EstadoCompromisoController.actualizar);

//listar por id
router.get('/estadoCompromiso/:id', EstadoCompromisoController.obtenerPorId);

//eliminar
router.delete('/estadoCompromiso/:id', EstadoCompromisoController.eliminar);


module.exports = router;