import { Button, Divider, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { CircleX } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import { eliminarCita, registrarCitaParteAlumno } from '../../tutor/service/citasService';
import FechaHoraProgramada from '../../tutor/components/FechaHoraProgramada';
import toast from 'react-hot-toast';
const moment = require('moment-timezone');
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useEventInfo } from '../../tutor/states/EventContext';
import TutorAsignadoCita from './TutorAsignadoCita';
import { useTutor } from '@/modules/portal/coordinador/states/TutorContext';
import ModalMotivoCancelarCita from '../../tutor/components/ModalMotivoCancelarCita';

const RegistrarCitaPopover = ({session, showButton, setShowButton, citas, setCitas, tipoTutoria, setSelectedEvent, selectedEvent, isOpen, setIsOpen, top, left, popOverMode, setPopOverMode, handleUnmount, setSelectDate, handleGuardarCitas}) => {

    const [isCitaRegistered, setIsCitaRegistered] = useState(false);
    const [ubicacion, setUbicacion] = useState("");
    const [initialUbicacion, setInitialUbicacion] = useState("");
    const [isUbicacionInvalid, setIsUbicacionInvalid] = useState(false);
    const [selectedModality, setSelectedModality] = useState(new Set(['presencial']));
    const [initialSelectedModality, setInitialSelectedModality] = useState(new Set(['presencial']));
    const [modalityKey, setModalityKey] = useState(0);
    const {setActiveComponentById} = useActiveComponent();
    const { setEvent } = useEventInfo();
    const { tutor } = useTutor();
    const [ eventState, setEventState ] = useState("");
    const [ popOverHidden, setPopOverHidden ] = useState(false);
    const [ register, setRegister ] = useState(false);

    useEffect(() => {
      console.log(isOpen); 
    }, [])

    useEffect(() => {
      const now = new Date();
      const today = parseDate(now.toLocaleDateString());
      if (popOverMode === 'visualizar'){
        setIsCitaRegistered(true);
        //setSelectDate(parseDate(selectedEvent.date));
/*         setSelectDate(selectedEvent ? parseDate(selectedEvent.date) : today) */
      }
    }, [popOverMode])

    useEffect(() => {
      console.log("a ver");
      console.log("Selected Event Changed: ", selectedEvent);
      console.log(isOpen)
      if (selectedEvent) {
        setSelectedModality(new Set([selectedEvent.modalidad || 'presencial']));
        setUbicacion(selectedEvent.ubicacion || "");
        setInitialSelectedModality(new Set([selectedEvent.modalidad || 'presencial']));
        setInitialUbicacion(selectedEvent.ubicacion || "");

        // VIENDO SI LA CITA ESTA EN EL PASADO, PRESENTE O FUTURO

        let dateTimeObj = new Date();
        const date = dateTimeObj.toLocaleDateString("es-PE", { year: 'numeric', month: '2-digit', day: '2-digit' });
        const time = dateTimeObj.toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: "h24" });
        const [ day, month, year ] = date.split("/");
        const dateTime = year + "-" + month + "-" + day + "T" + time + "-05:00";
        console.log("CURRENT DATETIME: ", dateTime);
  
        if (dateTime < selectedEvent.start) {
          setEventState("future");
        }
        else if (selectedEvent.start <= dateTime && dateTime <= selectedEvent.end) {
            setEventState("present");
        }
        else {
          setEventState("past");
        }
      }
    }, [selectedEvent]);


    const parseDate = (dateStr) => {
      //Si esque algun dia esto da error o hay algun error en las fechas es porque cambiaron el idioma nativo
      const [month, day, year] = dateStr.split("/").map(part => part.padStart(2, '0'));
      return `${year}-${day}-${month}`;
    };

    const formatDate = (dateString) => {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const modalities = [
      { key: "presencial", label: "Presencial" },
      { key: "virtual", label: "Virtual" }
    ];

      

    useEffect(() => {
      console.log("sel moda: ", selectedModality);
    }, [selectedModality])


    const modality = Array.from(selectedModality)[0];


    useEffect(() => {
      console.log("cita registradA?: ", isCitaRegistered);
    }, [isCitaRegistered]);

    const inputProps = modality === 'presencial'
    ? { type: 'text', label: 'Ubicación',  }
    : modality === 'virtual'
    ? { type: 'text', label: 'Enlace',  }
    : {};

    const handleClosePopover = () => {
        console.log("CLOSE POPOVER")
        setIsOpen(false);
        if (popOverMode === 'registrar') setIsCitaRegistered(false);
        setPopOverMode('registrar');
        setSelectedModality(new Set(['presencial']));
        if (popOverMode == "registrar") {
          const copy = JSON.parse(JSON.stringify(citas));
          copy.pop();
          console.log("CITAS: ", copy);
          setCitas(copy);
        }
        /* handleUnmount(); */
        /* setShowButton(false);
        setCitas((prevCitas) => prevCitas.slice(0, -1)); */
      };

    const handleEliminarCita = (motivo) => {
      const token = session?.accessToken;

      toast.promise(
        eliminarCita(selectedEvent.id, token, motivo),
        {
          loading: 'Eliminando cita...',
          success: 'Cita eliminada con éxito',
          error: 'Error al eliminar la cita',
        },
        {
          style: {
            minWidth: '250px',
          },
        }
      )
        .then((response) => {
          console.log('Cita eliminada:', response);
          setCitas((prevCitas) => {
            for (let i=0; i<prevCitas.length; i++) {
              if (prevCitas[i].id === selectedEvent.id) {
                prevCitas.splice(i, 1);
                return prevCitas;
              }
            }
           })
/*           setCitas((prevCitas) => {
            return prevCitas.map((cita) => {
              if (cita.id === selectedEvent.id) {
                return {
                  ...cita,
                  title: `Cita ${tipoTutoria?.nombre ? tipoTutoria.nombre : tipoTutoria} cancelada`,
                  color: '#FF0000' // Rojo para indicar que fue cancelada
                };
              }
              return cita;
            });
          }); */
          setIsOpen(false);
          setUbicacion('');
          setSelectedModality(new Set(['presencial']));
          setPopOverHidden(false);
          if (popOverMode='visualizar') {
            setPopOverMode('visualizar');
          } else{
            setPopOverMode('registrar');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar la cita:', error);
        });
    }

    const combineDateTime = (date, time) => {
      //const [year, month, day] = date.split('-');
      //const formattedDate = `${year}-${month}-${day}`;
      const [month, day, year] = date.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return new Date(`${formattedDate}T${time}`);
    };
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toLocaleDateString();

    const formatDateTime = (date, time, timeZone = 'America/Lima') => {
      console.log(date);
      console.log(time);
      const moment = require('moment-timezone'); // Asegúrate de tener esto si no está ya importado
    
      // Convertir la fecha al formato correcto
      const [day, month, year] = date.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
      // Convertir la hora al formato 24 horas
      const [hours, minutes, seconds] = time.split(/[:\s]/);
      const period = time.split(' ')[1];
      let hours24 = parseInt(hours);
    
      if (period === 'PM' && hours24 !== 12) {
        hours24 += 12;
      } else if (period === 'AM' && hours24 === 12) {
        hours24 = 0;
      }
    
/*       // Crear una fecha en formato ISO 8601
      const dateTimeString = `${formattedDate} ${hours24.toString().padStart(2, '0')}:${minutes}:${seconds}`;
      console.log(dateTimeString);
      // Convertir la fecha a la zona horaria especificada y formatear
      const formattedDateTime = moment.tz(dateTimeString, 'YYYY-MM-DD HH:mm:ss', timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
      console.log(formattedDateTime); 
      return formattedDateTime;
      */

      const dateTimeString = `${formattedDate}T${hours24.toString().padStart(2, '0')}:${minutes}:${seconds}-05:00`;
      return dateTimeString;
    };
  

      useEffect(() => {
        if (!isOpen && !isCitaRegistered && popOverMode === 'registrar') {
          setShowButton(false);
          setCitas((prevCitas) => {
            if (prevCitas.length > 0) {
              return prevCitas.slice(0, -1);
            }
            return prevCitas;
          });
          handleUnmount();
        }
      }, [isOpen]);

      useEffect(() => {
        console.log("ubi: ", ubicacion);
      }, [ubicacion])

      const handleRegisterCita = async () => {
        if (register)
          return;
        setRegister(true);
/*         const fechaHoraInicio = formatDateTime(selectedEvent.date, selectedEvent.start);
        const fechaHoraFin = formatDateTime(selectedEvent.date, selectedEvent.end); */

/*         console.log("hora fin: ", fechaHoraFin); */

        const cita = {
          idAlumno: Number(session.user.id),
          idTipoTutoria: tipoTutoria.idTipoTutoria,
          idTutor: tutor.idTutor,
          fechaHoraInicio: selectedEvent.start,
          fechaHoraFin: selectedEvent.end,
          modalidad: {
            tipo: modality.charAt(0).toUpperCase() + modality.slice(1),
/*             valor: ubicacion */
          }
        };

        console.log("cita data a enviar: ", cita);

        console.log("tipo: ", modality);
        console.log(cita);
        
        console.log(session);

        const token = session?.accessToken;
        const responseId = await registrarCitaParteAlumno(cita, token);
        console.log("id respuesta: ", responseId);
        
        if (responseId) {
          setCitas((prevCitas) => {
            const updatedCitas = prevCitas.map((cita) => {
              if (cita.id === selectedEvent.id) {
                return { ...cita, 
                  title: `Cita ${tipoTutoria.nombre} Programada`, 
                  id: responseId, 
                  modalidad: modality, 
                  ubicacion: ubicacion, 
                  tipoTutoria: tipoTutoria.nombre,
                  esNuevo: true
                };
              }
              return cita;
            });
            return updatedCitas;
          });
          // Actualizar el evento seleccionado con el nuevo ID
          setSelectedEvent((prevSelectedEvent) => ({
            ...prevSelectedEvent,
            id: responseId,
          }));
          setUbicacion('');
          setIsCitaRegistered(true);
          setIsOpen(false);
          setShowButton(false);
          setRegister(false);
        }
        handleGuardarCitas();
      };


      useEffect(() => {
        console.log("ubi inicial: ", initialUbicacion);
      }, [initialUbicacion])

      useEffect(() => {
        console.log("moda inicial: ", initialSelectedModality);
      }, [selectedModality])

      const verResultadosYCompromisos = () => {
        console.log(selectedEvent);
        setEvent(selectedEvent);
        setActiveComponentById("compromisosDeCita", "Detalle");
      } 

      function handleOpenChange(open) {
        setIsOpen(open);
        setShowButton(open);
        setPopOverMode('registrar');
      }

  return (
    <>
      {showButton && (
        <Popover 
          isOpen={isOpen} 
          onOpenChange={handleOpenChange}
          className={(popOverHidden ? " hidden" : "")}
        >
          <PopoverTrigger>
            <Button
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                zIndex: 1000,
                backgroundColor: 'transparent', // Hacer el fondo transparente
                border: 'none', // Asegurarse de que no haya borde visible
                color: 'transparent', // Hacer el texto transparente
              }}
            >
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col w-[500px] p-2 gap-2 pb-4">
                <div className='flex flex-row items-center justify-between w-full popover-header'>
                  <h3 className='text-base font-medium'>
                  {popOverMode === 'registrar' ? "Registrar cita" 
                    : popOverMode === 'visualizar' ? "Detalle de la cita" 
                    : ""}
                  </h3>
                  <div className='flex flex-row gap-2'>
                    {popOverMode !== 'registrar' && !selectedEvent.eliminado && (
                      <>
                        {/* !(combineDateTime(currentDate, currentTime) > combineDateTime(selectedEvent.date, selectedEvent.endTime)) &&  */
                        (eventState == "future") &&
                                                  (
                                                    <ModalMotivoCancelarCita 
                                                      handleEliminarCita={handleEliminarCita}
                                                      setPopOverHidden={setPopOverHidden}
                                                    />
                                                  )}
                      </>
                    )}
                    <Button isIconOnly color='default' variant='light' aria-label='Cancelar programación de cita' onPress={handleClosePopover}>
                        <CircleX className='w-5 h-5 text-gray-800' />
                    </Button>
                  </div>
                    
                </div>
                <Input
                  label="Tipo de tutoría"
                  //value={tipoTutoria?.nombre ? tipoTutoria.nombre : tipoTutoria || selectedEvent.tipoTutoria} //Cuando es registro vs cuando es visualizar
                  value ={popOverMode === 'registrar' ? (tipoTutoria?.nombre ? tipoTutoria.nombre : tipoTutoria) : selectedEvent.tipoTutoria} //Cuando es registro vs cuando es visualizar/editar
                  isReadOnly
                  className='w-full text-sm text-gray-700'
                  data-readonly
                />
                <Divider className="my-2"/>
                <TutorAsignadoCita tutor={selectedEvent.tutor} />
                <Divider className="my-2"/>
                <FechaHoraProgramada date={selectedEvent.date} startTime={selectedEvent.start} endTime={selectedEvent.end}/>
                <Divider className="my-2"/>
                {
                  popOverMode == "registrar" ?
                  (
                    <></>
                  )
                  :
                  (
                    <div className='flex flex-row items-center w-full gap-4 '>
                    <div className='flex flex-col justify-center w-full h-20'> 
                       
                       <div className='flex flex-col px-3 py-2 rounded-xl bg-[#F2F2F3] gap-1 hover:bg-[#E0E0E3] transition duration-200'>
                         <span className='text-xs text-gray-600 transition duration-200 hover:text-gray'>Tipo de modalidad</span>
                         <span>{selectedEvent.modalidad.charAt(0).toUpperCase() + selectedEvent.modalidad.slice(1).toLowerCase()}</span>
                       </div>
                     
                     </div>
                     <div className='flex flex-col justify-center w-full h-20'>
                         <Input
                             {...inputProps}
                             className="w-full"
                             color={isUbicacionInvalid ? 'danger' : 'default'}
                             isReadOnly={true}
                             defaultValue={selectedEvent.ubicacion}
                         />
                     </div>
                    </div>
                  )
                }
                <div className='flex flex-row justify-end w-full gap-2'>
                { popOverMode === 'registrar' ? (
                  <>
                    <Button color='default' onPress={handleClosePopover}>Cancelar</Button>
                    <Button color='primary' onPress={handleRegisterCita}>Registrar</Button>
                  </>
                ) : (
                  <>
{/*                     <span className='w-[75px] h-[40px]'></span> Espacio ocupado por el botón de Cancelar
                    <span className='w-[75px] h-[40px]'></span> Espacio ocupado por el botón de Registrar */}
                  </>
                )}
                </div>
            {
              popOverMode == "visualizar" && !(selectedEvent.eliminado) && eventState == "past" ?
              (
                <Button className='w-fit' color='primary' onPress={verResultadosYCompromisos}>Ver detalle</Button>
              )
              :
              (
                <div></div>
              )
            }
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default RegistrarCitaPopover