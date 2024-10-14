'use client'
import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useRef, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import fetchAPI from '@/modules/core/services/apiService';
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import esLocale from '@fullcalendar/core/locales/es';
import GeneralDropdown from './GeneralDropdown';
import { DatePicker } from "@nextui-org/date-picker";
import styled from "@emotion/styled";
import { Pencil, CirclePlus } from 'lucide-react';
import Leyenda from './Leyenda';
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
import RegistrarCitaPopover from './CitaPopOver';
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
  const divCalendarRef = useRef(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [editable, setEditable] = useState(false);
  const [visualizar, setVisualizar] = useState(true);
  const [gestionarCitas, setGestionarCitas] = useState(false);
  const { studentInfos } = useStudentInfo();
  const [isMounted, setIsMounted] = useState(true);
  const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0])
  
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

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const citas = await listarCitasTutor(session.accessToken);
        if (citas) {
          setCitas(citas)
        }
        const disponibilidades = await fetchDisponibilidades(session);
        if (disponibilidades) {
          setDisponibilidades(disponibilidades);
          setBackupDisponibilidades(disponibilidades);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calendarNode = divCalendarRef.current;
    if (!calendarNode) return;
  
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const targetElement = mutation.target;
          if (targetElement.classList.contains('fc-timeGridWeek-view')) {
            console.log('Class fc-timeGridWeek-view changed');
            modifyColumnHeaders();
            modifySlotLabels();
          } else if (targetElement.classList.contains('fc-timeGridDay-view')) {
            modifyColumnHeaders();
            modifySlotLabelsDay();
          }
  
          // Detect the appearance of fc-day-sun
          if (targetElement.querySelector('.fc-col-header-cell.fc-day.fc-day-sun')) {
            console.log('Element with class fc-day-sun appeared');
            // Perform your desired action here
          }
  
          const buttonGroupNode = calendarNode.querySelector('.fc-button-group');
          if (buttonGroupNode) {
            const prevButton = buttonGroupNode.querySelector('.fc-prev-button');
            const nextButton = buttonGroupNode.querySelector('.fc-next-button');
  
            const handleButtonClick = (event) => {
              console.log(`${event.target.title} button clicked`);
              // Perform your desired action here
              modifyColumnHeaders();
            };
  
            if (prevButton) {
/*               console.log('Prev button found'); */
              prevButton.addEventListener('click', handleButtonClick);
            } else {
/*               console.log('Prev button not found'); */
            }
  
            if (nextButton) {
/*               console.log('Next button found'); */
              nextButton.addEventListener('click', handleButtonClick);
            } else {
/*               console.log('Next button not found'); */
            }
          } else {
            console.log('Button group not found');
          }
        }
      }
    });  

    observer.observe(calendarNode, {
      attributes: true,
      childList: true,
      subtree: true, // observa también los elementos hijos
      attributeFilter: ['class'],
    });    
  }, []);

  const meses = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  // Función para modificar la estructura de los encabezados de columna
  const modifyColumnHeaders = () => {
    // Verificar si existe el elemento fc-timeGridWeek-view
    if (document.querySelector('.fc-timeGridWeek-view')) {
    const headerCells = document.querySelectorAll('.fc-col-header-cell-cushion');
    const date = new Date();
    // Extraer el mes y el día
    const opciones = { month: 'short', day: '2-digit' };
    const fechaFormateada = date.toLocaleDateString('en-US', opciones);
    // Convertir el mes a número
    const mesEnTexto = fechaFormateada.split(' ')[0]; // "Jun"
    const dia = fechaFormateada.split(' ')[1]; // "02"
    const mesEnNumero = meses[mesEnTexto];
    const fechaFinal = `${parseInt(dia, 10)}/${mesEnNumero}`;
    //console.log("fecha hoy: ", fechaFinal);
      headerCells.forEach(cell => {
        const text = cell.innerText;
        const [day, date] = text.split(' ');
        const dayWithoutMonth = date.split('/')[0]; // Tomar solo el día y quitar la parte después del '/'
        const fullDate = date; // Fecha completa en el formato "día/mes"
        //console.log("full date: ", fullDate);
        cell.setAttribute('data-day', day.toUpperCase());
        cell.setAttribute('data-date', dayWithoutMonth);
        // Añadir la clase bg-blue-500 si es la fecha de hoy
        if (fechaFinal === fullDate) {
          //console.log("today - fulldate: ", fechaFinal, fullDate);
          cell.setAttribute('today', true);
        }
        else cell.setAttribute('today', false)
        cell.setAttribute('isDayView', false);
      });
    } else if (document.querySelector('.fc-timeGridDay-view')) {
      console.log("pero si entra?");
      const headerCell = document.querySelector('.fc-col-header-cell');
      const date = new Date();
      console.log("date: ", date);
      // Extraer el mes y el día
      const opciones = { month: 'short', day: '2-digit' };
      const fechaFormateada = date.toLocaleDateString('en-US', opciones);
      // Convertir el mes a número
      const mesEnTexto = fechaFormateada.split(' ')[0]; // "Jun"
      const dia = fechaFormateada.split(' ')[1]; // "02"
      const mesEnNumero = meses[mesEnTexto];
      const fechaFinal = `${parseInt(dia, 10)}/${mesEnNumero}`;
      console.log("fecha hoy: ", fechaFinal);
      const dateAttr = headerCell.getAttribute('data-date');
      const cellDate = new Date(dateAttr);
      console.log("cell date: ", cellDate);
      const cellCushion = headerCell.querySelector('.fc-col-header-cell-cushion');
      cellCushion.setAttribute('data-day', cellCushion.innerText);
      cellCushion.setAttribute('isDayView', true);
      /* headerCells.forEach(cell => {
        const dateAttr = cell.getAttribute('data-date');
        if (dateAttr) {
          const cellDate = new Date(dateAttr);
          console.log("cell date: ", cellDate);
          const opcionesCell = { weekday: 'short', day: 'numeric', month: 'numeric' };
          const fechaFormateadaCell = cellDate.toLocaleDateString('es-ES', opcionesCell);
          console.log("fecha formateada div: ", fechaFormateadaCell);
          // Extracting parts of the formatted date
          const dayAbbr = fechaFormateadaCell.split(',')[0]; // 'sáb.'
          const day = cellDate.getDate(); // 1
          const month = cellDate.getMonth() + 1; // 6
          const fullDate = `${day}/${month}`;
          console.log("full date: ", fullDate);

          const cellCushion = cell.querySelector('.fc-col-header-cell-cushion');
          cellCushion.innerText = `${dayAbbr} ${day}/${month}`;

          cellCushion.setAttribute('data-day', dayAbbr.toUpperCase());
          cellCushion.setAttribute('data-date', day);

          if (fechaFinal === fullDate) {
            //console.log("today - fulldate: ", fechaFinal, fullDate);
            cell.setAttribute('today', true);
          }
          else cell.setAttribute('today', false);
        }
      }); */
    }
  };

  // Función para ajustar el formato de las horas en los slots
  const modifySlotLabels = () => {
    const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
    slotLabels.forEach(label => {
      let text = label.innerText.trim();
/*       console.log("slot: ", text); */
      // Reemplazar "a. m." por "AM" y "p. m." por "PM"
      text = text.replace('a. m.', 'AM').replace('p. m.', 'PM');
      // Eliminar duplicación siguiendo la lógica dada
      let modifiedText = '';
      let detected = false;
      for (let i = 0; i < text.length; i++) {
        modifiedText += text[i];
        if (i > 0 && !isNaN(text[i]) && isNaN(text[i - 1])) {
          detected = true;
          break;
        }
      }
      if (!detected) {
        label.innerText = modifiedText.trim();
      } else label.innerText = modifiedText.slice(0, -1);
    });
  };

  const modifySlotLabelsDay = () => {
    const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
    slotLabels.forEach(label => {
      let text = label.innerText.trim();
      console.log("slot: ", text);
      // Extraer solo el primer formato de hora y eliminar el resto
      const match = text.match(/(\d{1,2}(:\d{2})?\s*[ap]\.?m\.?)/i);
      if (match) {
        // Obtener solo el primer match y formatear
        let formattedText = match[0].replace(/\./g, '').replace(/\s*a\s*m/i, ' AM').replace(/\s*p\s*m/i, ' PM');
        label.innerText = formattedText;
      }
    });
  };

  useEffect(() => {
    if (calendarRef.current) {
      modifyColumnHeaders();
      modifySlotLabels();
    }
  }, []);

  const handleViewDidMount = () => {
    modifyColumnHeaders();
    modifySlotLabels();
  };

  useEffect(() => {
    console.log("info estudiantes: ", studentInfos);
  }, [studentInfos])

  useEffect(() => {
    console.log("citas: ", citas);
  }, [citas])

  useEffect(() => {
    console.log("disp: ", disponibilidades);
  }, [disponibilidades])

  const cambiarVisualizar = () => {
    setPopOverMode('visualizar');
  }

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
    setOriginalDisponibilidad,
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

  const handleEventClickEvent = (clickInfo) => handleEventClick(
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
    cambiarVisualizar, // Asegúrate de definir esta función
    citas,
    visualizar // Asegúrate de que esta variable esté definida en el contexto del componente
  );

  const handleDeleteEventEvent = () => handleDeleteEvent(
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
    setDisponibilidades
  );

  const handleSaveEvents = () => {
    setVisualizar(true);
    handleSave(
      fetchAPI,
      session,
      disponibilidades,
      deletedDisponibilidades,
      setBackupDisponibilidades,
      setDisponibilidades,
      backupDisponibilidades,
      setEditable,
      setGestionarCitas,
    );
  };
  
  const handleCancelEvents = () => {
    setVisualizar(true);
    handleCancel(
      setEditable,
      setGestionarCitas,
      setDisponibilidades,
      backupDisponibilidades,
      setCitas,
      backupCitas,
      calendarRef
    );
  };

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
    setDisponibilidades,
    setVisualizar,
    setBackupCitas,
    citas,
    setCitas
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
    
  `;

  return (
    <div className='flex flex-col justify-between'>
      <div className='flex flex-row items-center justify-between gap-2'>
        <Leyenda />
        <div className='flex flex-row gap-[16px]'>
          {editable ? (
            <>
              <Button onClick={handleSaveEvents} className='bg-[#008000] text-white'>
                Guardar cambios
              </Button>
              <Button onClick={handleCancelEvents} className='bg-[#FF4545] text-white'>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleEditarDisponibilidadEvent} color='primary' startContent={<Pencil size={20} />}>
                Editar Disponibilidad
              </Button>
              <Button onClick={handleNuevaSesionEvent} color='primary' startContent={<CirclePlus size={20} />}>
                Nuevo
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='overflow-hidden' ref={divCalendarRef}>
        <StyleWrapper>
          <FullCalendar
            nowIndicator={true}
            slotMinTime={"07:00:00"}
            slotMaxTime={"22:00:00"}
            slotLabelFormat={{
              hour: 'numeric',
              omitZeroMinute: true,
              hour12: true,
              meridiem: 'short'
            }}
            allDaySlot={false}
            locale={esLocale}
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            initialDate={selectDate}
            headerToolbar={{
              left: 'prev,next,today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            views = {{
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long' } // Mostrar el título en el formato "Junio 2024"
              }
            }}
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
            viewDidMount={handleViewDidMount}
          />
        </StyleWrapper>
      </div>

      <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
        <ModalContent>
          <ModalHeader className='flex justify-center'>
            {gestionarCitas ? "Registro de una cita" : "Edición de bloque de disponibilidad"}
          </ModalHeader>
          <ModalBody className='flex flex-row items-center justify-center gap-[16px] w-full'>
            {gestionarCitas ? (
              <></>
            ) : (
              <>
                <GeneralDropdown options={frecuencias} selectedKeys={frecuencia} setSelectedKeys={setFrecuencia}/>
                <DatePicker value={fechaLimite} onChange={setFechaLimite} label="Hasta" className="w-1/2" />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <div className='flex flex-col items-center justify-center w-full gap-4 md:flex-row'>
              <Button
                variant='solid'
                onPress={() => {
                  if (gestionarCitas) onOpenChange(false);
                  else setFrequencyEvent();
                }}
                className='w-1/2 h-9 bg-[#008000] text-white'
              >
                Aceptar
              </Button>
              <Button
                variant='solid'
                onPress={handleDeleteEventEvent}
                className='w-1/2 h-9 bg-[#FF4545] text-white'
              >
                Eliminar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isMounted && 
        <RegistrarCitaPopover 
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
    </div>
  );
};

export default ConfigurarDisponibilidad;