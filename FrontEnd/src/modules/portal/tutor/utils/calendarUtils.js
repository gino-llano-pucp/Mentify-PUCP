import moment from 'moment-timezone';
import toast from 'react-hot-toast';
import { editarCita } from '../service/citasService';

export const generateNumericUUID = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000000).toString();
  return timestamp + randomNum;
};

export const doTimesOverlap = (startA, endA, startB, endB) => {
  return ((startB <= startA && startA <= endB) || (startB <= endA && endA <= endB) ||
         (startA <= startB && startB <= endA) || (startA <= endB && endB <= endA)) /* &&
         (startA != startB || endA != endB) ; */
};

export const minMax = (arr) => {
  let minV = arr[0];
  let maxV = arr[0];
  for (let a of arr) {
    if (a < minV) minV = a;
    if (a > maxV) maxV = a;
  }
  return [minV, maxV];
};

export const getDaysArray = (start, end) => {
  const arr = [];
  for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const formatEventDate = (date) => moment(date).tz('America/Lima').format();

export const convertDisponibilidades = (response) => {
  return response.map(disponibilidad => ({
    id: disponibilidad.id_disponibilidad,
    title: '',
    start: disponibilidad.fechaHoraInicio,
    end: disponibilidad.fechaHoraFin,
    color: 'rgba(0, 193, 188, 100%)',
    display: 'background',
    allDay: false
  }));
};

export const convertirFormato = (fechaHora) => {
  // entrada: 5/2/2024, 23:00:00
  // salida: 2024-06-04T10:30:00-05:00

  const fechaArray = (fechaHora.split(", "))[0].split("/");
  const hora = (fechaHora.split(", "))[1];
  const dia = Number(fechaArray[1]) < 10 ? ("0" + fechaArray[1]) : fechaArray[1]; 
  const mes = Number(fechaArray[0]) < 10 ? ("0" + fechaArray[0]) : fechaArray[0];

  const n = (Number((hora.split(":"))[0]) + 5);
  const horaH = n < 10 ? ("0" + n) : n;

  return fechaArray[2] + "-" + mes + "-" + dia + "T" + horaH + ":" + hora.split(":")[1] + ":" + hora.split(":")[2] + "-05:00";
}

export const rangoValido = (fechaHoraInicio, fechaHoraFin) => {
  // fechaHoraInicio: 2024-06-04T10:30:00-05:00
  // fechaHoraFin: 2024-06-04T10:30:00-05:00

  const fechaInicio = fechaHoraInicio.split("T")[0];
  const fechaFin = fechaHoraFin.split("T")[0];

  if (fechaInicio == fechaFin) {  
    const horaInicio = fechaHoraInicio.split("T")[1];
    const horaFin = fechaHoraFin.split("T")[1];
    return ("07:00:00-05:00" <= horaInicio && horaFin <= "22:00:00-05:00")
  }
  return false;
}

export const convertCitas = (response) => {
  console.log("RESPONSE CITAS: ", response)
  const citasProgramadas = response["Citas programadas"].map(cita => ({
    id: cita.idCita,
    title: `Cita ${cita.TipoTutoria} Programada`,
    start: cita.fechaHoraInicio,
    end: cita.fechaHoraFin,
    /* start: convertirFormato(cita.fechaHoraInicio),
    end: convertirFormato(cita.fechaHoraFin), */
    color: '#8667F1', // Morado
    display: 'auto',
    allDay: false,
    tipoTutoria: cita.TipoTutoria,
    modalidad: cita.TipoModalidad.charAt(0).toLowerCase() + cita.TipoModalidad.slice(1),
    ubicacion: cita.lugarLink,
    alumnos: Array.isArray(cita.Alumnos) ? cita.Alumnos.map(alumno => {return {
      nombres: alumno.nombres,
      primerApellido: alumno.primerApellido,
      segundoApellido: alumno.segundoApellido,
      email: alumno.email,
      avatar: alumno.imagen
    }}) : ((cita.Alumnos) ? [{
      nombres: cita.Alumnos.nombres,
      primerApellido: cita.Alumnos.primerApellido,
      segundoApellido: cita.Alumnos.segundoApellido,
      email: cita.Alumnos.email,
      avatar: cita.Alumnos.imagen
    }] : undefined),
    eliminado: false,
    tutor: cita.Tutor ? cita.Tutor  : undefined
  }));

/*   const citasCanceladas = response["Citas canceladas"].map(cita => ({
    id: cita.idCita,
    title: `Cita ${cita.TipoTutoria} Cancelada`,
    start: cita.fechaHoraInicio,
    end: cita.fechaHoraFin,
    color: '#FF0000', // Rojo
    display: 'auto',
    allDay: false,
    tipoTutoria: cita.TipoTutoria,
    modalidad: cita.TipoModalidad.charAt(0).toLowerCase() + cita.TipoModalidad.slice(1),
    ubicacion: cita.lugarLink,
    alumnos: Array.isArray(cita.Alumnos) ? cita.Alumnos.map(alumno => {return {
      nombres: alumno.nombres,
      primerApellido: alumno.primerApellido,
      segundoApellido: alumno.segundoApellido,
      email: alumno.email,
      avatar: alumno.imagen
    }}) : ((cita.Alumnos) ? [{
      nombres: cita.Alumnos.nombres,
      primerApellido: cita.Alumnos.primerApellido,
      segundoApellido: cita.Alumnos.segundoApellido,
      email: cita.Alumnos.email,
      avatar: cita.Alumnos.imagen
    }] : undefined),
    eliminado: true,
    tutor: cita.Tutor ? (cita.Tutor.nombres + " " + cita.Tutor.primerApellido) : undefined
  })); */
  
  const completadas = response['Citas completadas'];
  const citasCompletadas = completadas.map(cita => ({
    id: cita.idCita,
    //tittle: `Cita prueba Completada`,
    title: `Cita ${cita.TipoTutoria} Completada`,
    start: cita.fechaHoraInicio,
    end: cita.fechaHoraFin,
    color: '#22B14C', // Verde
    display: 'auto',
    allDay: false,
    tipoTutoria: cita.TipoTutoria,
    modalidad: cita.TipoModalidad.charAt(0).toLowerCase() + cita.TipoModalidad.slice(1),
    ubicacion: cita.lugarLink,
    alumnos: Array.isArray(cita.Alumnos) ? cita.Alumnos.map(alumno => {return {
      nombres: alumno.nombres,
      primerApellido: alumno.primerApellido,
      segundoApellido: alumno.segundoApellido,
      email: alumno.email,
      avatar: alumno.imagen
    }}) : ((cita.Alumnos) ? [{
      nombres: cita.Alumnos.nombres,
      primerApellido: cita.Alumnos.primerApellido,
      segundoApellido: cita.Alumnos.segundoApellido,
      email: cita.Alumnos.email,
      avatar: cita.Alumnos.imagen
    }] : undefined),
    eliminado: false,
    tutor: cita.Tutor ? cita.Tutor  : undefined
  }));
  

/*   console.log("CITAS: ", citasProgramadas, citasCanceladas,citasCompletadas)
  return [...citasProgramadas, ...citasCanceladas, ...citasCompletadas]; */
  console.log("CITAS: ", citasProgramadas, citasCompletadas)
  return [...citasProgramadas, ...citasCompletadas];
};


export const getEventObject = (date, startTime, endTime) => {
  return {
    allDay: false,
    color: "rgba(0, 193, 188, 100%)",
    display: "auto",
    id: Number(generateNumericUUID()),
    start: date + "T" + startTime,
    end: date + "T" + endTime,
    title: "Disponible"
  };
};

// Verifica si la frecuencia es "único"
export const esFrecuenciaUnica = (frecuencia) => frecuencia === "único";

// Obtiene la fecha límite en formato string
export const obtenerFechaLimiteString = (fechaLimite) => {
  const { day, month, year } = fechaLimite;
  return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};

// Genera una lista de días entre dos fechas
export const generarListaDeDias = (fechaInicio, fechaLimiteString) => {
  return getDaysArray(new Date(fechaInicio), new Date(fechaLimiteString)).map(v => v.toISOString().slice(0, 10));
};

// Crea una nueva disponibilidad basada en la fecha y las horas de inicio y fin
export const crearNuevaDisponibilidad = (fecha, horaInicio, horaFin) => {
  return {
    id: `new-${fecha}-${horaInicio}-${horaFin}`, // Asignar un ID único
    title: 'Disponible',
    start: `${fecha}T${horaInicio}`,
    end: `${fecha}T${horaFin}`,
    color: 'rgba(0, 193, 188, 100%)',
    display: 'auto',
    allDay: false
  };
};

export const crearNuevoEvento = (selectionInfo, esCita) => ({
  id: Number(generateNumericUUID()),
  title: esCita ? 'Cita' : 'Disponible',
  start: selectionInfo.startStr,
  end: selectionInfo.endStr,
  color: esCita ? '#8667F1' : '#00C1BC',
  allDay: selectionInfo.allDay,
  esNuevo: true,
});

// Extrae la fecha de una disponibilidad
export const extraerFechaDeDisponibilidad = (disponibilidad) => {
  return disponibilidad.start.split("T")[0];
};

// Extrae las horas de inicio y fin de una disponibilidad
export const extraerHorasDeDisponibilidad = (disponibilidad) => {
  return {
    horaInicio: disponibilidad.start.split("T")[1],
    horaFin: disponibilidad.end.split("T")[1]
  };
};

// Actualiza una disponibilidad existente si se solapa con un nuevo evento
export const actualizarDisponibilidadSiSeSolapan = (disponibilidad, horaInicioNueva, horaFinNueva) => {
  if (disponibilidad.id == 226) {
    console.log(disponibilidad);
    console.log(horaInicioNueva);
    console.log(horaFinNueva);
  }
  const { horaInicio, horaFin } = extraerHorasDeDisponibilidad(disponibilidad);
  if (!doTimesOverlap(horaInicio, horaFin, horaInicioNueva, horaFinNueva)) return false; // No se solapan
  const [minHora, maxHora] = minMax([horaInicio, horaFin, horaInicioNueva, horaFinNueva]);
  disponibilidad.start = `${extraerFechaDeDisponibilidad(disponibilidad)}T${minHora}`;
  disponibilidad.end = `${extraerFechaDeDisponibilidad(disponibilidad)}T${maxHora}`;
  return true; // Indica que se solapan y se ha actualizado
};

// Crea y agrega un nuevo evento a la lista de disponibilidades
export const crearYAgregarNuevoEvento = (nuevasDisponibilidades, fecha, horaInicio, horaFin) => {
  nuevasDisponibilidades.push(crearNuevaDisponibilidad(fecha, horaInicio, horaFin));
};

// Agrega un evento a la lista de disponibilidades si no se solapa con otros eventos
export const agregarEventoSiNoSeSolapa = (nuevasDisponibilidades, evento, fecha, horaInicio, horaFin) => {
  for (let j = 0; j < nuevasDisponibilidades.length; j++) {
    const disponibilidad = nuevasDisponibilidades[j];
    const fechaDisponibilidad = extraerFechaDeDisponibilidad(disponibilidad);
    
    // Verifica si las fechas coinciden
    if (fecha === fechaDisponibilidad) {
      // Verifica y actualiza la disponibilidad si se solapan
      if (actualizarDisponibilidadSiSeSolapan(disponibilidad, horaInicio, horaFin)) {
        console.log("DISP ACT: ", disponibilidad);
        return; // Termina la función si se ha actualizado la disponibilidad
      }
    }
  }
  // Si no se encontró solapamiento, crea y agrega un nuevo evento
  crearYAgregarNuevoEvento(nuevasDisponibilidades, fecha, horaInicio, horaFin);
};

// Procesa la frecuencia diaria
export const procesarFrecuenciaDiaria = (listaDeDias, evento, nuevasDisponibilidades) => {
  for (let i = 1; i < listaDeDias.length; i++) {
    agregarEventoSiNoSeSolapa(nuevasDisponibilidades, evento, listaDeDias[i], evento.start.split("T")[1], evento.end.split("T")[1]);
  }
};

// Procesa la frecuencia semanal
export const procesarFrecuenciaSemanal = (listaDeDias, evento, nuevasDisponibilidades) => {
  let contador = 0;
  for (let i = 1; i < listaDeDias.length; i++) {
    contador++;
    if (contador === 7) {
      agregarEventoSiNoSeSolapa(nuevasDisponibilidades, evento, listaDeDias[i], evento.start.split("T")[1], evento.end.split("T")[1]);
      contador = 0;
    }
  }
};

// Procesa la frecuencia mensual
export const procesarFrecuenciaMensual = (listaDeDias, evento, nuevasDisponibilidades) => {
  const diaDelEvento = Number(evento.start.split("T")[0].split("-")[2]);
  for (let i = 1; i < listaDeDias.length; i++) {
    const diaActual = Number(listaDeDias[i].split("-")[2]);
    if (diaActual === diaDelEvento) {
      agregarEventoSiNoSeSolapa(nuevasDisponibilidades, evento, listaDeDias[i], evento.start.split("T")[1], evento.end.split("T")[1]);
    }
  }
};

// Procesa la frecuencia de repetición (diaria, semanal, mensual)
export const procesarFrecuencia = (frecuencia, listaDeDias, evento, nuevasDisponibilidades) => {
  if (frecuencia === "diario") {
    procesarFrecuenciaDiaria(listaDeDias, evento, nuevasDisponibilidades);
  } else if (frecuencia === "semanal") {
    procesarFrecuenciaSemanal(listaDeDias, evento, nuevasDisponibilidades);
  } else if (frecuencia === "mensual") {
    procesarFrecuenciaMensual(listaDeDias, evento, nuevasDisponibilidades);
  }
};

// Verifica si la disponibilidad es una disponibilidad fusionada
export const esDisponibilidadFusionada = (originalDisponibilidad, selectedEvent) => {
  return originalDisponibilidad && originalDisponibilidad.id === selectedEvent.id;
};

// Maneja la restauración de la disponibilidad original si se elimina una disponibilidad fusionada
export const manejarDisponibilidadFusionada = (
  disponibilidades,
  originalDisponibilidad,
  selectedEvent,
  setDisponibilidades,
  setOriginalDisponibilidad
) => {
  const nuevasDisponibilidades = [
    ...eliminarDisponibilidadPorId(disponibilidades, selectedEvent.id),
    originalDisponibilidad
  ];
  setDisponibilidades(nuevasDisponibilidades);
  setOriginalDisponibilidad(null);
};

// Maneja la eliminación de una disponibilidad normal
export const manejarEliminacionDisponibilidad = (
  disponibilidades,
  selectedEvent,
  setDisponibilidades,
  setDeletedDisponibilidades
) => {
  const nuevasDisponibilidades = eliminarDisponibilidadPorId(disponibilidades, selectedEvent.id);
  setDisponibilidades(nuevasDisponibilidades);
  agregarDisponibilidadEliminada(selectedEvent.id, setDeletedDisponibilidades);
};


// Elimina una disponibilidad por su ID
export const eliminarDisponibilidadPorId = (disponibilidades, id) => {
  return disponibilidades.filter(event => event.id !== id);
};

// Agrega el ID de la disponibilidad eliminada a la lista de eliminadas
export const agregarDisponibilidadEliminada = (id, setDeletedDisponibilidades) => {
  setDeletedDisponibilidades(prev => [...prev, id]);
};

// Fusiona eventos (disponibilidades) si se solapan
export const fusionarDisponibilidadesSiSolapan = (newEvent, disponibilidades) => {
  let merged = false;
  let newStart = new Date(newEvent.start).getTime();
  let newEnd = new Date(newEvent.end).getTime();
  let mergedEventId = newEvent.id;
  let originalEvent = null;

  const nonOverlappingEvents = disponibilidades.filter(event => {
    //Entra cuando está en modo editar (auto)
    if (event.display !== 'background') {
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      console.log("Evento",event,"Hora Start - End del evento",eventStart,eventEnd);

      //Si es una cita cancelada no debería afectar la disponibilidad
      if (event.color === '#FF0000') { // color celeste de disponibilidad
        return true;
      }

      //
      if ((newStart <= eventEnd && newEnd >= eventStart) ||
          (eventStart <= newEnd && eventEnd >= newStart)) {
        newStart = Math.min(eventStart, newStart);
        newEnd = Math.max(eventEnd, newEnd);
        merged = true;
        mergedEventId = event.id;
        originalEvent = event;
        return false;
      }
    }
    return true;
  });

  if (merged) {
    newEvent.start = formatEventDate(new Date(newStart));
    newEvent.end = formatEventDate(new Date(newEnd));
    newEvent.id = mergedEventId;
  }

  return { nonOverlappingEvents, newEvent, originalEvent, merged };
};

// Crea un objeto de evento redimensionado a partir de resizeInfo
export const crearEventoRedimensionado = (resizeInfo) => ({
  id: Number(resizeInfo.event.id),
  title: resizeInfo.event.title,
  start: resizeInfo.event.startStr,
  end: resizeInfo.event.endStr,
  color: resizeInfo.event.backgroundColor,
  allDay: resizeInfo.event.allDay,
  esNuevo: true,
});

// Verifica si un evento cita está cancelado
export const esEventoCancelado = (evento) => evento.color === '#FF0000';

// Revertir el redimensionado si el evento (cita) está cancelado
export const revertirRedimensionadoSiCancelado = (resizeInfo, evento) => {
  if (esEventoCancelado(evento)) {
    resizeInfo.revert();
    return true;
  }
  return false;
};

// Verifica si un evento está dentro de la disponibilidad
export const esEventoDentroDeDisponibilidad = (evento, disponibilidades, citas) => {
  const newStartTimestamp = new Date(evento.start).getTime();
  const newEndTimestamp = new Date(evento.end).getTime();

  return disponibilidades.some(disponibilidad => {
    if (disponibilidad.display === 'background') {
      const disponibilidadStart = new Date(disponibilidad.start).getTime();
      const disponibilidadEnd = new Date(disponibilidad.end).getTime();

      if (newStartTimestamp >= disponibilidadStart && newEndTimestamp <= disponibilidadEnd) {
        const isOverlapping = citas.some(innerEvent => {
          if (innerEvent.id !== evento.id && innerEvent.display !== 'background') {
            const innerEventStart = new Date(innerEvent.start).getTime();
            const innerEventEnd = new Date(innerEvent.end).getTime();
            return (newStartTimestamp < innerEventEnd && newEndTimestamp > innerEventStart);
          }
          return false;
        });
        return !isOverlapping;
      }
    }
    return false;
  });
};

// Actualiza una cita en el backend y maneja la respuesta
export const actualizarCitaEnBackend = (resizedEvent, citas, setCitas, token, resizeInfo) => {
  const matchedEvent = citas.find(cita => cita.id === resizedEvent.id);

  resizedEvent.modalidad = matchedEvent.modalidad;
  resizedEvent.ubicacion = matchedEvent.ubicacion;

  const citaData = {
    fechaHoraInicio: resizedEvent.start,
    fechaHoraFin: resizedEvent.end,
    modalidad: matchedEvent.modalidad,
    lugar_link: matchedEvent.ubicacion
  };

  toast.promise(
    editarCita(resizedEvent.id, citaData, token),
    {
      loading: 'Actualizando cita...',
      success: 'Cita actualizada con éxito',
      error: 'Error al actualizar la cita',
    },
    {
      style: {
        minWidth: '250px',
      },
    }
  )
  .then((response) => {
    console.log('Cita actualizada:', response);
    setCitas(citas.map(e => (e.id === resizedEvent.id ? resizedEvent : e)));
  })
  .catch((error) => {
    console.error('Error al actualizar la cita:', error);
    resizeInfo.revert(); // Revertir cambios en caso de error
  });
};

// Actualiza una disponibilidad localmente
export const actualizarDisponibilidadLocal = (evento, disponibilidades, setDisponibilidades) => {
  setDisponibilidades(disponibilidades.map(event => (event.id === evento.id ? evento : event)));
};

// Crea un objeto de evento actualizado a partir de eventDropInfo
export const crearEventoActualizado = (eventDropInfo) => {
  const { event } = { ...eventDropInfo };
  return {
    id: Number(event.id),
    title: event.title,
    start: event.startStr,
    end: event.endStr,
    color: event.backgroundColor,
    allDay: event.allDay
  };
};

// Verifica si un evento se solapa con todos los tipos de citas existentes
export const esSolapadoConTodasCitas = (evento, citas) => {
  const newStartTimestamp = new Date(evento.start).getTime();
  const newEndTimestamp = new Date(evento.end).getTime();
  console.log("dep citas: ", citas);
  return citas.some(cita => {
    const citaStart = new Date(cita.start).getTime();
    const citaEnd = new Date(cita.end).getTime();
    return (newStartTimestamp < citaEnd && newEndTimestamp > citaStart);
  });
};

// Verifica si un evento se solapa con citas existentes
export const esSolapadoConCitas = (evento, citas) => {

  const newStartTimestamp = new Date(evento.start).getTime();
  const newEndTimestamp = new Date(evento.end).getTime();
/*   console.log("dep citas: ", citas); */
  return citas.some(cita => {
    if (cita.color === '#8667F1') {
      

      const citaStart = new Date(cita.start).getTime();
      const citaEnd = new Date(cita.end).getTime();

      const r = (newStartTimestamp < citaEnd && newEndTimestamp > citaStart);

      if (cita.id == 242) {
        console.log("CITA: ", cita);
        console.log("START CITA STAMP: ", citaStart);
        console.log("END CITA STAMP: ", citaEnd);
        console.log(r);
      }

      return r;
    }
    return false;
  });
};

// Verifica si un evento se solapa con citas existentes
export const esCitaSolapadaConCitas = (newStartTimestamp, newEndTimestamp, citas) => {

/*   console.log("dep citas: ", citas); */
  return citas.some(cita => {
    if (cita.color === '#8667F1') {
      

      const citaStart = new Date(cita.start).getTime();
      const citaEnd = new Date(cita.end).getTime();

      const r = (newStartTimestamp < citaEnd && newEndTimestamp > citaStart);

      if (cita.id == 242) {
        console.log("CITA: ", cita);
        console.log("START CITA STAMP: ", citaStart);
        console.log("END CITA STAMP: ", citaEnd);
        console.log(r);
      }

      return r;
    }
    return false;
  });
};

// Fusiona eventos si se solapan
export const fusionarEventosSiSolapan = (updatedEvent, disponibilidades) => {
  let merged = false;
  let newStartTimestamp = new Date(updatedEvent.start).getTime();
  let newEndTimestamp = new Date(updatedEvent.end).getTime();
  let mergedEventId = updatedEvent.id;

  const nonOverlappingEvents = disponibilidades.filter(e => {
    if (e.id !== updatedEvent.id) {
      const eventStart = new Date(e.start).getTime();
      const eventEnd = new Date(e.end).getTime();

      if ((newStartTimestamp <= eventEnd && newEndTimestamp >= eventStart) ||
          (eventStart <= newEndTimestamp && eventEnd >= newStartTimestamp)) {
        newStartTimestamp = Math.min(eventStart, newStartTimestamp);
        newEndTimestamp = Math.max(eventEnd, newEndTimestamp);
        merged = true;
        mergedEventId = e.id;
        return false;
      }
    }
    return true;
  });

  if (merged) {
    updatedEvent.start = formatEventDate(new Date(newStartTimestamp));
    updatedEvent.end = formatEventDate(new Date(newEndTimestamp));
    updatedEvent.id = mergedEventId;
  }

  return { nonOverlappingEvents, updatedEvent, merged };
};

// Actualiza las disponibilidades con el evento redimensionado
export const actualizarDisponibilidades = (
  updatedEvent,
  disponibilidades,
  setDisponibilidades,
  setDeletedDisponibilidades,
  oldEventId
) => {
  const { nonOverlappingEvents, updatedEvent: mergedEvent, merged } = fusionarEventosSiSolapan(updatedEvent, disponibilidades);

  if (merged) {
    const updatedNonOverlappingEvents = nonOverlappingEvents.filter(e => e.id !== oldEventId);
    setDeletedDisponibilidades(prev => [...prev, oldEventId]);
    setDisponibilidades([...updatedNonOverlappingEvents, mergedEvent]);
  } else {
    setDisponibilidades(disponibilidades.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  }
};

// Actualiza las citas con el evento actualizado
export const actualizarCitas = (updatedEvent, citas, setCitas) => {
  setCitas(citas.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
};

// Verifica si una selección está dentro de una disponibilidad
export const esDentroDeDisponibilidad = (start, end, disponibilidades, citas) => {
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  console.log("disponibilidades son: ", disponibilidades);
  console.log("start - end: ", startTimestamp, endTimestamp);
  
  return disponibilidades.some(event => {
    if (event.display === 'background') {
/*       console.log("EVENT: ", event); */
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      if (event.id == 555) {
        console.log(eventStart);
        console.log(eventEnd);
      }

/*       console.log("START EVENT STAMP: ", eventStart);
      console.log("END EVENT STAMP: ", eventEnd); */
      
      if (startTimestamp >= eventStart && endTimestamp <= eventEnd) {
        /* return !esSolapadoConCitas(event, citas); */
        return !esCitaSolapadaConCitas(startTimestamp, endTimestamp, citas);
      }
    }
    return false;
  });
};


export const quitarCitasDeAlumnosADisponibilidad = (disponibilidades, citasAlumnos) => {
  if (disponibilidades.length == 0) return;
  console.log("DISPPP: ", disponibilidades);
  console.log('CITAS ALUMNOS: ', citasAlumnos);
  for (let i=0; i<citasAlumnos.length; i++) {
    const citasAlumno = citasAlumnos[i];
    for (let j=0; j<citasAlumno.length; j++) {
      const cita = citasAlumno[j];
      console.log("----------------");
      console.log("CITA: ", cita);
      for (let k=0; k<disponibilidades.length; k++) {
        const disp = disponibilidades[k];
        if (doTimesOverlap(cita.start, cita.end, disp.start, disp.end)) {
          console.log("OVERLAP");
          console.log("DISP: ", disp);
          // Verificar si la disp se encuentra dentro de la cita, para eliminarla
          if (cita.start <= disp.start && disp.end <= cita.end) {
            disponibilidades[k].delete = true;
          }
          // Verificar si la cita se encuentra dentro de la disp, para partirla en 2
          else if (disp.start < cita.start && cita.end < disp.end) {
            const newDisp = JSON.parse(JSON.stringify(disponibilidades[k]));
            newDisp.start = cita.end;
            newDisp.id = Number(generateNumericUUID());
            disponibilidades[k].end = cita.start;
            disponibilidades.push(newDisp);
          }
          else if (disp.start <= cita.start && cita.end < disp.end) {
            disponibilidades[k].start = cita.end;
          } 
          else if (disp.start < cita.start && cita.end <= disp.end) {
            disponibilidades[k].end = cita.start;
          } 
          console.log("NEW DISP: ", disponibilidades[k]);
        }
      }
      disponibilidades = disponibilidades.filter((disp) => disp.delete == undefined)
      console.log("----------------");    
    }
  }
  console.log("NEW DISPPP: ", disponibilidades);
  return disponibilidades;
}

export function validarBloqueDisp(event) {
  console.log(event);
  const dayStart = (event.startStr.split("T"))[0];
  const dayEnd = (event.endStr.split("T"))[0];
  if (dayStart != dayEnd)
    return false;
  const timeStart = (event.startStr.split("T"))[1];
  const timeEnd = (event.endStr.split("T"))[1];
  if (timeStart < "07:00:00-05:00" || timeEnd > "22:00:00-05:00")
    return false;
  return true;

}