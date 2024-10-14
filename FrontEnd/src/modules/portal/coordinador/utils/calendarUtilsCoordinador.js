export const convertCitasPorTutor = (response) => {
    console.log("RESPONSE CITAS: ", response)
    console.log("Reposne citas programadas", response['Citas programadas'])
    console.log(Array.isArray(response['Citas programadas']))
    const programadas = response['Citas programadas'];
    const citasProgramadas = programadas.map(cita => ({
      id: cita.idCita,
      title: `Cita ${cita.TipoTutoria} Programada`,
      //title: `Cita prueba Programada`,
      start: cita.fechaHoraInicio,
      end: cita.fechaHoraFin,
      /* start: convertirFormato(cita.fechaHoraInicio),
      end: convertirFormato(cita.fechaHoraFin), */
      color: '#8667F1', // Morado
      display: 'auto',
      allDay: false
    }));
/*
    const canceladas = response['Citas canceladas'];
    const citasCanceladas = canceladas.map(cita => ({
      id: cita.idCita,
      title: `Cita ${cita.TipoTutoria} Cancelada`,
      //tittle: `Cita prueba Cancelada`,
      start: cita.fechaHoraInicio,
      end: cita.fechaHoraFin,
      color: '#FF0000', // Rojo
      display: 'auto',
      allDay: false
    }));
*/
    const completadas = response['Citas completadas'];
    const citasCompletadas = completadas.map(cita => ({
      id: cita.idCita,
      //tittle: `Cita prueba Completada`,
      tittle: `Cita ${cita.TipoTutoria} Completada`,
      start: cita.fechaHoraInicio,
      end: cita.fechaHoraFin,
      color: '#22B14C', // Verde
      display: 'auto',
      allDay: false
    }));


    console.log("CITAS: ", citasProgramadas,citasCompletadas)
    return [...citasProgramadas, ...citasCompletadas];
  };