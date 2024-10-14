import fetchAPI from "@/modules/core/services/apiService";
import { convertDisponibilidades } from "../../tutor/utils/calendarUtils";

export const fetchDisponibilidadesTutor = async (session, idTutor) => {
    const response = await fetchAPI({
      endpoint: '/disponibilidades/disponibilidadTutor',
      method: 'POST',
      payload: {
        idTutor: idTutor
      },
      token: session.accessToken,
      successMessage: '',
      errorMessage: '',
      showToast: false
    });
    console.log("DISPONIBILIDADES: ", response)
    return response ? convertDisponibilidades(response) : [];
  };