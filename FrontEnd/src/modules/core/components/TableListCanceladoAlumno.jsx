import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { CalendarIcon } from 'lucide-react';
import { AvatarGroupComponent } from '@/modules/portal/tutor/components/AvatarGroupComponent';
import { SingleUserComponent } from '@/modules/portal/tutor/components/SingleUserComponent';
import ModalidadUbicacionCard from '@/modules/portal/tutor/components/ModalidadUbicacionCard';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const TableListCanceladoAlumno = ({ estado, items}) => {
  const [timeDifferences, setTimeDifferences] = useState({});
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const statusColorMap = {
    Programado: "primary",
    Cancelado: "danger",
    Completado: "success",
  };
  const [ motivoCancelacion, setMotivoCancelacion ] = useState("");

  useEffect(() => {
    console.log("ESTADO: ", estado)
  }, [])

  useEffect(() => {
    console.log("los items son: ", items);

    const initialMessages = {};
    items.forEach(cita => {
      initialMessages[cita.idCita] = getTimeDifferenceMessage(cita.fechaHoraInicio, cita.fechaHoraFin);
    });
    setTimeDifferences(initialMessages);

    const intervalId = setInterval(() => {
      const updatedMessages = {};
      items.forEach(cita => {
        updatedMessages[cita.idCita] = getTimeDifferenceMessage(cita.fechaHoraInicio, cita.fechaHoraFin);
      });
      setTimeDifferences(updatedMessages);
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(intervalId);
  }, [items]);

  useEffect(() => {
    console.log("tiempos: ", timeDifferences);
  }, [timeDifferences])

  function getTimeDifferenceMessage(citaStart, citaEnd) {
    const now = new Date();
    const startDate = new Date(citaStart);
    const endDate = new Date(citaEnd);
    const differenceToStart = startDate - now;
    const differenceToEnd = endDate - now;

    // Comprobar si la cita está en curso
    if (differenceToStart < 0 && differenceToEnd > 0) {
      return "La cita está en curso";
    }

    // Si la diferencia al inicio es negativa y al final también, la cita ya ocurrió
    if (differenceToEnd < 0) {
      //return "La cita ha pasado";
      return;
    }

    const minutes = Math.floor(differenceToStart / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return `Faltan ${months} mes(es)`;
    } else if (weeks > 0) {
      return `Faltan ${weeks} semana(s)`;
    } else if (days > 0) {
      return `Faltan ${days} día(s)`;
    } else if (hours > 0) {
      return `Faltan ${hours} hora(s)`;
    } else if (minutes > 0) {
      return `Faltan ${minutes} minuto(s)`;
    } else {
      return "La cita es ahora";
    }
  }

  async function mostrarMotivo(cita) {
    if (cita.estadoCita == "Cancelado")
    {
      console.log("OK: ", cita.motivoRechazo);
      setMotivoCancelacion(cita.motivoRechazo);
      onOpen();
    }
  }

  return (
    <div>
    <Table aria-label='Proximas citas'>
      <TableHeader>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Tipo de Tutoría</TableColumn>
          <TableColumn>Tutor</TableColumn>
          <TableColumn>Ubicación</TableColumn>
          <TableColumn>Fecha y Hora</TableColumn>
          <TableColumn>Motivo de cancelación</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No hay citas proximas encontradas."} items={items}>
        {((cita) => (
          <TableRow key={cita.idCita}>
            <TableCell>
              <Chip  className="capitalize" color={statusColorMap[cita.estadoCita]} size="sm" variant="flat">
                {cita.estadoCita}
              </Chip>
            </TableCell>
            <TableCell>{cita.tipoTutoria}</TableCell>
            <TableCell>
              <SingleUserComponent student={cita.tutor} />
            </TableCell>
            <TableCell>
                <ModalidadUbicacionCard
                    modalidad={cita.modalidad}
                    ubicacion={cita.ubicacion}
                />
            </TableCell>
            <TableCell>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                      <div className='flex flex-shrink-0'>
                        <CalendarIcon size={16}/>
                      </div>
                      {new Date(cita.fechaHoraInicio).toLocaleString('es-ES', {
                        weekday: 'long',  // nombre del día de la semana
                        year: 'numeric',  // año en formato numérico
                        month: 'long',    // nombre del mes
                        day: 'numeric',   // día del mes
                        hour: 'numeric',  // hora
                        minute: '2-digit',  // minuto con dos dígitos
                        hour12: true     // utilizar formato de 12 horas
                      })} - {new Date(cita.fechaHoraFin).toLocaleString('es-ES', {
                        hour: 'numeric',   // hora
                        minute: '2-digit', // minuto con dos dígitos
                        hour12: true       // utilizar formato de 12 horas
                      })}
                    </div>
                    <span className='font-medium text-sm text-blue-500'>
                        {getTimeDifferenceMessage(cita.fechaHoraInicio, cita.fechaHoraFin)}
                    </span>
                  </div>
            </TableCell>
            <TableCell>
              <Button color='primary' onClick={() => mostrarMotivo(cita)}>
                Ver motivo
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='p-4'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Motivo de cancelación</ModalHeader>
              <ModalBody>
                {motivoCancelacion}
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={() => onOpenChange(false)}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};

export default TableListCanceladoAlumno;
