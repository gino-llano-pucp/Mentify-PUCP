const { default: fetchAPI } = require("@/modules/core/services/apiService");

export const fetchRegitroRespuestaEncuesta = async (session, idSurvey,answers) => {
    //setLoading(true);
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    //Para tutores es 1 y para solicitudes es 2
    const data = await fetchAPI({
      endpoint: `/Encuesta/registro-respuestas`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idEncuesta": idSurvey,
        "respuestas": answers.map(answer => answer.idRespuesta),
      },
      successMessage: 'Encuestas cargadas correctamente',
      errorMessage: 'Error al cargar Encuestas',
      showToast: false
  });
  console.log(answers)
  console.log(data)

  /*
  if (data && data.usuarios.length > 0) {
    setTutores(data.usuarios);
    setTotalPages(data.totalPages);
    //const codigosTutores = data.data.tutores.map(asignacion => asignacion.Tutor.codigo);
    
  } else {
    setSurverys([]);
  }
  */
  //setLoading(false);
}