import fetchAPI from "@/modules/core/services/apiService";

export const fetchTutoringTypesAlumno = async (token, pageNum, search = '') => {
  try {
    console.log("search value 123: ", search);
    const response = await fetchAPI({
      endpoint: `/asignacionTipoTutoria/listar-tipoTutoria-individuales/${pageNum}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching tutoring types:', error);
    return null;
  }
};

export const fetchTutoresPorTipoTutoria = async (token, idTipoDeTutoria, pageNum, search = '') => {
  const payload = {
    idTipoDeTutoria,
    searchCriterias: [
      {
        field: 'nombres',
        value: search
      },
    ],
    pageSize: 10,
    sortBy: 'fechaCreacion',
    sortOrder: 'DESC'
  };
  console.log(payload)
  try {
    const response = await fetchAPI({
      endpoint: `/asignacionTipoTutoria/listar-tutores-por-tipoTutoria/${pageNum}`,
      method: 'POST',
      token: token,
      payload: payload,
      successMessage: 'Tutores cargados correctamente',
      errorMessage: 'Error al cargar tutores',
      showToast: false
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tutors by tutoring type:', error);
    return null;
  }
};