'use client'
import { useUsers } from '@/modules/core/states/UsersContext';
import { useMode } from '@/modules/portal/tutor/states/CalendarModeContext';
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import React, { useEffect, useRef, useState } from 'react';
import { enviarDisponibilidadesPorTutor, fetchDisponibilidadesPorTutor, listarCitasPorTutor } from '../../services/DisponibilidadesTutorService';
import CalendarActionToolbarForCoordinator from '../../components/CalendarActionToolbarCoordinador';
import FullCalendarEstilizado from '@/modules/core/components/FullCalendarEstilizado';
import { useDisclosure } from '@nextui-org/react';
import { actualizarDisponibilidadLocal, actualizarDisponibilidades, crearEventoActualizado, crearEventoRedimensionado, crearNuevoEvento, esDisponibilidadFusionada, esFrecuenciaUnica, esSolapadoConCitas, esSolapadoConTodasCitas, fusionarDisponibilidadesSiSolapan, generarListaDeDias, manejarDisponibilidadFusionada, manejarEliminacionDisponibilidad, obtenerFechaLimiteString, procesarFrecuencia } from '@/modules/portal/tutor/utils/calendarUtils';
import ModalEdicionDisponibilidad from '@/modules/core/components/ModalEdicionDisponibilidad';

const EditarDisponibilidadTutor = ({session}) => {
  //Sin contextos
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [backupDisponibilidades, setBackupDisponibilidades] = useState([]); 
  const [deletedDisponibilidades, setDeletedDisponibilidades] = useState([]);
  const calendarRef = useRef(null);
  const [citas, setCitas] = useState([]);

  const [fechaLimite, setFechaLimite] = useState(today(getLocalTimeZone()));

  /* Frecuencia de un bloque de disponibilidad */
  const frecuencias = [
    {key: "único", value: "Único"},
    {key: "diario", value: "Diario"},
    {key: "semanal", value: "Semanal"},
    {key: "mensual", value: "Mensual"}
  ]
  const [frecuencia, setFrecuencia] = useState(new Set(["único"]));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [originalDisponibilidad, setOriginalDisponibilidad] = useState(null);

  //Con contextos
  const { users } = useUsers();
  const { mode, setMode, setViewMode } = useMode();

  console.log("Entro el tutor: ", users[0].nombres);

  //Efectos
  useEffect(() => {
    const fetchData = async () => {
      if(session){
        const citas = await listarCitasPorTutor(session,users[0].id);
        if (citas) {
          setCitas(citas)
        }
        const disponibilidades = await fetchDisponibilidadesPorTutor(session,users[0].id);
        if (disponibilidades) {
          setDisponibilidades(disponibilidades);
          setBackupDisponibilidades(disponibilidades);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("disp: ", disponibilidades);
  }, [disponibilidades])

  useEffect(() => {
    console.log("citas: ", citas);
  }, [citas])


  const handleEditarDisponibilidadClick = () => {
    setMode('editarDisponibilidad');
    setDisponibilidades(disponibilidades.map(event => ({
      ...event,
      display: 'auto'
    })));
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

  const handleGuardarEdicionDisponibilidades = async () => {
    const disponibilidadesData = mapearDisponibilidades(disponibilidades);
    const response = await enviarDisponibilidadesPorTutor(disponibilidadesData, deletedDisponibilidades, session,users[0].id);
    if (response) {
      setBackupDisponibilidades([...response.disponibilidades]);
      actualizarEstadoBackgroundDisponibilidades(response.disponibilidades, setDisponibilidades);
      visualizarCitasMode();
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


  //====================Eventos de Full Calendar====================
  //Seleccion del bloque de Disponibilidad
  const handleDisponibilidadEventClick = (clickInfo) => {
    const event = disponibilidades.find((e) => e.id === Number(clickInfo.event.id));
    if (!event) return;
    const eventDateString = (event?.end?.split("T"))[0];
    setFechaLimite(parseDate(eventDateString));
    setFrecuencia(new Set(["único"]));
    setSelectedEvent(event);
    onOpenChange(true);
  }
  // Maneja la lógica específica para la creación de disponibilidades
  const handleCrearDisponibilidad = (selectionInfo) => {
    const newEvent = crearNuevoEvento(selectionInfo, false);
    console.log("Nueva Disponibilidad a comparar: ", newEvent);
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


  // Maneja la redimensión de duracion de un evento disponibilidad en el calendario
  const handleManejarRedimensionDisponibilidad = (resizeInfo) => {
    const resizedEvent = crearEventoRedimensionado(resizeInfo);
    if (esSolapadoConTodasCitas(resizedEvent, citas)) {
      resizeInfo.revert();
      return;
    }

    actualizarDisponibilidadLocal(resizedEvent, disponibilidades, setDisponibilidades);
  }

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
  //===============================================================


  //==========Modal Edicion Disponibilidad=========================
  const manejarFrecuenciaDisponibilidad = () => {
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
    setDisponibilidades(nuevasDisponibilidades);
    onOpenChange(false);
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
  
  //===============================================================
  
  return (
    <div className='flex flex-col justify-between gap-4'>
      <CalendarActionToolbarForCoordinator
        mode={mode}
        handleGuardarEdicionDisponibilidades={handleGuardarEdicionDisponibilidades}
        handleCancelarEditarDisponibilidad={handleCancelarEditarDisponibilidad}
        handleEditarDisponibilidadClick={handleEditarDisponibilidadClick}
      />
      <FullCalendarEstilizado
        calendarRef={calendarRef}
        mode={mode}
        disponibilidades={disponibilidades}
        citas={citas}
        handleDisponibilidadEventClick={handleDisponibilidadEventClick} //Seleccionar el bloque de disponibilidad
        handleCrearDisponibilidad={handleCrearDisponibilidad}           //Guardar el bloque de disponibilidad
        handleManejarRedimensionDisponibilidad={handleManejarRedimensionDisponibilidad}//Redimensiona el bloque de disponibilidad
        handleDisponibilidadDrop={handleDisponibilidadDrop}
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
    </div>
  );
};

export default EditarDisponibilidadTutor;
