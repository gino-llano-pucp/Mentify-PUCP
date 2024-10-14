import fetchAPI from "@/modules/core/services/apiService";
import { convertCitasPorTutor } from "../utils/calendarUtilsCoordinador";
import { convertDisponibilidades } from "../../tutor/utils/calendarUtils";

export const fetchDisponibilidadesPorTutor = async (session,idTutor) => {
    const payload = {
        idTutor: idTutor
    };
    
    const response = await fetchAPI({
    endpoint: '/disponibilidades/disponibilidadTutor',
    method: 'POST',
    payload: payload,
    token: session.accessToken,
    successMessage: '',
    errorMessage: '',
    showToast: false
    });
    console.log("DISPONIBILIDADES: ", response)
    return response ? convertDisponibilidades(response) : []; //Revisar el convertDisponibilidades
};

export const enviarDisponibilidadesPorTutor = async (disponibilidadesData, deletedDisponibilidades, session,idTutor) => {
    const payload = {
      disponibilidadesData,
      deletedDisponibilidades,
      idTutor: idTutor
    };
    console.log("Se enviará ",payload);
    //FALTA LA API
    try {
      const response = await fetchAPI({
        endpoint: '/disponibilidades/',
        method: 'POST',
        payload: payload,
        token: session.accessToken,
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

export const listarCitasPorTutor = async (session, idTutor) => {
    const payload = {
        idTutor: idTutor
    };
    try {
        const response = await fetchAPI({
        endpoint: `/sesionCita/listarCitasTutorMultiUso/`,
        method: 'POST',
        payload: payload,
        token: session.accessToken,
        successMessage: 'Citas cargadas con éxito',
        errorMessage: 'Error al cargar las citas',
        showToast: false,
        });
        console.log(response);
        return response ? convertCitasPorTutor(response.listado) : []; //Revisar el convertCitas
    } catch (error) {
        console.error('Error listando las citas del tutor:', error);
        return null;
    }
};

  