const db = require('../models')
const RolUsuario = db.Roles_Usuario;

const RolesUsuarioService = {
    async insertar(id_usuario, id_rol, performedBy){
        return await RolUsuario.create({
            id_usuario: id_usuario,
            id_rol: id_rol,
            es_activo: true,
        },
        {
            performedBy,
        });
    }
};

module.exports = RolesUsuarioService;