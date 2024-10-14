'use client'
import React, { useEffect, useRef, useState } from 'react';
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import {
  handleNuevaSesion,
  findMatchingEvent,
  formatEventDetails
} from '../utils/eventHandlers';
import RegistrarCitaPopover from '../components/CitaPopOver';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';
import { fetchDisponibilidades, listarCitasTutor, listarCitasAlumnoId } from '../service/citasService';
import { useStudentInfo } from '../states/StudentInfoContext';
import { enviarDisponibilidades } from '../service/disponibilidadService';
import { actualizarCitaEnBackend, actualizarDisponibilidadLocal, actualizarDisponibilidades, crearEventoActualizado, crearEventoRedimensionado, crearNuevoEvento, doTimesOverlap, esDentroDeDisponibilidad, esDisponibilidadFusionada, esEventoDentroDeDisponibilidad, esFrecuenciaUnica, esSolapadoConCitas, esSolapadoConTodasCitas, fusionarDisponibilidadesSiSolapan, fusionarEventosSiSolapan, generarListaDeDias, getDaysArray, manejarDisponibilidadFusionada, manejarEliminacionDisponibilidad, minMax, obtenerFechaLimiteString, procesarFrecuencia, revertirRedimensionadoSiCancelado, validarSolapamientoConCitas, quitarCitasDeAlumnosADisponibilidad, validarBloqueDisp } from '../utils/calendarUtils';
import ModalEdicionDisponibilidad from '@/modules/core/components/ModalEdicionDisponibilidad';
import CalendarActionToolbar from '@/modules/core/components/CalendarActionToolbar';
import { useMode } from '../states/CalendarModeContext';
import FullCalendarEstilizado from '@/modules/core/components/FullCalendarEstilizado';
import { useDisclosure } from '@nextui-org/react';

const CalendarioTutor = ({session}) => {
  const { setActiveComponentById } = useActiveComponent();
  const [disponibilidades, setDisponibilidades] = useState([]); 
  const [backupDisponibilidades, setBackupDisponibilidades] = useState([]);
  const [deletedDisponibilidades, setDeletedDisponibilidades] = useState([]);
  const [citas, setCitas] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const { studentInfos } = useStudentInfo();
  const [isMounted, setIsMounted] = useState(true);
  const { mode, setMode, setViewMode } = useMode();

  const handleUnmount = () => {
    setIsMounted(false);
  };
  
  /* Frecuencia de un bloque de disponibilidad */
  const frecuencias = [
    {key: "único", value: "Único"},
    {key: "diario", value: "Diario"},
    {key: "semanal", value: "Semanal"},
    {key: "mensual", value: "Mensual"}
  ]
  const [frecuencia, setFrecuencia] = useState(new Set(["único"]))
  const [fechaLimite, setFechaLimite] = useState(today(getLocalTimeZone()));
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const { selectedTutoringType } = useTutoringType();
  const [popOverMode, setPopOverMode] = useState("visualizar");
  const [originalDisponibilidad, setOriginalDisponibilidad] = useState(null);
  const [viewType, setViewType] = useState('');
  const [ revisarCitasAlumnos, setRevisarCitasAlumnos ] = useState(false);
  const [ guardarDisp, setGuardarDisp ] = useState(false);

  async function listarCitasAlumnos(disponibilidades) {
    const citasAlumnos = [];
    for (let i=0; i<studentInfos.length; i++) {
        const citasAlumno = await listarCitasAlumnoId(session.accessToken, studentInfos[i].idAlumno);
        citasAlumnos.push(citasAlumno);
    }
    const c = JSON.parse(JSON.stringify(disponibilidades));
    const disp = quitarCitasDeAlumnosADisponibilidad(c, citasAlumnos); 
    if (disp && disp.length > 0) {
      setDisponibilidades(disp);
      setBackupDisponibilidades(disp);
      setRevisarCitasAlumnos(true);
    }
  }

  useEffect(() => {

    const fetchData = async () => {

      if (session) {
        const citas = await listarCitasTutor(session.accessToken);
        if (citas) {
          setCitas(citas)
        }
        const disponibilidades = await fetchDisponibilidades(session);
        if (disponibilidades) {
/*           setDisponibilidades(disponibilidades);
          setBackupDisponibilidades(disponibilidades); */
          if (mode === "registrarCita" && !revisarCitasAlumnos) {
            listarCitasAlumnos(disponibilidades);
          }
          else
            setDisponibilidades(disponibilidades);
            setBackupDisponibilidades(disponibilidades);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("info estudiantes: ", studentInfos);
  }, [studentInfos])

  useEffect(() => {
    console.log("citas: ", citas);
  }, [citas])

  useEffect(() => {
    console.log("disp: ", disponibilidades);
  }, [disponibilidades])

  useEffect(() => {
    console.log("eve seleccionado: ", selectedEvent);

    if (popOverMode !== 'visualizar') return;

    if (mode === 'editarDisponibilidad') return;

    // Buscar el elemento en el DOM que coincida con la fecha del evento seleccionado
    const events = document.querySelectorAll('.fc-event');
    let matchedElement = null;

    events.forEach(event => {
      const timeElement = event.querySelector('.fc-event-time');
      const eventTime = timeElement ? timeElement.textContent.trim() : '';
      const [eventStartTime, eventEndTime] = eventTime.split(' - ');
      
      if (selectedEvent.start.includes(eventStartTime) && selectedEvent.end.includes(eventEndTime)) {
        matchedElement = event.closest('.fc-timegrid-event-harness');
      }
    });

    if (matchedElement) {
        const rect = matchedElement.getBoundingClientRect();
        const cursorX = rect.left + window.scrollX - 350;
        const cursorY = rect.top + window.scrollY - 150;
        console.log("si entra");
        // Establecer la posición del botón y mostrarlo
        setButtonPosition({ x: cursorX, y: cursorY });
        setShowButton(true);
        setIsPopOpen(true);
      }
  }, [selectedEvent])


  // Maneja la lógica específica para la creación de citas
  const handleCrearCita = (selectionInfo) => {
    const newEvent = crearNuevoEvento(selectionInfo, true);
    console.log("NEW EVENT: ", newEvent);
    setCitas([...citas, newEvent]);

    const formattedDate = new Date(newEvent.start).toLocaleDateString();
    const formattedStartTime = new Date(newEvent.start).toLocaleTimeString();
    const formattedEndTime = new Date(newEvent.end).toLocaleTimeString();

    setSelectedEvent({
      ...newEvent,
      id: newEvent.id,
/*       date: formattedDate,
      start: formattedStartTime,
      end: formattedEndTime, */
      start: newEvent.start,
      end: newEvent.end,
      tipoTutoria: selectedTutoringType,
    });

    const cursorX = selectionInfo?.jsEvent?.clientX - 350;
    const cursorY = selectionInfo?.jsEvent?.clientY + 100;

    setButtonPosition({ x: cursorX, y: cursorY });
    setShowButton(true);
    setIsPopOpen(true);
    setIsMounted(true);

    resetearSeleccionCalendario(calendarRef);
    setPopOverMode('registrar');
  };

  // Maneja la lógica específica para la creación de disponibilidades
  const handleCrearDisponibilidad = (selectionInfo) => {
    const newEvent = crearNuevoEvento(selectionInfo, false);

    const { nonOverlappingEvents, newEvent: updatedEvent, originalEvent, merged } = fusionarDisponibilidadesSiSolapan(newEvent, disponibilidades);

    if (merged) {
      setOriginalDisponibilidad(originalEvent);
      setDisponibilidades([...nonOverlappingEvents, updatedEvent]);
    } else {
      setDisponibilidades([...disponibilidades, updatedEvent]);
    }

    const eventDateString = (updatedEvent.end.split("T"))[0];
    setFechaLimite(parseDate(eventDateString));
    setFrecuencia(new Set(["único"]));
    onOpenChange(true);

    resetearSeleccionCalendario(calendarRef);
    setSelectedEvent(newEvent);
    
  };

  // Resetea la selección en el calendario
  const resetearSeleccionCalendario = (calendarRef) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().unselect();
    }
  };

  // Maneja la lógica de drop de un evento disponibilidad en el calendario
  const handleDisponibilidadDrop = (eventDropInfo) => {
    console.log("e drop info: ", eventDropInfo);
    const updatedEvent = crearEventoActualizado(eventDropInfo);

    // Verificar si el evento que está siendo arrastrado es una cita
    const esCita = citas.some(cita => cita.id === Number(eventDropInfo.event.id));
    if (esCita) {
      eventDropInfo.revert();
      return;
    }

    if (esSolapadoConCitas(updatedEvent, citas)) {
      eventDropInfo.revert();
      return;
    }
    actualizarDisponibilidades(updatedEvent, disponibilidades, setDisponibilidades, setDeletedDisponibilidades, updatedEvent.id);
  }

  // Maneja la lógica de drop de un evento cita en el calendario
  const handleCitaDrop = (eventDropInfo) => {
    eventDropInfo.revert();
    return;

    /* const updatedEvent = crearEventoActualizado(eventDropInfo);
    console.log("evento drop: ", updatedEvent);

    if (!esEventoDentroDeDisponibilidad(updatedEvent, disponibilidades, citas)) {
      eventDropInfo.revert();
      return;
    }
    actualizarCitas(updatedEvent, citas, setCitas); */
  }

  const handleDisponibilidadEventClick = (clickInfo) => {
    const event = disponibilidades.find((e) => e.id === Number(clickInfo.event.id));
    if (!event) return;
    const eventDateString = (event?.end?.split("T"))[0];
    setFechaLimite(parseDate(eventDateString));
    setFrecuencia(new Set(["único"]));
    setSelectedEvent(event);
    onOpenChange(true);
  }

  const handleCitasEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const matchedEvent = findMatchingEvent(event, citas);
  
    if (matchedEvent) {
      const formattedEventDetails = formatEventDetails(matchedEvent);
      console.log("Detalle de cita formateado: ", formattedEventDetails);
      setPopOverMode('visualizar');
      setIsPopOpen(true);
      setSelectedEvent(formattedEventDetails);
    } else {
      console.error('Evento no encontrado en el arreglo de citas');
    }
  }

  // Maneja la eliminación de una disponibilidad
  const handleEliminarDisponibilidad = () => {
    if (esDisponibilidadFusionada(originalDisponibilidad, selectedEvent)) {
      manejarDisponibilidadFusionada(disponibilidades, originalDisponibilidad, selectedEvent, setDisponibilidades, setOriginalDisponibilidad);
    } else {
      manejarEliminacionDisponibilidad(disponibilidades, selectedEvent, setDisponibilidades, setDeletedDisponibilidades);
    }
    onOpenChange(false); // Cerrar modal
  }

  // Maneja la redimensión de duracion de un evento cita en el calendario
  const handleManejarRedimensionCita = (resizeInfo) => {
    const resizedEvent = crearEventoRedimensionado(resizeInfo);

    if (revertirRedimensionadoSiCancelado(resizeInfo, resizedEvent)) return;

    if (!esEventoDentroDeDisponibilidad(resizedEvent, disponibilidades, citas)) {
      resizeInfo.revert();
      return;
    }

    actualizarCitaEnBackend(resizedEvent, citas, setCitas, session?.accessToken, resizeInfo);
  }

  // Maneja la redimensión de duracion de un evento disponibilidad en el calendario
  const handleManejarRedimensionDisponibilidad = (resizeInfo) => {
    const resizedEvent = crearEventoRedimensionado(resizeInfo);
    if (esSolapadoConTodasCitas(resizedEvent, citas)) {
      resizeInfo.revert();
      return;
    }

    actualizarDisponibilidadLocal(resizedEvent, disponibilidades, setDisponibilidades);
  }

  const handleGuardarEdicionDisponibilidades = async () => {
    if (guardarDisp)
      return;
    setGuardarDisp(true);
    const disponibilidadesData = mapearDisponibilidades(disponibilidades);
    const response = await enviarDisponibilidades(disponibilidadesData, deletedDisponibilidades, session.accessToken);
    if (response) {
      setBackupDisponibilidades([...response.disponibilidades]);
      actualizarEstadoBackgroundDisponibilidades(response.disponibilidades, setDisponibilidades);
      visualizarCitasMode();
      setGuardarDisp(false);
    }
  }

  // Mapea las disponibilidades a un formato específico para el backend
  const mapearDisponibilidades = (disponibilidades) => {
    return disponibilidades.map(event => ({
      id: event.id,
      fechaHoraInicio: event.start,
      fechaHoraFin: event.end
    }));
  };

  // Actualiza el estado de las disponibilidades a display 'background'
  const actualizarEstadoBackgroundDisponibilidades = (disponibilidades, setDisponibilidades) => {
    const disponibilidadesActualizadas = disponibilidades.map(event => ({
      ...event,
      display: 'background'
    }));
    setDisponibilidades(disponibilidadesActualizadas);
  };

  // Cambia el modo a visualizar citas
  const visualizarCitasMode = () => {
    setMode('visualizarCitas');
  }

  const handleCancelarEditarDisponibilidad = () => {
    setMode('visualizarCitas');
    restaurarDisponibilidades(backupDisponibilidades, setDisponibilidades);
    unselectCalendar(calendarRef);
  }

  // Restaura las disponibilidades desde una copia de seguridad y establece el display en 'background'
  const restaurarDisponibilidades = (backupDisponibilidades, setDisponibilidades) => {
    const updatedDisponibilidades = backupDisponibilidades.map(event => ({
      ...event,
      display: 'background'
    }));
    setDisponibilidades(updatedDisponibilidades);
  };

  // Deselecciona cualquier evento creado en el calendario
  const unselectCalendar = (calendarRef) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().unselect();
    }
  };


  const handleNuevaSesionEvent = () => handleNuevaSesion(
    setEditable,
    setGestionarCitas,
    setActiveComponentById
  );

  const handleEditarDisponibilidadClick = () => {
    setMode('editarDisponibilidad');
    setDisponibilidades(disponibilidades.map(event => ({
      ...event,
      display: 'auto'
    })));
  }

  // Determina si se permite la selección (creacion) de una cita en los bloques del calendario
  const handleSelectAllow = (selectInfo) => {
    console.log("SELECTION INFO: ", selectInfo);
    if (mode !== 'registrarCita') {
      if (mode == "editarDisponibilidad")
        return validarBloqueDisp(selectInfo);
      return true;
    }
    const { start, end } = selectInfo;
    return esDentroDeDisponibilidad(start, end, disponibilidades, citas);
  };

  const manejarFrecuenciaDisponibilidad = () => {
    console.log("SELECTED EVENT: ", selectedEvent);
    const [freq] = frecuencia;

    if (esFrecuenciaUnica(freq)) {
      onOpenChange(false);
      return;
    };

    const eventoSeleccionado = disponibilidades.find((e) => e.id === selectedEvent.id);
    console.log("evento seleccionado freq: ", eventoSeleccionado);
    const fechaFinEvento = eventoSeleccionado.end.split("T")[0];
    const fechaLimiteString = obtenerFechaLimiteString(fechaLimite);
    const listaDeDias = generarListaDeDias(fechaFinEvento, fechaLimiteString);
    console.log("lista dias: ", listaDeDias);
    const nuevasDisponibilidades = [...disponibilidades];

    procesarFrecuencia(freq, listaDeDias, eventoSeleccionado, nuevasDisponibilidades);
    console.log("nuevas dispp: ", nuevasDisponibilidades);
    setDisponibilidades(JSON.parse(JSON.stringify(nuevasDisponibilidades)));
    onOpenChange(false);
  }

  const handleGuardarCitas = () => {
    setActiveComponentById('citasTutor', `Citas`);
    setMode('visualizarCitas');
    setViewMode('calendar');
  }

  return (
    <div className='flex flex-col justify-between gap-4'>
      <CalendarActionToolbar
        mode={mode}
        handleGuardarEdicionDisponibilidades={handleGuardarEdicionDisponibilidades}
        handleCancelarEditarDisponibilidad={handleCancelarEditarDisponibilidad}
        handleEditarDisponibilidadClick={handleEditarDisponibilidadClick}
        handleNuevaSesionEvent={() => setActiveComponentById('tiposDeTutoria', `Selección de tipo de tutoría`)}
        handleGuardarCitas={handleGuardarCitas}
      />
      <FullCalendarEstilizado
        calendarRef={calendarRef}
        mode={mode}
        disponibilidades={disponibilidades}
        citas={citas}
        handleCitasEventClick={handleCitasEventClick}
        handleDisponibilidadEventClick={handleDisponibilidadEventClick}
        handleCrearCita={handleCrearCita}
        handleCrearDisponibilidad={handleCrearDisponibilidad}
        handleManejarRedimensionCita={handleManejarRedimensionCita}
        handleManejarRedimensionDisponibilidad={handleManejarRedimensionDisponibilidad}
        handleCitaDrop={handleCitaDrop}
        handleDisponibilidadDrop={handleDisponibilidadDrop}
        handleSelectAllow={handleSelectAllow}
      />

      <ModalEdicionDisponibilidad
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        frecuencias={frecuencias}
        frecuencia={frecuencia}
        setFrecuencia={setFrecuencia}
        fechaLimite={fechaLimite}
        setFechaLimite={setFechaLimite}
        manejarFrecuenciaDisponibilidad={manejarFrecuenciaDisponibilidad}
        handleEliminarDisponibilidad={handleEliminarDisponibilidad}
      />

      {isMounted && 
        <RegistrarCitaPopover 
          session={session}
          showButton={showButton} 
          setCitas={setCitas} 
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent} 
          tipoTutoria={selectedEvent?.tipoTutoria} 
          setShowButton={setShowButton} 
          isOpen={isPopOpen} 
          setIsOpen={setIsPopOpen} 
          top={buttonPosition.y} 
          left={buttonPosition.x}
          popOverMode={popOverMode}
          setPopOverMode={setPopOverMode}
          handleUnmount={handleUnmount}
        />
      }
    </div>
  );
};

export default CalendarioTutor;