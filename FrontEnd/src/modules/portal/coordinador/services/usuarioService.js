import fetchAPI from "@/modules/core/services/apiService";

export const fetchAlumnosYTutores = async (token, page, pageSize, fid_tipoTutoria, search = '', role) => {
    try {
        const response = await fetchAPI({
          endpoint: `/usuario/alumnos-facultad-todos-tutores/${page}/${pageSize}/${fid_tipoTutoria}`,
          method: 'POST',
          token: token,
          payload: {
            "searchValue": search,
            "currentRole": role
          },
          successMessage: 'Alumnos de la facultad listados.',
          errorMessage: 'Error al cargar alumnos.',
          showToast: false,
          useCache: true
        });
        return response;
      } catch (error) {
        console.error('Error fetching alumnos:', error);
        return null;
      }
  };
  