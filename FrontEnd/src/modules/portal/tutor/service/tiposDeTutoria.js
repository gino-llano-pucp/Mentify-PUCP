import fetchAPI from "@/modules/core/services/apiService";
import { jwtDecode } from "jwt-decode";

export const fetchTutoringTypes = async (token, pageNum, search = '') => {
  try {
    console.log("search value 123: ", search);
    const response = await fetchAPI({
      endpoint: `/asignacionTipoTutoria/listar-tipoTutoria-tutor/${pageNum}`,
      method: 'POST',
      token: token,
      payload: {
        searchCriterias: [
          {
              field: 'nombre',
              value: search
          },
        ]
      },
      successMessage: 'Tipos de tutoría cargados correctamente',
      errorMessage: 'Error al cargar tipos de tutoría',
      showToast: false
    });
    console.log("esto de aqui: ", response.nuevaAsignacionTipoTutoria);
    return response.nuevaAsignacionTipoTutoria;
  } catch (error) {
    console.error('Error fetching tutoring types:', error);
    return null;
  }
};

export const fetchAlumnosPorTipoDeTutoria = async (token, idTipoDeTutoria, pageNum, search = '') => {
  console.log(token);
  try {
    const response = await fetchAPI({
      endpoint: `/asignacionTipoTutoria/listar-alumnos-por-tipoTutoria/${pageNum}`,
      method: 'POST',
      token: token,
      payload: {
        idTipoDeTutoria: idTipoDeTutoria,
        pageSize: 10,
        sortBy: 'fechaCreacion',
        sortOrder: 'DESC',
        searchCriterias: [
          {
            field: 'nombre',
            value: search
          }
        ]
      },
      successMessage: 'Alumnos cargados correctamente',
      errorMessage: 'Error al cargar Alumnos',
      showToast: false
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return null;
  }
};


export const fetchAlumnosAsignados = async (token, idTipoDeTutoria, pageNum, search) => {
  console.log(search);
  try {
    const response = await fetchAPI({
      endpoint: `/usuario/listar-alumnosAsigandos-tutor/${jwtDecode(token).id}`,
      method: 'POST',
      token: token,
      payload: {
        "page": pageNum,
        "pageSize": 1000,
        "sortBy": "fechaCreacion",
        "sortOrder": "DESC",
        "searchCriterias": [
        {
        "field": search,
        "idTipoTutoria": idTipoDeTutoria,
        }
        ]
      },
      successMessage: 'Alumnos cargados correctamente',
      errorMessage: 'Error al cargar Alumnos',
      showToast: false
  });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return null;
  }
};

export const fetchTutoringTypesTutorStudent = async (token, idAlumno) => {
  console.log(jwtDecode(token).id)
  console.log(idAlumno)
  try {
    const response = await fetchAPI({
      endpoint: `/asignacionTutorAlumno/listar-tipos-tutoria-asignados`,
      method: 'POST',
      token: token,
      payload: {
        "idAlumno": idAlumno,
        "idTutor": jwtDecode(token).id
      },
      successMessage: 'Alumnos cargados correctamente',
      errorMessage: 'Error al cargar Alumnos',
      showToast: false
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return null;
  }
};
