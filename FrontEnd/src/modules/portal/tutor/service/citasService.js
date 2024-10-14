import fetchAPI from "@/modules/core/services/apiService";
import { convertCitas, convertDisponibilidades } from "../utils/calendarUtils";
import { jwtDecode } from "jwt-decode";

export const registrarCita = async (cita, token) => {
  try {
    console.log("cita a registrar: ", cita);
    
    const response = await fetchAPI({
      endpoint: `/sesionCita/registrar`,
      method: 'POST',
      token: token,
      payload: cita,
      successMessage: 'Cita registrada con éxito',
      errorMessage: 'Error al registrar la cita',
      showToast: true
    });

    console.log("response: ", response);
    // Verificar si la respuesta contiene el ID de la cita creada
    if (response && response.detalles && response.detalles.id) {
      return response.detalles.id;
    }
    return null;
  } catch (error) {
    console.error('Error registrando la cita:', error);
    return null;
  }
};

export const registrarCitaParteAlumno = async (cita, token) => {
  try {
    console.log("cita a registrar: ", cita);
    
    const response = await fetchAPI({
      endpoint: `/sesionCita/registrarCitaParteAlumno`,
      method: 'POST',
      token: token,
      payload: cita,
      successMessage: 'Cita registrada con éxito',
      errorMessage: 'Error al registrar la cita',
      showToast: true
    });

    console.log("response: ", response);
    // Verificar si la respuesta contiene el ID de la cita creada
    if (response && response.detalles && response.detalles.id) {
      return response.detalles.id;
    }
    return null;
  } catch (error) {
    console.error('Error registrando la cita:', error);
    return null;
  }
};

export const editarCita = async (citaId, citaData, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/editar/${citaId}`,
      method: 'POST',
      token: token,
      payload: citaData,
      successMessage: 'Cita actualizada con éxito',
      errorMessage: 'Error al actualizar la cita',
      showToast: true
    });
    return response;
  } catch (error) {
    console.error('Error editando la cita:', error);
    return null;
  }
};

export const eliminarCita = async (citaId, token, motivo) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/eliminar/${citaId}`,
      method: 'POST',
      token: token,
      payload: {
        motivoRechazo: motivo
      },
      successMessage: 'Cita eliminada con éxito',
      errorMessage: 'Error al eliminar la cita',
      showToast: true,
    });
    return response;
  } catch (error) {
    console.error('Error eliminando la cita:', error);
    return null;
  }
};

export const fetchDisponibilidades = async (session) => {
  const response = await fetchAPI({
    endpoint: '/disponibilidades/',
    method: 'GET',
    token: session.accessToken,
    successMessage: '',
    errorMessage: '',
    showToast: false
  });
  console.log("DISPONIBILIDADES: ", response)
  return response ? convertDisponibilidades(response) : [];
};

export const listarCitasTutor = async (token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/listarCitasTutorMultiUso/`,
      method: 'POST',
      token: token,
      successMessage: 'Citas cargadas con éxito',
      errorMessage: 'Error al cargar las citas',
      showToast: false,
    });
    console.log(response);
    return response ? convertCitas(response.listado) : [];
  } catch (error) {
    console.error('Error listando las citas del tutor:', error);
    return null;
  }
};

export const listarCitasProgramadasTutor = async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-programadas/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas programadas cargadas con exito',
      errorMessage: 'Error al cargar las citas programadas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del tutor:', error);
    return null;
  }
};

export const listarCitasFinalizadasCanceladasTutor = async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-finalizadas/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas finalizadas cargadas con exito',
      errorMessage: 'Error al cargar las citas finalizadas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del tutor:', error);
    return null;
  }
};

export const listarCitasCanceladasTutor = async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-canceladas/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas canceladas cargadas con exito',
      errorMessage: 'Error al cargar las citas canceladas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del tutor:', error);
    return null;
  }
};

export const listarCitasProgramadasAlumno = async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-programadas-alumno/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas programadas cargadas con exito',
      errorMessage: 'Error al cargar las citas programadas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del alumno:', error);
    return null;
  }
};

export const listarCitasFinalizadasCanceladasAlumno = async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-finalizadas-alumno/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas finalizadas cargadas con exito',
      errorMessage: 'Error al cargar las citas finalizadas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del alumno:', error);
    return null;
  }
};

export const listarCitasCanceladasAlumno= async (page, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/citas-canceladas-alumno/${page}`,
      method: 'POST',
      token: token,
      successMessage: 'Citas canceladas cargadas con exito',
      errorMessage: 'Error al cargar las citas canceladas',
      showToast: false,
    });
    return response;
  } catch (error) {
    console.error('Error listando las citas del alumno:', error);
    return null;
  }
};

export const listarCitasAlumno = async (token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/listarCitasAlumno/`,
      method: 'GET',
      token: token,
      successMessage: 'Citas cargadas con éxito',
      errorMessage: 'Error al cargar las citas',
      showToast: false,
    });
    console.log(response);
    return response ? convertCitas(response.listado) : [];
  } catch (error) {
    console.error('Error listando las citas del alumno:', error);
    return null;
  }
};

export const listarCitasAlumnoId = async (token, idAlumno) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/listarCitasAlumnoPorIdJSON/`,
      method: 'POST',
      token: token,
      payload: {
        idAlumno: idAlumno
      },
      successMessage: 'Citas cargadas con éxito',
      errorMessage: 'Error al cargar las citas',
      showToast: false,
    });
    console.log(response);
    return response ? convertCitas(response.listado) : [];
  } catch (error) {
    console.error('Error listando las citas del alumno:', error);
    return null;
  }
};

export const detalleCita = async (idCita, token) => {
  try {
    const response = await fetchAPI({
      endpoint: `/sesionCita/obtenerDetalle/`,
      method: 'POST',
      token: token,
      payload: {
        idCita: idCita
      },
      showToast: false,
    });
    console.log(response);
    return response.detalles;
  } catch (error) {
    console.error('Error obteniendo el detalle de la cita:', error);
    return null;
  }
};