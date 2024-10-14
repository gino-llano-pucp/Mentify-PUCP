const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../models');
const UsuarioService = require('../services/UsuarioService');
const Usuario = db.Usuario;
const Rol = db.Rol;
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-auth/', async (req, res) => {
  console.log('Iniciando autenticación con Google');

  try {
    const { id_token } = req.body;
    console.log('ID token recibido:', id_token);

    if (!id_token) {
      console.error('No se proporcionó ID token');
      return res.status(400).json({ error: 'No ID token provided' });
    }

    // Verificar el ID token de Google OAuth
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log('ID token verificado');

    const payload = ticket.getPayload();
    console.log('Payload obtenido:', payload);

    // Buscar usuario
    let usuario = await Usuario.findOne({
                where: { email: payload.email , esActivo: true},
                include: [{
                    model: Rol,
                    as: 'Roles', // Es opcional definir un alias
                    through: {
                    attributes: [], // Puedes especificar atributos específicos de la tabla intermedia si es necesario
                    where: { es_activo: true}
                    }
                }]
                });
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      console.error('Usuario no encontrado:', payload.email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const rolesActivos = await UsuarioService.obtenerRolesPorIdUsuarioyEstado(usuario.id_usuario);
    const allRolesInactive = rolesActivos.every(es_activo => !es_activo);
        if (allRolesInactive) {
            return res.status(401).json({ message: "User roles are inactive" });
        }
    // Mapear los roles para incluirlos en el token
    const roles = usuario.Roles.map(rol => rol.nombre); // Asumiendo que cada rol tiene un atributo 'nombre'
    
    // Crear el JWT y el refresh token
    const accessToken = jwt.sign(
        {
        id: usuario.id_usuario,
        email: usuario.email,
        roles: roles,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
    );

    // Calcular expires_at para el access token
    let currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
    const accessTokenExpiresAt = currentTime + 3600; // 1 hora en segundos
    console.log("tiempo exp: ", accessTokenExpiresAt);
    console.log('Access token creado');

    const refreshToken = jwt.sign(
        {
        id: usuario.id_usuario,
        email: usuario.email,
        roles: roles,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7d' }
    );
    console.log('Refresh token creado');

    // Devolver los tokens al frontend
    res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: accessTokenExpiresAt,
      id: Usuario.id_usuario,
    });

    console.log('Autenticación exitosa, tokens enviados');

  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ error: 'Error authenticating' });
  }
});

module.exports = router;