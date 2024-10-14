const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (userData) => {
  return jwt.sign({ data: userData }, secretKey, { expiresIn: '1d' });
};

// Función para generar tanto el access token como el refresh token
const generateTokens = (data) => {
  const accessToken = jwt.sign(
      { id: data.id, email: data.email, roles: data.roles },
      secretKey,
      { expiresIn: '1d' } // Duración del access token
  );
  
  const refreshToken = jwt.sign(
      { id: data.id, email: data.email, roles: data.roles },
      secretKey,
      { expiresIn: '7d' } // Duración del refresh token
  );

  // Calcular expires_at para el access token
  let currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
  const accessTokenExpiresAt = currentTime + 3600*24; // 1 hora en segundos

  console.log("expiracion es: ", accessTokenExpiresAt);

  return { accessToken, refreshToken, accessTokenExpiresAt };
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  if (!token) {
    return res.status(403).json({ error: { message: "No se proporcionó un token de acceso." } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Añade la información del usuario al objeto de solicitud
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: "Token inválido o expirado." } });
  }
};


const refreshToken = (req, res) => {
  const oldToken = req.headers.authorization?.split(' ')[1];
  if (!oldToken) {
    return res.status(403).send('Authentication token is required for refreshing');
  }

  try {
    const data = jwt.verify(oldToken, secretKey, { ignoreExpiration: true });
    console.log("data: ", data);
    const { accessToken, refreshToken, accessTokenExpiresAt } = generateTokens(data);
    return res.json({ accessToken, refreshToken, accessTokenExpiresAt });
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

const verifyTokenAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Administrador"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

const verifyTokenCoordinador = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Coordinador de Facultad" || role == "Coordinador de Programa"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

const verifyTokenTutor = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Tutor"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

const verifyTokenAlumno = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Alumno"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

const verifyTokenAsistente = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Asistente"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

const verifyTokenCoordAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('--------------------------------');
    console.log(decoded.roles);
    //lo ideal seria manejarlo con el id del rol cosa que si el nombre
    //cambia no habria problema
    for(let i = 0; i < decoded.roles.length; i++) {
      console.log(decoded.roles[i]);
      var role = decoded.roles[i];
      if(role == "Coordinador de Facultad" || role == "Coordinador de Programa" || role == "Administrador"){
        req.user = decoded; // Añade la información del usuario al objeto de solicitud
        next();
        return;
      }
    }
    return res.status(403).json({
      auth: false, 
      message: "No tienes persmiso para acceder a esta ruta"
    })
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

module.exports = { 
  generateToken, 
  verifyToken, 
  refreshToken, 
  verifyTokenAdmin,
  verifyTokenAlumno,
  verifyTokenAsistente,
  verifyTokenCoordinador,
  verifyTokenTutor,
  verifyTokenCoordAdmin
};

