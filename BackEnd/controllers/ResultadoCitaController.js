const SesionCitaServices = require('../services/ResultadoCitaServices');
const logError = require('../utils/loggingErrors');

const SesionCitaController = {
    // Método existentes...

    async registrarResultadoCita(req, res) {
        const idTutor = req.user.id;
        const performedBy = req.user.id;
        const { idSesionCita,resultados, compromisos } = req.body;  // Asume que la solicitud incluye id de la sesión, resultados y compromisos
        //const idTutor = req.user.id;  // Asume que el id del tutor está disponible en el objeto req.user

        console.log(req.body);
        try {
            // Llamar al servicio para registrar los resultados de la cita
            const resultadoRegistro = await SesionCitaServices.registrarResultadoCita(
                idSesionCita,
                idTutor,
                resultados,
                compromisos,
                performedBy
            );

            // Enviar una respuesta con estado 201 (Created) indicando que los resultados de la cita han sido registrados correctamente
            res.status(201).json({
                message: "Resultados de la cita registrados con éxito",
                resultadoCita: resultadoRegistro.resultadoCita,
                compromisos: resultadoRegistro.compromisos
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al registrar los resultados de la sesión de cita", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
    },

    
}

module.exports = SesionCitaController;
