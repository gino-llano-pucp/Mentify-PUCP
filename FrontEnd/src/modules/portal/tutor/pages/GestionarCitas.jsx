'use client'
import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useRef, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, useDisclosure } from '@nextui-org/react';
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import esLocale from '@fullcalendar/core/locales/es';
import styled from "@emotion/styled";
import Leyenda from '../components/Leyenda';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import {
  handleSelect,
  handleEventDrop,
  handleEventClick,
  handleDeleteEvent,
  handleEventChange,
  handleEventResize,
  handleSave,
  handleCancel,
  handleNuevaSesion,
  handleCancelarNuevaSesion,
  handleEditarDisponibilidad,
  selectAllow,
  setFrequency
} from '../utils/eventHandlers';
import RegistrarCitaPopover from '../components/CitaPopOver';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';
import { fetchDisponibilidades, listarCitasTutor } from '../service/citasService';
import { useStudentInfo } from '../states/StudentInfoContext';

const ConfigurarDisponibilidad = ({session}) => {
  const [events, setEvents] = useState([]);
  const { setActiveComponentById } = useActiveComponent();
  const [disponibilidades, setDisponibilidades] = useState([]); 
  const [backupDisponibilidades, setBackupDisponibilidades] = useState([]);
  const [deletedDisponibilidades, setDeletedDisponibilidades] = useState([]);
  const [citas, setCitas] = useState([]);
  const [backupCitas, setBackupCitas] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const calendarRef = useRef(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [editable, setEditable] = useState(true);
  const [gestionarCitas, setGestionarCitas] = useState(true);
  const [frecuencia, setFrecuencia] = useState(new Set(["único"]))
  const [fechaLimite, setFechaLimite] = useState(today(getLocalTimeZone()));
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const { selectedTutoringType } = useTutoringType();
  const [popOverMode, setPopOverMode] = useState("registrar");
  const { studentInfos } = useStudentInfo();
  const [isMounted, setIsMounted] = useState(true);
  const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0])

  const handleUnmount = () => {
    setIsMounted(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const citas = await listarCitasTutor(session.accessToken);
      if (citas) {
        setCitas(citas);
        setBackupCitas(citas);
      }

      const disponibilidades = await fetchDisponibilidades(session);
      setDisponibilidades(disponibilidades);
      setBackupDisponibilidades(disponibilidades);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("student: ", studentInfos);
}, [studentInfos])

  useEffect(() => {
    console.log("tipo tut: ", selectedTutoringType);
  }, [selectedTutoringType])

  useEffect(() => {
    console.log("selected event: ", selectedEvent);
  }, [selectedEvent])

  useEffect(() => {
    console.log("citas; ", citas)
  }, [citas])

  useEffect(() => {
    if (popOverMode !== 'visualizar') return;
    
    console.log("eve seleccionado: ", selectedEvent);

    // Buscar el elemento en el DOM que coincida con la fecha del evento seleccionado
    const events = document.querySelectorAll('.fc-event');
    let matchedElement = null;

    events.forEach(event => {
      const timeElement = event.querySelector('.fc-event-time');
      const eventTime = timeElement ? timeElement.textContent.trim() : '';
      const [eventStartTime, eventEndTime] = eventTime.split(' - ');
      
      if (selectedEvent.startTime.includes(eventStartTime) && selectedEvent.endTime.includes(eventEndTime)) {
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

  useEffect(() => {
    console.log("pop over mode: ", popOverMode);
  }, [popOverMode])

  const cambiarVisualizar = () => {
    setPopOverMode('visualizar');
  }

  const handleEventSelect = (selectionInfo) => handleSelect(
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
    setPopOverMode,
    setIsMounted
  );

  const handleEventDropEvent = (eventDropInfo) => handleEventDrop(
    eventDropInfo,
    gestionarCitas,
    citas,
    setCitas,
    disponibilidades,
    setDisponibilidades,
    setDeletedDisponibilidades
  );

  const handleEventClickEvent = (clickInfo) => {
    handleEventClick(
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
      () => setPopOverMode('visualizar'),
      citas,
      setIsMounted
    );
    setIsMounted(true);
  };

  const handleDeleteEventEvent = () => handleDeleteEvent(
    gestionarCitas,
    citas,
    setCitas,
    disponibilidades,
    setDisponibilidades,
    setDeletedDisponibilidades,
    selectedEventId,
    onOpenChange
  );

  const handleEventChangeEvent = (changeInfo) => handleEventChange(
    changeInfo,
    events,
    setEvents
  );

  const handleEventResizeEvent = (resizeInfo) => handleEventResize(
    resizeInfo,
    gestionarCitas,
    citas,
    setCitas,
    disponibilidades,
    setDisponibilidades,
    session?.accessToken
  );

  const handleSaveEvents = () => {
    setActiveComponentById('citasTutor', `Citas`);
  }

  const handleCancelEvents = () => handleCancel(
    setEditable,
    setGestionarCitas,
    setDisponibilidades,
    backupDisponibilidades,
    setCitas,
    backupCitas,
    calendarRef
  );

  const handleNuevaSesionEvent = () => handleNuevaSesion(
    setEditable,
    setGestionarCitas,
    setActiveComponentById
  );

  const handleCancelarNuevaSesionEvent = () => handleCancelarNuevaSesion(
    setEditable
  );

  const handleEditarDisponibilidadEvent = () => handleEditarDisponibilidad(
    setEditable,
    disponibilidades,
    setDisponibilidades
  );

  const selectAllowEvent = (selectInfo) => selectAllow(
    selectInfo,
    gestionarCitas,
    disponibilidades,
    citas
  );

  const setFrequencyEvent = () => setFrequency(
    frecuencia,
    selectedEventId,
    fechaLimite,
    setDisponibilidades,
    disponibilidades,
    onOpenChange
  );

  const StyleWrapper = styled.div`
    .fc .fc-header-toolbar {
      .fc-today-button {
        background-color: white;
        color: black;
      }
      .fc-button-group {
        button {
          background-color: white;
          color: black;
        }
        .fc-button-active {
          background-color: black;
          color: white;
        }
      }
    }
  `;

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex flex-row items-center justify-between gap-2'>
        <Leyenda />
        <div className='flex flex-row gap-[16px]'>
          <Button onClick={handleSaveEvents} className='bg-[#008000] text-white'>
            Terminar
          </Button>
        </div>
      </div>
      <div className='h-full'>
        <StyleWrapper>
          <FullCalendar
            slotMinTime={"07:00:00"}
            slotMaxTime={"22:00:00"}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              omitZeroMinute: true,
              meridiem: 'short'
            }}
            allDaySlot={false}
            locale={esLocale}
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="75vh"
            contentHeight="70vh"
            editable={editable}
            eventStartEditable={editable}
            eventResizableFromStart={editable}
            eventDurationEditable={editable}
            events={[...disponibilidades, ...citas]}
            eventClick={handleEventClickEvent}
            selectable={editable}
            selectMirror={true}
            select={handleEventSelect}
            eventResize={handleEventResizeEvent}
            eventDrop={handleEventDropEvent}
            selectAllow={selectAllowEvent}
          />
        </StyleWrapper>
      </div>
      {isMounted && 
        <RegistrarCitaPopover 
          session={session}
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
        />
      }
{/*       {selectedEvent && (
        <div>
          <p>Fecha: {selectedEvent.date}</p>
          <p>Hora de inicio: {selectedEvent.startTime}</p>
          <p>Hora de fin: {selectedEvent.endTime}</p>
        </div>
      )} */}
    </div>
  );
};

export default ConfigurarDisponibilidad;