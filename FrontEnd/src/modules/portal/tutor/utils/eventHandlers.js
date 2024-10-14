// utils/eventHandlers.js
import toast from 'react-hot-toast';
import { editarCita, fetchDisponibilidades } from '../service/citasService';
import { generateNumericUUID, getEventObject, formatEventDate, doTimesOverlap, minMax, getDaysArray } from './calendarUtils';

export const handleSelect = (
  selectionInfo,
  gestionarCitas,
  citas,
  setCitas,
  disponibilidades,
  setDisponibilidades,
  calendarRef,
  setSelectedEventId,
  setSelectedEvent,
  setFechaLimite,
  parseDate,
  setFrecuencia,
  onOpenChange,
  setButtonPosition,
  setShowButton,
  setIsPopOpen,
  setOriginalDisponibilidad,
  setIsMounted
) => {
  const newEvent = {
    id: Number(generateNumericUUID()),
    title: gestionarCitas ? 'Cita' : 'Disponible',
    start: selectionInfo.startStr,
    end: selectionInfo.endStr,
    color: gestionarCitas ? '#8667F1' : '#00C1BC', // primero morado, segundo aqua
    allDay: selectionInfo.allDay
  };

  if (gestionarCitas) {
    setCitas([...citas, newEvent]);

    console.log("nuevo evento cita: ", newEvent);
     // Formatear la fecha, hora de inicio y fin
     const formattedDate = new Date(newEvent.start).toLocaleDateString();
    const formattedStartTime = new Date(newEvent.start).toLocaleTimeString();
    const formattedEndTime = new Date(newEvent.end).toLocaleTimeString();

    console.log("end time formatted: ", formattedEndTime);
    
    // Establecer el evento seleccionado con la fecha y horas formateadas
    setSelectedEvent({
        id: newEvent.id,
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
    });

    //console.log("matched ele: ", matchedElement);

    // Capturar la posición del cursor
    const cursorX = selectionInfo?.jsEvent?.clientX - 350;
    const cursorY = selectionInfo?.jsEvent?.clientY + 100;

    // Establecer la posición del botón y mostrarlo
    setButtonPosition({ x: cursorX, y: cursorY });
    setShowButton(true);
    setIsPopOpen(true);
    setIsMounted(true);
  } else {
    let merged = false;
    let newStart = new Date(newEvent.start).getTime();
    let newEnd = new Date(newEvent.end).getTime();
    let mergedEventId = newEvent.id;
    let originalEvent = null; // Para almacenar la disponibilidad original

    const nonOverlappingEvents = disponibilidades.filter(event => {
      if (event.display !== 'background') {
        const eventStart = new Date(event.start).getTime();
        const eventEnd = new Date(event.end).getTime();

        // Permitir solapamiento si el evento tiene color rojo (cancelado)
        if (event.color === '#FF0000') {
          return true;
        }

        if ((newStart <= eventEnd && newEnd >= eventStart) ||
            (eventStart <= newEnd && eventEnd >= newStart)) {
          newStart = Math.min(eventStart, newStart);
          newEnd = Math.max(eventEnd, newEnd);
          merged = true;
          mergedEventId = event.id;
          originalEvent = event; // Almacenar la disponibilidad original
          return false;
        }
      }
      return true;
    });

    if (merged) {
      newEvent.start = formatEventDate(new Date(newStart));
      newEvent.end = formatEventDate(new Date(newEnd));
      newEvent.id = mergedEventId;
      setOriginalDisponibilidad(originalEvent); // Almacenar la disponibilidad original en el estado
      setDisponibilidades([...nonOverlappingEvents, newEvent]);
    } else {
      setDisponibilidades([...disponibilidades, newEvent]);
    }

    // Logica de frecuencia
    const eventDateString = (newEvent.end.split("T"))[0];
    setFechaLimite(parseDate(eventDateString));
    onOpenChange(true);
    setFrecuencia(new Set(["único"]));
  }

  if (calendarRef.current) {
    calendarRef.current.getApi().unselect();
  }

  setSelectedEvent(newEvent);
  setSelectedEventId(Number(newEvent.id));
};




export const handleEventDrop = (
  eventDropInfo,
  gestionarCitas,
  citas,
  setCitas,
  disponibilidades,
  setDisponibilidades,
  setDeletedDisponibilidades
) => {
  const { event } = { ...eventDropInfo };
  const newStart = event.startStr;
  const newEnd = event.endStr;
  const updatedEvent = {
    id: Number(event.id),
    title: event.title,
    start: newStart,
    end: newEnd,
    color: event.backgroundColor,
    allDay: event.allDay
  };

  if (!gestionarCitas) {
    let merged = false;
    let newStartTimestamp = new Date(updatedEvent.start).getTime();
    let newEndTimestamp = new Date(updatedEvent.end).getTime();
    let oldEventId = updatedEvent.id;
    let mergedEventId = updatedEvent.id;

    // Validar que el evento no se cruce con citas programadas
    const isOverlappingWithCitas = citas.some(cita => {
      if (cita.color === '#8667F1') {
        const citaStart = new Date(cita.start).getTime();
        const citaEnd = new Date(cita.end).getTime();
        return (newStartTimestamp < citaEnd && newEndTimestamp > citaStart);
      }
      return false;
    });

    if (isOverlappingWithCitas) {
      eventDropInfo.revert();
      return;
    }

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
      const updatedNonOverlappingEvents = nonOverlappingEvents.filter(e => e.id != oldEventId);
      setDeletedDisponibilidades(prev => [...prev, oldEventId]);
      setDisponibilidades([...updatedNonOverlappingEvents, updatedEvent]);
    } else {
      setDisponibilidades(disponibilidades.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
    }
  } else {
    const isWithinDisponibilidad = disponibilidades.some(disponibilidad => {
      if (disponibilidad.display === 'background') {
        const disponibilidadStart = new Date(disponibilidad.start).getTime();
        const disponibilidadEnd = new Date(disponibilidad.end).getTime();
        const newStartTimestamp = new Date(updatedEvent.start).getTime();
        const newEndTimestamp = new Date(updatedEvent.end).getTime();

        if (newStartTimestamp >= disponibilidadStart && newEndTimestamp <= disponibilidadEnd) {
          const isOverlapping = citas.some(innerEvent => {
            if (innerEvent.id !== updatedEvent.id && innerEvent.display !== 'background') {
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

    if (!isWithinDisponibilidad) {
      eventDropInfo.revert();
      return;
    }

    setCitas(citas.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  }
};

const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

export const convertirFormatoFecha = (str) => {
  // 2024-06-12T16:00:00.000Z
  const [fecha, hora] = str.split("T");
  const horaContent = (hora.split(".000Z"))[0];
  const [h, m, s] = (horaContent.split(":"))
  const hUpdate = (String(Number(h) - 5));
  const hUpdate_ = Number(hUpdate) < 10 ? ("0" + hUpdate) : hUpdate;
  return fecha + "T" + hUpdate_ + ":" + m + ":" + s + "-05:00"; 

  // 2024-06-12T11:00:00-05:00
}

export const findMatchingEventFormat = (event, citas) => {
  const eventS = (event.startStr.split("-05:00"))[0]
  const eventE = (event.endStr.split("-05:00"))[0]

  console.log("EVENT: ", eventS, eventE);

  return citas.find((cita) => {
    const citaS = (cita.start.split(".000Z"))[0]
    const citaE = (cita.end.split(".000Z"))[0]

    console.log("CITA: ", convertirFormatoFecha(cita.start), convertirFormatoFecha(cita.end));

    return convertirFormatoFecha(cita.start) == event.startStr &&
      convertirFormatoFecha(cita.end) == event.endStr;
  })
}


export const findMatchingEvent = (event, citas) => {
  console.log("CITAS: ", citas);
  console.log("EVENT: ", event);
  return citas.find(
    cita => cita.start === event.startStr && cita.end === event.endStr
  );
}

export const formatEventDetails = (event) => {
  const formattedDate = new Date(event.start).toLocaleDateString();
  const formattedStartTime = (event.start.split("T")[1]).split("-")[0];
  const formattedEndTime = (event.end.split("T")[1]).split("-")[0];
  const modalidad = event.modalidad || "Modalidad no definida";

  return {
    id: event.id,
/*     date: formattedDate,
    start: formattedStartTime,
    end: formattedEndTime, */
    start: event.start,
    end: event.end,
    modalidad: modalidad,
    ubicacion: event.ubicacion,
    eliminado: event.color === "#FF0000",
    alumnos: event.alumnos,
    tipoTutoria: event.tipoTutoria,
    tutor: event.tutor
  };
};

// Uso de la función handleEventClick con los parámetros correctos
export const handleEventClick = (
  clickInfo,
  editable,
  gestionarCitas,
  disponibilidades,
  setSelectedEventId,
  setSelectedEvent,
  setFechaLimite,
  parseDate,
  setFrecuencia,
  onOpenChange,
  setIsPopOpen,
  cambiarVisualizar,
  citas,
  visualizar
) => {
  // editar disponibilidad: editable = true, visualizar: false
  // visualizacion de citas: editable = false, visualizar: true
  if (!editable && !visualizar) { // false y true = false
    clickInfo.jsEvent.preventDefault();
    return;
  }

  console.log("visualizar: ", visualizar);

  console.log("evento sel1: ", clickInfo.event);

  setSelectedEventId(Number(clickInfo.event.id));
  const event = clickInfo.event;

  if (editable || visualizar) {
    if (!gestionarCitas && !visualizar) {
      const event = disponibilidades.find((e) => e.id === Number(clickInfo.event.id));
      const eventDateString = (event.end.split("T"))[0];
      setFechaLimite(parseDate(eventDateString));
      setFrecuencia(new Set(["único"]));
      onOpenChange(true);
      return;
    }

    // Buscar el evento formateado en el arreglo de citas
    const matchedEvent = citas.find(cita =>
      cita.start === event.startStr && cita.end === event.endStr
    );
    console.log("MATCHED EVENT: ", matchedEvent);

    if (matchedEvent) {
      const formattedDate = new Date(matchedEvent.start).toLocaleDateString();
/*       const formattedStartTime = convertTo24HourFormat(new Date(matchedEvent.start).toLocaleTimeString());
      const formattedEndTime = convertTo24HourFormat(new Date(matchedEvent.end).toLocaleTimeString()); */
      const modalidad = matchedEvent.modalidad || "Modalidad no definida";

      const formattedStartTime = (matchedEvent.start.split("T")[1]).split("-")[0]
      const formattedEndTime = (matchedEvent.end.split("T")[1]).split("-")[0]

      console.log("formattedDate: ", formattedDate)
      console.log("formattedStartTime: ", formattedStartTime)
      console.log("formattedEndTime: ", formattedEndTime)


      cambiarVisualizar();
      setIsPopOpen(true);

      // Establecer el evento seleccionado con la fecha y horas formateadas
      setSelectedEvent({
        id: matchedEvent.id,
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        modalidad: modalidad,
        ubicacion: matchedEvent.ubicacion,
        eliminado: matchedEvent.color === "#FF0000" ? true : false,
        alumnos: matchedEvent.alumnos,
        tipoTutoria: matchedEvent.tipoTutoria,
      });
    } else {
      console.error('Evento no encontrado en el arreglo de citas');
    }
  }
};

export const handleDeleteEvent = (
  gestionarCitas,
  citas,
  setCitas,
  disponibilidades,
  setDisponibilidades,
  setDeletedDisponibilidades,
  selectedEventId,
  onOpenChange,
  originalDisponibilidad,
  setOriginalDisponibilidad
) => {
  if (gestionarCitas) {
    setCitas(citas.filter(event => event.id !== selectedEventId));
  } else {
    if (originalDisponibilidad && originalDisponibilidad.id === selectedEventId) {
      // Restaurar la disponibilidad original si el evento fusionado se elimina
      setDisponibilidades(prevDisponibilidades => [
        ...prevDisponibilidades.filter(event => event.id !== selectedEventId), 
        originalDisponibilidad
      ]);
      setOriginalDisponibilidad(null);
    } else {
      setDisponibilidades(disponibilidades.filter(event => event.id !== selectedEventId));
      setDeletedDisponibilidades(prev => [...prev, selectedEventId]);
    }
  }

  onOpenChange(false);
};

export const handleEventChange = (
  changeInfo,
  events,
  setEvents
) => {
  const updatedEvent = {
    id: Number(changeInfo.event.id),
    title: changeInfo.event.title,
    start: changeInfo.event.startStr,
    end: changeInfo.event.endStr,
    color: changeInfo.event.backgroundColor,
    allDay: changeInfo.event.allDay
  };

  setEvents(events.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
};

//Para editar la cita
export const handleEventResize = (
  resizeInfo,
  gestionarCitas,
  citas,
  setCitas,
  disponibilidades,
  setDisponibilidades,
  token
) => {
  const resizedEvent = {
    id: Number(resizeInfo.event.id),
    title: resizeInfo.event.title,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr,
    color: resizeInfo.event.backgroundColor,
    allDay: resizeInfo.event.allDay
  };

  console.log("reiszed event: ", resizedEvent);

  if (resizedEvent.color === '#FF0000') {
    // No permitir resize si la cita está cancelada
    resizeInfo.revert();
    return;
  }

  if (gestionarCitas) {
    const isWithinDisponibilidad = disponibilidades.some(disponibilidad => {
      if (disponibilidad.display === 'background') {
        const disponibilidadStart = new Date(disponibilidad.start).getTime();
        const disponibilidadEnd = new Date(disponibilidad.end).getTime();
        const newStartTimestamp = new Date(resizedEvent.start).getTime();
        const newEndTimestamp = new Date(resizedEvent.end).getTime();

        if (newStartTimestamp >= disponibilidadStart && newEndTimestamp <= disponibilidadEnd) {
          const isOverlapping = citas.some(innerEvent => {
            if (innerEvent.id !== resizedEvent.id && innerEvent.display !== 'background') {
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

    if (!isWithinDisponibilidad) {
      resizeInfo.revert();
      return;
    }

    // Buscar el evento formateado en el arreglo de citas
    const matchedEvent = citas.find(cita => cita.id === resizedEvent.id);

    console.log("match: ", matchedEvent);

    // Agregar la modalidad y la ubicación al resizedEvent
    resizedEvent.modalidad = matchedEvent.modalidad;
    resizedEvent.ubicacion = matchedEvent.ubicacion;

    // Usar la solicitud de editar cita para actualizar la cita en el backend
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
  } else {
    // Validar para que no pueda hacer resize si está solapando a un evento cita programado (morado)
        const isOverlappingWithCitas = citas.some(cita => {
            if (cita.color === '#8667F1') {
                const citaStart = new Date(cita.start).getTime();
                const citaEnd = new Date(cita.end).getTime();
                const newStartTimestamp = new Date(resizedEvent.start).getTime();
                const newEndTimestamp = new Date(resizedEvent.end).getTime();

                return (newStartTimestamp < citaEnd && newEndTimestamp > citaStart);
            }
            return false;
        });

        if (isOverlappingWithCitas) {
            resizeInfo.revert();
            return;
        }

        setDisponibilidades(disponibilidades.map(event => (event.id === resizedEvent.id ? resizedEvent : event)));
  }
};

export const handleSave = async (
  fetchAPI,
  session,
  disponibilidades,
  deletedDisponibilidades,
  setBackupDisponibilidades,
  setDisponibilidades,
  backupDisponibilidades,
  setEditable,
  setGestionarCitas,
) => {
  const disponibilidadesData = disponibilidades.map(event => ({
    id: event.id,
    fechaHoraInicio: event.start,
    fechaHoraFin: event.end
  }));

  const payload = {
    disponibilidadesData,
    deletedDisponibilidades
  };

  const response = await fetchAPI({
    endpoint: '/disponibilidades/',
    method: 'POST',
    payload: payload,
    token: session.accessToken,
    successMessage: 'Disponibilidad guardada con éxito',
    errorMessage: 'Error al guardar la disponibilidad',
    showToast: false
  });

  if (response) {
    setBackupDisponibilidades([...disponibilidades]);
    setDisponibilidades(backupDisponibilidades.map(event => ({
      ...event,
      display: 'background'
    })));
    setEditable(false);
    setGestionarCitas(false);
    fetchDisponibilidades(session).then(data => setDisponibilidades(data));
  }
};

export const handleCancel = (
  setEditable,
  setGestionarCitas,
  setDisponibilidades,
  backupDisponibilidades,
  setCitas,
  backupCitas,
  calendarRef
) => {
  setEditable(false);
  setGestionarCitas(false);

  setDisponibilidades(backupDisponibilidades.map(event => ({
    ...event,
    display: 'background'
  })));

  /* setCitas(backupCitas.map(event => ({
    ...citas,
  }))); */

  if (calendarRef.current) {
    calendarRef.current.getApi().unselect();
  }
};

export const handleNuevaSesion = (setEditable, setGestionarCitas, setActiveComponentById) => {
  setEditable(true);
  setGestionarCitas(true);
  setActiveComponentById('tiposDeTutoria', `Selección de tipo de tutoría`);
};

export const handleCancelarNuevaSesion = (setEditable) => {
  setEditable(false);
};

// modo: visualizar citas (hace que las disponiblidades tengan display background y si le da click a un evento cita muestra popover),
// editar disponibilidades (hace que se oculten las citas y muestre las disponibilidades con display: auto y permite manipular cada evento de disponibilidad),
// registrar cita (muestra las disponibilidades con display background y permite crear nuevos eventos cita)

export const handleEditarDisponibilidad = (setEditable, disponibilidades, setDisponibilidades, setVisualizar, setBackupCitas, citas, setCitas) => {
  setEditable(true);
  setDisponibilidades(disponibilidades.map(event => ({
    ...event,
    display: 'auto'
  })));
  setVisualizar(false);
  //setBackupCitas([...citas]);
  //setCitas([]);
};

export const selectAllow = (selectInfo, gestionarCitas, disponibilidades, citas) => {
  if (gestionarCitas) {
    const { start, end } = selectInfo;
    return disponibilidades.some(event => {
      if (event.display === 'background') {
        const eventStart = new Date(event.start).getTime();
        const eventEnd = new Date(event.end).getTime();

        if (start.getTime() >= eventStart && end.getTime() <= eventEnd) {
          return !citas.some(innerEvent => {
            if (innerEvent.display !== 'background') {
              const innerEventStart = new Date(innerEvent.start).getTime();
              const innerEventEnd = new Date(innerEvent.end).getTime();

              // Permitir solapamiento si el evento tiene color rojo (cancelado)
              if (innerEvent.color === '#FF0000') {
                return false; // No bloquear la selección si el evento está cancelado
              }

              return (start.getTime() < innerEventEnd && end.getTime() > innerEventStart);
            }
            return false;
          });
        }
      }
      return false;
    });
  }
  return true;
};

export const setFrequency = (
  frecuencia,
  selectedEventId,
  fechaLimite,
  setDisponibilidades,
  disponibilidades,
  onOpenChange
) => {
  const [freq] = frecuencia;

  if (freq !== "único") {
    const event = disponibilidades.find((e) => e.id === selectedEventId);
    console.log(event);
    const eventDateString = (event.end.split("T"))[0];
    const eventTimeStartString = (event.start.split("T"))[1];
    const eventTimeEndString = (event.end.split("T"))[1];
    const { day, month, year } = { ...fechaLimite };
    const fechaLimiteString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    const daylist = getDaysArray(new Date(eventDateString), new Date(fechaLimiteString)).map(v => v.toISOString().slice(0, 10));

    const newDisponibilidades = JSON.parse(JSON.stringify(disponibilidades));

    // Formateo
    for (let i=0; i<newDisponibilidades.length; i++) {
      const disp = newDisponibilidades[i];
      const dispTimeStartString = ((disp.start.split("T"))[1]);
      const dispTimeEndString = ((disp.end.split("T"))[1]);
      if (dispTimeEndString < dispTimeStartString) {
        newDisponibilidades[i].end = (disp.end.split("T"))[0] + "T" + "22:00:00-05:00";
      }
    }

    const pushEventObject = (date) => {
      console.log("DATE: ", date);
      let colisiones = 0;
      const spliceIds = [];
      const colisionIndices = [];

      for (let j = 0; j < newDisponibilidades.length; j++) {
        const disp = newDisponibilidades[j];

        if (date == (disp.start.split("T"))[0]) {
          console.log("DISPONIBILIDAD: ", disp);
        
          const dispTimeStartString = ((disp.start.split("T"))[1]);
          const dispTimeEndString = ((disp.end.split("T"))[1]);
          console.log("DISPONIBILIDAD TIEMPOS: ", dispTimeStartString, dispTimeEndString);
          console.log("EVENTO TIEMPOS: ", eventTimeStartString, eventTimeEndString);
          if (doTimesOverlap(dispTimeStartString, dispTimeEndString, eventTimeStartString, eventTimeEndString)) {
            const [minTime, maxTime] = minMax([dispTimeStartString, dispTimeEndString, eventTimeStartString, eventTimeEndString]);
            newDisponibilidades[j].start = (disp.start.split("T"))[0] + "T" + minTime;
            newDisponibilidades[j].end = (disp.end.split("T"))[0] + "T" + maxTime;
            console.log("MERGE: ", newDisponibilidades[j]);
            colisiones++;
            colisionIndices.push(j);
          }
        }
      }
      console.log("COLISION INDICES: ", colisionIndices);
      for (let i = 0; i<colisionIndices.length; i++) {
        const j = colisionIndices[i];
        const disp = newDisponibilidades[j];

        for (let k = 0; k < newDisponibilidades.length; k++) {
          const disp_ = newDisponibilidades[k];

          if (k != j && date == (disp_.start.split("T"))[0]) {
            console.log("DISPONIBILIDAD: ", disp_);

            const dispTimeStartString = ((disp.start.split("T"))[1]);
            const dispTimeEndString = ((disp.end.split("T"))[1]);

            const dispTimeStartString_ = ((disp_.start.split("T"))[1]);
            const dispTimeEndString_ = ((disp_.end.split("T"))[1]);
  
            if (doTimesOverlap(dispTimeStartString, dispTimeEndString, dispTimeStartString_, dispTimeEndString_)) {
              const [minTime, maxTime] = minMax([dispTimeStartString, dispTimeEndString, dispTimeStartString_, dispTimeEndString_]);
              newDisponibilidades[j].start = (disp.start.split("T"))[0] + "T" + minTime;
              newDisponibilidades[j].end = (disp.end.split("T"))[0] + "T" + (maxTime);
              console.log("MERGE: ", newDisponibilidades[j]);
              const indexK = spliceIds.indexOf(newDisponibilidades[k].id);
              if (indexK == -1)
                spliceIds.push(newDisponibilidades[k].id);
            }
          }
        }
      }

      if (spliceIds.length == colisionIndices.length)
        spliceIds.pop();
      
      console.log("SPLICE IDS: ", spliceIds);
      for (let i=0; i<spliceIds.length; i++) {
        for (let j=0; j<newDisponibilidades.length; j++) {
          if (spliceIds[i] == newDisponibilidades[j].id) {
            newDisponibilidades.splice(j, 1);
            break;
          }
        }
      }

      console.log(newDisponibilidades);
      console.log("---------------------------------------");
      console.log("---------------------------------------");

      if (colisiones == 0)
        newDisponibilidades.push(getEventObject(date, eventTimeStartString, eventTimeEndString));
    };

    if (freq === "diario") {
      for (let i = 1; i < daylist.length; i++) {
        pushEventObject(daylist[i]);
      }
    } else if (freq === "semanal") {
      let contador = 0;
      for (let i = 1; i < daylist.length; i++) {
        contador++;
        if (contador === 7) {
          pushEventObject(daylist[i]);
          contador = 0;
        }
      }
    } else if (freq === "mensual") {
      for (let i = 1; i < daylist.length; i++) {
        const daylistDay = Number((daylist[i].split("-"))[2]);
        if (daylistDay === day) {
          pushEventObject(daylist[i]);
        }
      }
    }

    // Formateo
    for (let i=0; i<newDisponibilidades.length; i++) {
      const disp = newDisponibilidades[i];
      const dispTimeStartString = ((disp.start.split("T"))[1]);
      const dispTimeEndString = ((disp.end.split("T"))[1]);
      if (dispTimeEndString == "22:00:00-05:00") {
        newDisponibilidades[i].end = (disp.end.split("T"))[0] + "T" + "07:00:00-05:00";
      }
    }

    setDisponibilidades(newDisponibilidades);
  }

  onOpenChange(false);
};