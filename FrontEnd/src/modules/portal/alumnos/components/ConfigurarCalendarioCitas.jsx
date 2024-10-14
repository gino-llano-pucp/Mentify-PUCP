'use client'
import { useRef, useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import LeyendaAlumnos from "./LeyendaAlumnos";
import { useActiveComponent } from "@/modules/core/states/ActiveComponentContext";
import { useEffect } from "react";
import { listarCitasAlumno } from "../../tutor/service/citasService";
import FullCalendarEstilizado from "@/modules/core/components/FullCalendarEstilizado";
import { useMode } from "../../tutor/states/CalendarModeContext";
import { findMatchingEvent, formatEventDetails } from "../../tutor/utils/eventHandlers";
import RegistrarCitaPopover from "../components/CitaPopOver";
import { useTutoringType } from "../../coordinador/states/TutoringTypeContext";

const ConfigurarCalendarioCitas = ({session}) => {
    const calendarRef = useRef(null);
    const [citas, setCitas] = useState([]);
    const { isOpen, onOpenChange } = useDisclosure();
    const { setActiveComponentById } = useActiveComponent();
    const { mode, setMode } = useMode();
    const [disponibilidades, setDisponibilidades] = useState([]); 
    const [isMounted, setIsMounted] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popOverMode, setPopOverMode] = useState("visualizar");
    const [isPopOpen, setIsPopOpen] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0])
    const { selectedTutoringType } = useTutoringType();

    const handleUnmount = () => {
      setIsMounted(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        if (session) {
          const citas = await listarCitasAlumno(session.accessToken);
          if (citas) {
            setCitas(citas)
          }
        }
      };
  
      fetchData();
    }, []);

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
    
/*     const StyleWrapper = styled.div`
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
  `; */

  const handleNuevaCita = (setEditable, setGestionarCitas) => {
    /* setEditable(true);
    setGestionarCitas(true); */
    setActiveComponentById('tiposTutoriaAlumno', `Selección de tipo de tutoría`);
  };

  const handleCitasEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const matchedEvent = findMatchingEvent(event, citas);
  
    if (matchedEvent) {
      console.log("MATCHED EVENT: ", matchedEvent);
      const formattedEventDetails = formatEventDetails(matchedEvent);
      console.log("Detalle de cita formateado: ", formattedEventDetails);
      setPopOverMode('visualizar');
      setIsPopOpen(true);
      setSelectedEvent(formattedEventDetails);

    } else {
      console.error('Evento no encontrado en el arreglo de citas');
    }
  }

    return (
        <div className='flex flex-col justify-between'>
            <div className='flex flex-row items-center justify-between gap-2'>
                <LeyendaAlumnos />
                <div className='flex flex-row gap-[16px]'>
                    {/*onClick={handleNuevaSesionEvent}*/}
                    <Button onPress={handleNuevaCita}  color='primary' startContent={<CirclePlus size={20} />}>
                        Nuevo
                    </Button>
                </div>
            </div>

      <FullCalendarEstilizado
        calendarRef={calendarRef}
        mode={mode}
        disponibilidades={disponibilidades}
        citas={citas}
        handleCitasEventClick={handleCitasEventClick}
/*         handleCrearCita={handleCrearCita}
        handleSelectAllow={handleSelectAllow} */
      />

      {isPopOpen && 
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

        </div>
    );
};

export default ConfigurarCalendarioCitas;