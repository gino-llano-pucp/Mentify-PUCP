import { Button, Divider, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { CircleX, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useStudentInfo } from '../states/StudentInfoContext';
import { editarCita, eliminarCita, registrarCita } from '../service/citasService';
import FechaHoraProgramada from './FechaHoraProgramada';
import TipoModalidad from './TipoModalidad';
import AlumnosAsignadosCita from './AlumnosAsignadosCita';
import toast from 'react-hot-toast';
const moment = require('moment-timezone');
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useEventInfo } from '../states/EventContext';
import ModalMotivoCancelarCita from './ModalMotivoCancelarCita';

const RegistrarCitaPopover = ({session, showButton, setShowButton, setCitas, tipoTutoria, setSelectedEvent, selectedEvent, isOpen, setIsOpen, top, left, popOverMode, setPopOverMode, handleUnmount, setSelectDate}) => {
    const { studentInfos, addStudentInfo, clearStudentInfos } = useStudentInfo();
    const [isCitaRegistered, setIsCitaRegistered] = useState(false);
    const [ubicacion, setUbicacion] = useState('');
    const [initialUbicacion, setInitialUbicacion] = useState('');
    const [isUbicacionInvalid, setIsUbicacionInvalid] = useState(false);
    const [selectedModality, setSelectedModality] = useState(new Set(['presencial']));
    const [initialSelectedModality, setInitialSelectedModality] = useState(new Set(['presencial']));
    const [modalityKey, setModalityKey] = useState(0);
    const {setActiveComponentById} = useActiveComponent();
    const { setEvent, setAsistenciaContext } = useEventInfo();
    const [ eventState, setEventState ] = useState("");
    const [ popOverHidden, setPopOverHidden ] = useState(false);
    const [ register, setRegister ] = useState(false);

/*     useEffect(() => {
      console.log(isOpen); 
    }, [])
 */
    useEffect(() => {
        console.log("student: ", studentInfos);
    }, [studentInfos])

    useEffect(() => {
      if (popOverMode === 'visualizar'){
        setIsCitaRegistered(true);
      }
    }, [popOverMode])

    useEffect(() => {
      console.log("a ver");
      console.log("Selected Event Changed: ", selectedEvent);
      console.log(isOpen)
      if (selectedEvent) {
        setSelectedModality(new Set([selectedEvent.modalidad || 'presencial']));
        setUbicacion(selectedEvent.ubicacion || '');
        setInitialSelectedModality(new Set([selectedEvent.modalidad || 'presencial']));
        setInitialUbicacion(selectedEvent.ubicacion || '');
        
        if (selectedEvent.alumnos) {
          clearStudentInfos();
          // Lógica para setear info de todos los estudiantes de la cita a visualizar en el calendario
          selectedEvent.alumnos.forEach(alumno => {
            addStudentInfo(alumno);
          });
        }
      
        // VIENDO SI LA CITA ESTA EN EL PASADO, PRESENTE O FUTURO

/*         const formattedDate = new Date(selectedEvent.start).toLocaleDateString("es-PE", { year: 'numeric', month: '2-digit', day: '2-digit' });
        const formattedStartTime = new Date(selectedEvent.start).toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: "h24" });
        const formattedEndTime = new Date(selectedEvent.end).toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: "h24" });
        console.log("formattedDate: ", formattedDate);
        console.log("formattedStartTime: ", formattedStartTime);
        console.log("formattedEndTime: ", formattedEndTime); */
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

    useEffect(() => {
      console.log("EVENT STATE: ", eventState);
    }, [eventState])

    /* useEffect(() => {
      if (popOverMode === 'visualizar') {
        setSelectedModality(new Set([selectedEvent.modalidad]));
        return;
      }
      setSelectedModality(new Set(['presencial']));
    }, [popOverMode]) */

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

    const handleModalityChange = (modalityKeys) => {
      if (modalityKeys.size === 0) {
          console.log("entra? ", modalityKeys);
        // Prevent deselection of all options by resetting to 'presencial'
        setSelectedModality(new Set(['presencial']));
      } else {
        setSelectedModality(modalityKeys);
      }
    };

    const modality = Array.from(selectedModality)[0];

    const handleUbicacionChange = (e) => {
      setUbicacion(e.target.value);
      setIsUbicacionInvalid(false);
    };

    useEffect(() => {
      console.log("cita registradA?: ", isCitaRegistered);
    }, [isCitaRegistered]);

    const inputProps = modality === 'presencial'
    ? { type: 'text', label: 'Ubicación', placeholder: 'Ingresa la ubicación', onChange: handleUbicacionChange }
    : modality === 'virtual'
    ? { type: 'text', label: 'Enlace', placeholder: 'Ingresa el enlace', onChange: handleUbicacionChange }
    : {};

    const handleClosePopover = () => {
        setIsOpen(false);
        if (popOverMode === 'registrar') setIsCitaRegistered(false);
        setPopOverMode('registrar');
        setSelectedModality(new Set(['presencial']));
        /* handleUnmount(); */
        /* setShowButton(false);
        setCitas((prevCitas) => prevCitas.slice(0, -1)); */
      };

    const handleEliminarCita = (motivo) => {
      console.log("MOTIVO: ", motivo);
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
      console.log("dateL: ", date);
      console.log("timeL: ", time);
      const moment = require('moment-timezone'); // Asegúrate de tener esto si no está ya importado
      // date: 4/7/2024
      // output date: 2024/04/07
      // Convertir la fecha al formato correcto
      console.log("DATE: ", date);
      // 16/6/2024 (formato esp)
      // 06/16/2024 (format ingles)

      // Split the date string assuming the common delimiter '/'
      const parts = date.split('/');
      let day, month, year;
    
/*       // Check if the first part (month in MM/dd/yyyy or day in dd/MM/yyyy) exceeds 12
      if (parseInt(parts[0]) > 12) {
        // European style dd/MM/yyyy
        day = parts[0];
        month = parts[1];
        year = parts[2];
      } else {
        // US style MM/dd/yyyy
        month = parts[0];
        day = parts[1];
        year = parts[2];
      } */

      day = parts[0];
      month = parts[1];
      year = parts[2];
    
      // Return the date in ISO-8601 format (yyyy-MM-dd)
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
    
      // Crear una fecha en formato ISO 8601ñ
      const dateTimeString = `${formattedDate} ${hours24.toString().padStart(2, '0')}:${minutes}:${seconds}`;
      console.log(dateTimeString);
      // Convertir la fecha a la zona horaria especificada y formatear
      const formattedDateTime = moment.tz(dateTimeString, 'YYYY-MM-DD HH:mm:ss', timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
      console.log(formattedDateTime); 
      return formattedDateTime;
     

/*       const dateTimeString = `${formattedDate}T${hours24.toString().padStart(2, '0')}:${minutes}:${seconds}-05:00`;
      console.log("DATE: ", dateTimeString);
      return dateTimeString; */
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
        
        if (ubicacion.trim() === '') {
          setIsUbicacionInvalid(true);
          return;
        }
        setIsUbicacionInvalid(false);
        
/*         const fechaHoraInicio = formatDateTime(selectedEvent.date, selectedEvent.start);
        const fechaHoraFin = formatDateTime(selectedEvent.date, selectedEvent.end); */

/*         console.log("hora inicio: ", fechaHoraInicio);
        console.log("hora fin: ", fechaHoraFin); */

        const cita = {
          idTipoDeTutoria: tipoTutoria.idTipoTutoria,
/*           idAlumnos: studentInfos.map(student => {
            return {
              "idAlumno": student.idAlumno
            }
          }), // Convertir a arreglo de IDs de alumnos */
          idAlumnos: studentInfos.map((student) => student.idAlumno),
          fechaHoraInicio: selectedEvent.start,
          fechaHoraFin: selectedEvent.end,
          modalidad: {
            tipo: modality.charAt(0).toUpperCase() + modality.slice(1),
            valor: ubicacion
          }
        };

        console.log("cita data a enviar: ", cita);

        console.log("tipo: ", modality);
        console.log(cita);
        

        const token = session?.accessToken;
        const responseId = await registrarCita(cita, token);
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
      };

      const clearUbicacion = () => {
        setUbicacion('');
      }

      const handleEditPopover = () => {
        setUbicacion(selectedEvent.ubicacion);
        setSelectedModality(new Set([selectedEvent.modalidad || 'presencial']));
        setPopOverMode('editar');
      }

      useEffect(() => {
        console.log("ubi inicial: ", initialUbicacion);
      }, [ubicacion])

      useEffect(() => {
        console.log("moda inicial: ", initialSelectedModality);
      }, [selectedModality])

      const handleCancelEdit = () => {
        setPopOverMode('visualizar');
        setUbicacion(initialUbicacion);
        setSelectedModality(initialSelectedModality);
        setModalityKey((prevKey) => prevKey + 1); // Cambia el key para forzar re-render
      };
      
      const guardarCambiosCita = () => {
/*         const fechaHoraInicio = formatDateTime(selectedEvent.date, selectedEvent.start);
        const fechaHoraFin = formatDateTime(selectedEvent.date, selectedEvent.end); */
        const token = session?.accessToken;
        
        const citaData = {
            fechaHoraInicio: selectedEvent.start,
            fechaHoraFin: selectedEvent.end,
            modalidad: modality.charAt(0).toUpperCase() + modality.slice(1),
            lugar_link: ubicacion
          }

        toast.promise(
          editarCita(selectedEvent.id, citaData, token),
          {
            loading: 'Actualizando cita...',
            success: 'Cita actualizada con éxito',
            error: 'Error al actualizar la cita'
          },
          {
            style: {
              minWidth: '250px'
            }
          }
        )
        .then((response) => {
          console.log('Cita actualizada:', response);
          // Actualizar la cita en el arreglo de citas
          setCitas((prevCitas) => {
            const updatedCitas = prevCitas.map((cita) => {
              if (cita.id === selectedEvent.id) {
                return { 
                  ...cita, 
                  fechaHoraInicio: citaData.fechaHoraInicio, 
                  fechaHoraFin: citaData.fechaHoraFin, 
                  modalidad: citaData.modalidad.charAt(0).toLowerCase() + citaData.modalidad.slice(1), 
                  ubicacion: citaData.lugar_link 
                };
              }
              return cita;
            });
            return updatedCitas;
          });
          console.log("UBI: ", ubicacion);
          console.log("SELECTED MODALITY: ", selectedModality);

          setSelectedEvent((prevEvent) => {
            return {
              ...prevEvent,
              ubicacion: ubicacion,
              modalidad: Array.from(selectedModality)[0]
            }
          })
          setPopOverMode('visualizar');
          setInitialUbicacion(ubicacion);
          setInitialSelectedModality(selectedModality);
        })
        .catch((error) => {
          console.error('Error al actualizar la cita:', error);
        });
      };
      
      const handleSaveChanges = () => {
        // Aquí llamas al servicio para guardar los cambios
        guardarCambiosCita();
/*         setPopOverMode('visualizar');
        setInitialUbicacion(ubicacion);
        setInitialSelectedModality(selectedModality); */
      };

      const verResultadosYCompromisos = () => {
        console.log("RYC: ", selectedEvent);
        console.log(studentInfos);
        if (selectedEvent.alumnos == undefined) {
          const s = JSON.parse(JSON.stringify(selectedEvent));
          s.alumnos = studentInfos;
          setEvent(s);
        }
        else 
          setEvent(selectedEvent);
        setAsistenciaContext([]);
        setActiveComponentById("resultadosDeCita", "Detalle");
      } 

      function handleOpenChange(open) {
        setIsOpen(open);
        setShowButton(open);
        setPopOverMode('registrar');
      }

  return (
    <>
      {showButton && (
        <Popover isOpen={isOpen} 
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
          <PopoverContent >
            <div className={"flex flex-col w-[500px] p-2 gap-2 pb-4"}>
                <div className='flex flex-row items-center justify-between w-full popover-header'>
                  <h3 className='text-base font-medium'>
                  {popOverMode === 'registrar' ? "Registrar cita" 
                    : popOverMode === 'editar' ? "Editar cita" 
                    : popOverMode === 'visualizar' ? "Detalle de la cita" 
                    : ""}
                  </h3>
                  <div className='flex flex-row gap-2'>
                    {popOverMode !== 'registrar' && !selectedEvent.eliminado && (
                      <>
                        {popOverMode !== 'editar' && (eventState == 'future' ) && (
                          <Button isIconOnly color='default' variant='light' aria-label='Editar cita' onPress={handleEditPopover}>
                            <Pencil className='w-5 h-5 text-gray-800' />
                          </Button>
                        )}
{/*                         {!(combineDateTime(currentDate, currentTime) > combineDateTime(selectedEvent.date, selectedEvent.endTime)) && (eventState == 'future') && (
                          <Button isIconOnly color='default' variant='light' aria-label='Eliminar cita' onPress={handleEliminarCita}>
                            <Trash className='w-5 h-5 text-gray-800' />
                        </Button>)} */
                        /* !(combineDateTime(currentDate, currentTime) > combineDateTime(selectedEvent.date, selectedEvent.endTime)) && */
                        (eventState == 'future') &&
                        (
                          <ModalMotivoCancelarCita 
                            handleEliminarCita={handleEliminarCita}
                            setPopOverHidden={setPopOverHidden}
                          />
                        )

                        }
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
                <AlumnosAsignadosCita
                  studentInfos={studentInfos} 
                />
                <Divider className="my-2"/>
                <FechaHoraProgramada date={selectedEvent.date} startTime={selectedEvent.start} endTime={selectedEvent.end}/>
                <Divider className="my-2"/>
                <TipoModalidad
                  key={modalityKey} // Cambia el key para forzar re-render
                  modalities={modalities} 
                  selectedModality={popOverMode == "editar" ? selectedModality : (new Set([selectedEvent.modalidad || 'presencial']))} 
                  handleModalityChange={handleModalityChange}
                  inputProps={inputProps}
                  clearUbicacion={clearUbicacion}
                  isUbicacionInvalid={isUbicacionInvalid}
                  visualizar={popOverMode === 'visualizar'}
                  value={popOverMode == "editar" ? ubicacion : selectedEvent.ubicacion}
                />
                <div className='flex flex-row justify-end w-full gap-2'>
                {popOverMode === 'editar' ? (
                  <>
                    <Button color='default' onPress={handleCancelEdit}>Cancelar</Button>
                    <Button color='primary' onPress={handleSaveChanges}>Guardar</Button>
                  </>
                ) : popOverMode === 'registrar' ? (
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