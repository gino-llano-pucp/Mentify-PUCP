const { ErrorLog } = require('../models');

async function logError(error, userId, endpoint, method, params) {
  try {
    await ErrorLog.create({
      fid_usuario: userId,
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      endpoint,
      method,
      params,
      timestamp: new Date()
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }
}

module.exports = logError;