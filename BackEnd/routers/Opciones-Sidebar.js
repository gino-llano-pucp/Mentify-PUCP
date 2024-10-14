const express = require('express');
const db = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');
const OpcionSidebar = db.OpcionSidebar;
const Rol = db.Rol;
const RolesUsuario = db.Roles_Usuario;
const Usuario = db.Usuario;
const Programa = db.Programa;
const Facultad = db.Facultad;
const router = express.Router();

router.use(verifyToken);

// Función auxiliar para manejar la creación recursiva
async function createOpcionWithChildren(opcionData) {
  const { children, ...opcionAttributes } = opcionData;
  const opcion = await OpcionSidebar.create(opcionAttributes);

  if (children && children.length) {
    await Promise.all(children.map(async child => {
      child.parentId = opcion.id; // Establece el parentId al ID de la opción creada
      await createOpcionWithChildren(child);
    }));
  }

  return opcion;
}

router.post('/registrar-opcion-sidebar/', async (req, res) => {
  try {
    const opcion = await createOpcionWithChildren(req.body);
    res.status(201).send(opcion);
  } catch (error) {
    console.error('Error al crear OpcionSidebar:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

async function obtenerDescendientes(opcionId, opcionesList) {
    const children = await OpcionSidebar.findAll({
      where: { parentId: opcionId }
    });
  
    for (let child of children) {
      opcionesList.push(child.id);
      await obtenerDescendientes(child.id, opcionesList); // Llamada recursiva para obtener todos los descendientes
    }
  }  

  router.post('/asociar-opciones-rol', async (req, res) => {
    const { idRol, opcionesSidebar } = req.body;
  
    try {
      const rol = await Rol.findByPk(idRol);
      if (!rol) {
        return res.status(404).send({ error: 'Rol no encontrado' });
      }
  
      let todasLasOpciones = [...opcionesSidebar]; // Copia inicial de las opciones a asociar
  
      // Recuperar todos los descendientes de las opciones seleccionadas
      for (let opcionId of opcionesSidebar) {
        await obtenerDescendientes(opcionId, todasLasOpciones);
      }
  
      // Eliminar duplicados que podrían haberse introducido por opciones que son hijos de más de una opción
      todasLasOpciones = [...new Set(todasLasOpciones)];
  
      // Encontrar las opciones de sidebar válidas basadas en los IDs recopilados
      const opcionesValidas = await OpcionSidebar.findAll({
        where: {
          id: todasLasOpciones
        }
      });
  
      // Asociar opciones de sidebar al rol sin eliminar las existentes
      await rol.addOpciones(opcionesValidas);
  
      // Opcional: retornar el rol con sus opciones de sidebar asociadas
      const rolConOpciones = await Rol.findByPk(idRol, {
        include: [{
          model: OpcionSidebar,
          as: 'opciones',
          through: {
            attributes: []
          }
        }]
      });
  
      res.status(200).send(rolConOpciones);
    } catch (error) {
      console.error('Error al asociar opciones de sidebar:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  });

  router.get('/sidebar-options', verifyToken, async (req, res) => {
    console.log("Verificando token y extrayendo usuario...");
    try {
        let idUsuario = req.user.id; // Obtenemos el ID del usuario desde el token decodificado
        let userRoles = req.user.roles; // Obtenemos los roles desde el token decodificado
        console.log("Roles del usuario:", userRoles);

        // Asegurar que userRoles sea siempre un array
        if (!Array.isArray(userRoles)) {
          userRoles = [userRoles]; // Convierte a array si no lo es
        }

        if (!userRoles || userRoles.length === 0) {
            console.log("No se encontraron roles para el usuario.");
            return res.status(404).json({ error: { message: "No se encontraron roles para el usuario." } });
        }

        const menus = []; // Aquí guardaremos los menús por cada rol

        // Procesar cada rol por separado
        for (const role of userRoles) {
            console.log(`Buscando opciones de sidebar para el rol: ${role}...`);
            const opciones = await OpcionSidebar.findAll({
                include: [{
                    model: Rol,
                    as: 'roles',
                    where: { nombre: role },
                    attributes: []
                }]
            });

            console.log(`Opciones encontradas para ${role}:`, opciones.length);
            if (opciones.length === 0) {
                console.log(`No se encontraron opciones de sidebar para el rol: ${role}`);
                continue;
            }

            // Buscar el id del rol actual en la tabla rol con el nombre y obtener el id
            const rol = await Rol.findOne({
                where: {
                    nombre: role
                }
            });

            // Buscar si el usuario tiene un rol asignado igual a role y que este sea activo en Roles_Usuario y Rol
            const rolUsuario = await RolesUsuario.findOne({
                where: {
                    id_usuario: idUsuario,
                    id_rol: rol.id_rol,
                    es_activo: true
                }
            });

            console.log('Rol:', role);
            console.log("Rol encontrado en Roles_Usuario:", rolUsuario ? "Sí" : "No");

            let cumpleFiltroFacu = true;
            if(rol.id_rol === 1){
              // Entonces es Coordinador de Facultad
              // mi fid_usuario es el id del usuario idUsuario
              // Buscar la facultad del usuario
              const facultadUsuario = await Facultad.findOne({
                where: {
                  fid_usuario: idUsuario,
                  esActivo: true
                }
              });

              if(!facultadUsuario) {
                cumpleFiltroFacu = false;
              }
            }

            let cumpleFiltroProg = true;
            if(rol.id_rol === 2){
              // Entonces es Coordinador de Programa
              // mi fid_usuario es el id del usuario idUsuario
              // Buscar el programa del usuario
              const programaUsuario = await Programa.findOne({
                where: {
                  fid_usuario: idUsuario,
                  esActivo: true
                }
              });

              if(!programaUsuario) {
                cumpleFiltroProg = false;
              }
            }

            if (rolUsuario && cumpleFiltroFacu && cumpleFiltroProg) {
              // Construir el menú para el rol actual
              const menuItems = buildMenu(opciones);
              menus.push({
                  role: role,
                  menuItems: menuItems
              });
            }
        }

        console.log("Menús construidos para todos los roles:", JSON.stringify(menus));
        res.json(menus);
    } catch (error) {
        console.error('Error al obtener las opciones de sidebar:', error);
        res.status(500).send({ error: { message: "Error interno del servidor. Por favor, intente de nuevo más tarde." } });
    }
});

function buildMenu(opciones, parentId = null) {
    return opciones
        .filter(opcion => opcion.parentId === parentId)
        .map(opcion => ({
            id: opcion.id.toString(),
            label: opcion.label,
            icon: opcion.icon,
            componentId: opcion.componentId,
            children: buildMenu(opciones, opcion.id)
        }));
}





module.exports = router;
