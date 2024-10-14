const { default: fetchAPI } = require("@/modules/core/services/apiService");

export const enviarDisponibilidades = async (disponibilidadesData, deletedDisponibilidades, token) => {
    const payload = {
      disponibilidadesData,
      deletedDisponibilidades
    };
  
    try {
      const response = await fetchAPI({
        endpoint: '/disponibilidades/',
        method: 'POST',
        payload: payload,
        token: token,
        successMessage: 'Disponibilidad guardada con éxito',
        errorMessage: 'Error al guardar la disponibilidad',
        showToast: false
      });
      return response;
    } catch (error) {
      console.error("Error al enviar disponibilidades: ", error);
      return null;
    }
};