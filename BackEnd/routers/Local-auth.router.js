const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController')

/*Considerar quitar, no sigue la estructura MVC planteada
LOS ROUTERS SOLO DEBEN SER PARA REDIRIGIR AL CONTROLLER, LUEGO
EL CONTROLLER LLAMA AL SERVICIO (MODELO VISTA CONTROLADOR)
*/

router.post('/local-auth/', UsuarioController.login);

module.exports = router;