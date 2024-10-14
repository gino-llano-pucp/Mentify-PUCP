const RolesUsuarioService = require('../services/RolesUsuarioServices');

const RolesUsuarioController = {
    async insertarEnUsuario(req, res){
        const { id_usuario, id_rol } = req.body;
        try{
            const rolUsuario = await RolesUsuarioService.insertar(id_usuario, id_rol);
            res.status(201).json({
                message: 'RolUsuario created successfully'
            });
        }catch(error){
            console.error(error);
            res.status(500).json({
                message: 'Server error'
            })
        }
    }
};

module.exports = RolesUsuarioController; 