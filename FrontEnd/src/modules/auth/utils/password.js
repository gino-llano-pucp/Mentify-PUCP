// Importar bcrypt con import en lugar de require
import bcrypt from 'bcryptjs';

// Establecer el costo del hashing (la "fuerza" del hash)
const saltRounds = 10;

/**
 * Función para aplicar salt y hash a una contraseña.
 * @param {string} password La contraseña en texto plano.
 * @returns {Promise<string>} La contraseña hasheada.
 */
async function saltAndHashPassword(password) {
  try {
    // Generar el hash de la contraseña con sal
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

// Usar export en lugar de module.exports
export { saltAndHashPassword };
