'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import {
  handleNuevaSesion,
  findMatchingEvent,
  formatEventDetails
} from '../../../tutor/utils/eventHandlers';
import RegistrarCitaPopover from '../../components/CitaPopOver';
import { useTutoringType } from '../../../coordinador/states/TutoringTypeContext';
import { listarCitasAlumno } from '../../../tutor/service/citasService';
import CalendarActionToolbar from '@/modules/core/components/CalendarActionToolbar';
import { useMode } from '../../../tutor/states/CalendarModeContext';
import FullCalendarEstilizado from '@/modules/core/components/FullCalendarEstilizado';
import { useTutor } from '@/modules/portal/coordinador/states/TutorContext';
import { esDentroDeDisponibilidad } from '@/modules/portal/tutor/utils/calendarUtils';
import { fetchDisponibilidadesTutor } from '../../services/citasService';
import { crearNuevoEvento } from '@/modules/portal/tutor/utils/calendarUtils';

const RegistrarCitaCalendario = ({session}) => {
  const { setActiveComponentById } = useActiveComponent();
  const [disponibilidades, setDisponibilidades] = useState([]); 
  const [citas, setCitas] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [gestionarCitas, setGestionarCitas] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const { mode, setMode } = useMode();
  const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0])
  const { tutor } = useTutor();

  const handleUnmount = () => {
    setIsMounted(false);
  };
  

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const { selectedTutoringType } = useTutoringType();
  const [popOverMode, setPopOverMode] = useState("visualizar");

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const citas = await listarCitasAlumno(session.accessToken);
        if (citas) {
          setCitas(citas)
        }
        const disponibilidades = await fetchDisponibilidadesTutor(session, tutor.idTutor);
        if (disponibilidades) {
          setDisponibilidades(disponibilidades);
        }
      }
    };

    fetchData();
    console.log("TUTOR: ", tutor);
  }, []);


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
    console.log("CREAR CITA");
    console.log("TUTOR: ", tutor);
    const newEvent = crearNuevoEvento(selectionInfo, true);

    setCitas([...citas, newEvent]);

/*     const formattedDate = new Date(newEvent.start).toLocaleDateString();
    const formattedStartTime = new Date(newEvent.start).toLocaleTimeString();
    const formattedEndTime = new Date(newEvent.end).toLocaleTimeString(); */

    setSelectedEvent({
      ...newEvent,
      id: newEvent.id,
/*       date: formattedDate,
      start: formattedStartTime,
      end: formattedEndTime, */
      start: newEvent.start,
      end: newEvent.end,
      tipoTutoria: selectedTutoringType,
      tutor: tutor
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

  // Resetea la selección en el calendario
  const resetearSeleccionCalendario = (calendarRef) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().unselect();
    }
  };


  // Maneja la lógica de drop de un evento cita en el calendario
  const handleCitaDrop = (eventDropInfo) => {
    eventDropInfo.revert();
    return;
  }

  const handleCitasEventClick = (clickInfo) => {
    if (popOverMode == "registrar")
      return;
    
    const event = clickInfo.event;
    const matchedEvent = findMatchingEvent(event, citas);
  
    if (matchedEvent) {
      const formattedEventDetails = formatEventDetails(matchedEvent);
      console.log("Detalle de cita formateado: ", formattedEventDetails);
      setPopOverMode('visualizar');
      setIsPopOpen(true);
      setSelectedEvent(formattedEventDetails);
      console.log(buttonPosition)
    } else {
      console.error('Evento no encontrado en el arreglo de citas');
    }
  }


  const handleNuevaSesionEvent = () => handleNuevaSesion(
    setEditable,
    setGestionarCitas,
    setActiveComponentById
  );


  // Determina si se permite la selección (creacion) de una cita en los bloques del calendario
  const handleSelectAllow = (selectInfo) => {
    if (mode !== 'registrarCita') return true;
    const { start, end } = selectInfo;
    const r = esDentroDeDisponibilidad(start, end, disponibilidades, citas);
    console.log(r);
    return r;
  };

  const handleGuardarCitas = () => {
    setMode('visualizarCitas');
    setActiveComponentById("citasAlumno", "Citas");
  }



  return (
    <div className='flex flex-col justify-between'>
      <CalendarActionToolbar
        mode={mode}
        handleNuevaSesionEvent={handleNuevaSesionEvent}
        handleGuardarCitas={handleGuardarCitas}
      />
      <FullCalendarEstilizado
        calendarRef={calendarRef}
        mode={mode}
        disponibilidades={disponibilidades}
        citas={citas}
        handleCitasEventClick={handleCitasEventClick}
        handleCrearCita={handleCrearCita}
        handleCitaDrop={handleCitaDrop}
        handleSelectAllow={handleSelectAllow}
      />

      {isPopOpen && 
        <RegistrarCitaPopover 
          session={session}
          citas={citas}
          showButton={showButton} 
          setCitas={setCitas} 
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent} 
          tipoTutoria={selectedTutoringType} 
          setShowButton={setShowButton} 
          isOpen={isPopOpen} 
          setIsOpen={setIsPopOpen} 
          top={buttonPosition.y} 
          left={buttonPosition.x}
          popOverMode={popOverMode}
          setPopOverMode={setPopOverMode}
          handleUnmount={handleUnmount}
          setSelectDate={setSelectDate}
          handleGuardarCitas={handleGuardarCitas}
        />
      }
      
    </div>
  );

}

export default RegistrarCitaCalendario;