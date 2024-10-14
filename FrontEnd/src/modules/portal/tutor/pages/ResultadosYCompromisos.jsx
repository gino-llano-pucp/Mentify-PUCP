import CardAttribute from "../../admin/components/CardAttribute"
import { Calendar , Clock8 , CircleUser , MapPin } from 'lucide-react';
import {Checkbox} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {Textarea} from "@nextui-org/react";
import { useEventInfo } from "../states/EventContext";
import { CirclePlus } from 'lucide-react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import { Tooltip } from '@nextui-org/react';
import {DndContext} from '@dnd-kit/core';
import {Droppable} from '../components/Droppable';
import { useDraggable } from '@dnd-kit/core';
import {Draggable} from '../components/Draggable';

import { FileCheck } from 'lucide-react';
import { Send } from 'lucide-react';

import fetchAPI from "@/modules/core/services/apiService";

import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

import { useDerivacion } from '@/modules/portal/tutor/states/DerivacionContext';

import { detalleCita } from "../service/citasService";
import { useFile } from "../../coordinador/states/FileContext";

import { useMode } from "../states/CalendarModeContext";

export default function ResultadosDeCita({session}) {
  const {event, asistenciaContext, setAsistenciaContext} = useEventInfo();
  const [alumno, setAlumno] = useState(null);
  const [ tutoriaGrupal, setTutoriaGrupal ] = useState(false);
  const [asistencia, setAsistencia] = useState(asistenciaContext);
  const [input, setInput] = useState("");
  const [resultado, setResultado] = useState("");
  const [flag, setFlag] = useState(true);
  const {setActiveComponentById} = useActiveComponent();
  console.log(event)
  const [detalleDerivacion, setDetalleDerivacion] = useState();

  const { addDerivacion } = useDerivacion();

  const [containers, setContainers] = useState([{
    id: "Comprometido",
    dragables: [],
    color: "bg-red-200"
    }, {
    id: "Ejecución",
    dragables: [],
    color: "bg-amber-200"
    }, {
    id: "Finalizado",
    dragables: [],
    color: "bg-green-200"
    }
  ])

  const [dragables, setDragables] = useState(0);
  const { fileData, saveFileData } = useFile();

  // Para editar y eliminar
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure();
  const [editInput, setEditInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [inputError, setInputError] = useState(false);

  // Para editar y eliminar

  
  console.log();

  const { setMode } = useMode();

  const [ guardando, setGuardando ] = useState(false);

  useEffect(() => {
    if(alumno){
      if(flag) setFlag(false);
      else return;
      console.log(alumno);
      const ObtenerNota = async () => {
        const data = await fetchAPI({
          endpoint: `/historicoEstudiante/getHistoricoPorEstudiante`,
          method: 'POST',
          token: session.accessToken,
          payload: {
            idAlumno: alumno.idAlumno
          },
          successMessage: 'Resultados y compromisos guardados con exito',
          errorMessage: 'Ocurrió un error al registrar los resultados y compromisos',
          showToast: false
        });

        console.log(data);
        if(data && data.historico && data.historico.nota){
          saveFileData(data.historico.nota)
        }
      }
      if (!tutoriaGrupal)
        ObtenerNota();
    }
  }, [alumno]);

  //Formato ISO para fechas en UTC y fechas yyyy-mm-dd
  function formatDateToISO(dateString) {
    if(dateString.endsWith('Z')){
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Formato ISO  
    }
    else{
        let [y,m,d] = dateString.split('-');
        const date = new Date(Date.UTC(y,m-1,d));
        console.log(date)
        const day = String(date.getUTCDate()).padStart(2,'0');
        const month = String(date.getUTCMonth()+1).padStart(2,'0');
        const year = String(date.getUTCFullYear());
        return `${day}-${month}-${year}`; // Formato ISO
    }
    
  }

  useEffect(() => {
    console.log("EVENT: ", event);
    setTutoriaGrupal(1 < event.alumnos.length);
  }, [event])

  useEffect(() => {
    console.log(asistenciaContext);
  }, [asistenciaContext])

  const fetchResultadosYCompromisos = async () => {

    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    const data = await fetchAPI({
      endpoint: `/sesionCita/obtenerDetalle/`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idCita": event.id
      },
      successMessage: '',
      errorMessage: '',
      showToast: false
    });
    console.log(event)
    console.log(event.id)
    console.log("RESPONSE: ", data)
    if (data && data.message == "Detalle de cita con éxito") {
      if(data.detalles.alumnos.length === 1){
        setAlumno(data.detalles.alumnos[0]);
      }
        const {detalles} = data;
        setResultado(detalles.resultado ? detalles.resultado.detalleResultado : "");
        setDetalleDerivacion(detalles);
        if (1 < detalles.alumnos.length) {
          if (1 < detalles.asistencias.length) {
            console.log("ASISTENCIA GRUPAL: ", asistenciaContext);
            if (asistenciaContext.length == 0)
              setAsistenciaContext(detalles.asistencias.map((item) => item.asistio));
          }
          else if (asistenciaContext.length == 0)
            setAsistenciaContext(detalles.alumnos.map((alumno) => false));
        }
        else
          setAsistencia(1 == detalles.asistencias.length ? detalles.asistencias[0].asistio : false);

        const initialContainers = [{
          id: "Comprometido",
          dragables: [],
          color: "bg-red-200"
          }, {
          id: "Ejecución",
          dragables: [],
          color: "bg-amber-200"
          }, {
          id: "Finalizado",
          dragables: [],
          color: "bg-green-200"
          }
        ];
        for (let i=0; i<detalles.compromisos.length; i++) {
          const c = detalles.compromisos[i];
          initialContainers[c.estado-1].dragables.push({
            "id": "dragable-" + i,
            "content": c.compromiso
          })
        }
        console.log(initialContainers);

        setContainers(JSON.parse(JSON.stringify(initialContainers)));
        setDragables(detalles.compromisos.length);
      }
    
  }

  useEffect(() => {
    fetchResultadosYCompromisos();
  }, [])

  useEffect(() => {
    console.log(event);
  }, [event])

  // Para no agregar vacios
  function agregarCompromiso() {
    if (input.trim() === "") {
      setInputError(true);
      return;
    }
  
    const dragable = {
      id: "dragable-" + dragables,
      content: input,
    };
  
    const containersCopy = JSON.parse(JSON.stringify(containers));
    containersCopy[0].dragables.push(dragable);
    setContainers(containersCopy);
    setDragables(dragables + 1);
    onOpenChange(false);
    setInput("");
    setInputError(false); // Reset the error state
  }
  
  
  // Para editar y eliminar
  const handleEdit = (id, content) => {
    setEditId(id);
    setEditInput(content);
    onEditOpen();
  }

  const saveEdit = () => {
    const containersCopy = JSON.parse(JSON.stringify(containers));
    containersCopy.forEach(container => {
      container.dragables.forEach(dragable => {
        if(dragable.id === editId) {
          dragable.content = editInput;
        }
      })
    });
    setContainers(containersCopy);
    onEditOpenChange(false);
  }

  const deleteCompromiso = (id) => {
    const containersCopy = JSON.parse(JSON.stringify(containers));
    containersCopy.forEach(container => {
      container.dragables = container.dragables.filter(dragable => dragable.id !== id);
    });
    setContainers(containersCopy);
  }
  // Para editar y eliminar
  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setInputError(""); // Clear error message
    }
  };

  async function handleSave() {
    if(guardando)
      return;
    setGuardando(true);

    const detalle = await detalleCita(event.id, session.accessToken);

    const comprometidoArr = containers[0].dragables.map((dragable) => {
      return {
        "tipo": "Comprometido",
        "descripcion": dragable.content
      }
    })
    const EjecucionArr = containers[1].dragables.map((dragable) => {
      return {
        "tipo": "Ejecución",
        "descripcion": dragable.content
      }
    })
    const finalizadoArr = containers[2].dragables.map((dragable) => {
      return {
        "tipo": "Finalizado",
        "descripcion": dragable.content
      }
    })

    const payload = {
      "idSesionCita": event.id,
      "resultados": {
        "asistencia": tutoriaGrupal ? detalle.alumnos.map((alumno, index) => {
          return {
            fid_alumno: alumno.idAlumno,
            asistio: asistenciaContext[index]
          }
        }) : detalle.alumnos.map((alumno) => {
          return {
            fid_alumno: alumno.idAlumno,
            asistio: asistencia
          }
        }),
        "es_derivado": false,
        "detalleResultado": resultado,
      },
      "compromisos": comprometidoArr.concat(EjecucionArr).concat(finalizadoArr),
    };

    console.log("PAYLOAD: ", payload);

    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    const data = await fetchAPI({
      endpoint: `/resultadoCita/registrar/`,
      method: 'POST',
      token: session.accessToken,
      payload: payload,
      successMessage: 'Resultados y compromisos guardados con exito',
      errorMessage: 'Ocurrió un error al registrar los resultados y compromisos',
      showToast: true
    });
    console.log(data)
    if (data && data.message == "Resultados de la cita registrados con éxito") {
      setGuardando(false);
      if(event?.fromAlumnosAsignados)
        setActiveComponentById('detalleAlumnoAsignado', `Detalle de Alumno Asignado`);
      else {
        setMode("visualizarCitas");
        setActiveComponentById('citasTutor', `Citas`);
      }
    }
  }

  function handleCancel() {
    if(event?.fromAlumnosAsignados)
      setActiveComponentById('detalleAlumnoAsignado', `Detalle de Alumno Asignado`);
    else {
      setMode("visualizarCitas");
      setActiveComponentById('calendarioTutor', `Citas`);
    }
  }

  function formatTime(time) {
    console.log("TIME: ", time);
/*     if(typeof(time)!==Array)return; */
    const [hours, minutes] = time.split(':');
    let period = 'am';
    let hour = parseInt(hours, 10);

    if (hour >= 12){
      period = 'pm';
      if (hour > 12){
        hour -= 12; 
      }
    } else if (hour === 0){
      hour= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  function handleDragEnd(event) {
    const {active, over} = event;
    console.log("END")
    console.log(event)
    if (over) {
      // Copia profunda
      const containersCopy = JSON.parse(JSON.stringify(containers));
      const containerStart = containersCopy.find((container) =>
        (container.dragables.find((dragable) => dragable.id == active.id) != undefined));
      // Se guarda el dragable
      const dragable = containerStart.dragables.find((dragable) => dragable.id == active.id);
      // Se quita el drag del contenedor
      const index = containerStart.dragables.map((dragable) => dragable.id).indexOf(active.id);
      containerStart.dragables.splice(index, 1);
      containerStart.active = false;
      // Contenedor donde termina el drag
      const containerEnd = containersCopy.find((container) => container.id == over.id);
      // Se agrega el drag al contenedor
      containerEnd.dragables.push(dragable);
      // Se actualiza containers
      setContainers(containersCopy)
    }
  }

  function verHistoricoDeCalificaciones() {
    setActiveComponentById('verHistoricoNotas',`Histórico de Calificaciones de ${alumno.nombres + ' ' + alumno.primerApellido}`)
  }

  function derivarAOtraUnidad() {

    console.log(detalleDerivacion);
    if(event.alumnos.length === 1 ){
      event.alumnos[0].tipoTutoria = event.nombreTipoTutoria
      addDerivacion(detalleDerivacion)
    }

    setActiveComponentById('derivacionAlumno', 'Derivación a otra unidad académica');
  }

  function registrarAsistencia() {
    setActiveComponentById('asistenciaCitaGrupal', 'Registro de asistencia');
  }
  console.log(event.alumnos)
  
  return (
  <div className='w-full py-4 flex flex-col gap-8 p-4 justify-center overflow-y-auto'>
    <div className='w-full py-4 flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row w-full gap-2 justify-between'>
        <div>
          {event.tipoTutoria ? event.tipoTutoria : event.nombreTipoTutoria ? event.nombreTipoTutoria : "Sin titulo"}
        </div>
        {
          tutoriaGrupal ?
          (
          <Button className='w-fit' color='primary' onPress={registrarAsistencia}>
            Registrar asistencia
          </Button>
          )
          :
          (
          <Checkbox 
            isSelected={asistencia}
            color="primary"
            onChange={(e) => setAsistencia(e.target.checked)}
          >
            Alumno asistió
          </Checkbox>
          )
        }
      </div>
      <div className='flex flex-row w-full gap-4 justify-start'>
        <CardAttribute
          className={"w-auto"}
          icon={<Calendar size={20} />} 
          text={event&&event.start?((new Date(event.start)).toLocaleDateString()):/* event.fechaCita?formatDateToISO(event.fechaCita): */null} />

        <CardAttribute
          className={"w-auto"}
          icon={<Clock8 size={20} />} 
          text={event&&event.start&&event.end?((new Date(event.start)).toLocaleTimeString() + " - " + (new Date(event.end)).toLocaleTimeString()):/* (event.horaInicio&&event.horaFin?`${event.horaInicio} - ${event.horaFin}`: */null} />
        <CardAttribute
          className={"w-auto"}
          icon={<MapPin size={20} />}
          text={event&&event.ubicacion?(event.ubicacion):null}
        />
        <CardAttribute
          className={"w-auto"}
          icon={<CircleUser size={20} />} 
          text={event?(
            tutoriaGrupal ?
            "Tutoría grupal" :
            (event && event.alumnos && event.alumnos.length==1 && event.alumnos[0].nombres? event.alumnos[0].nombres + " " + event.alumnos[0].primerApellido + (event.alumnos[0].segundoApellido?" " + event.alumnos[0].segundoApellido:"") :
              event && event.alumnos && event.alumnos.length==1 && event.alumnos[0].nombreAlumno ? event.alumnos[0].nombreAlumno + " " + event.alumnos[0].primerApellido + (event.alumnos[0].segundoApellido?" " + event.alumnos[0].segundoApellido:"")
              :null)
          ):null} />
      </div>

    </div>

      <div className="w-full flex flex-col gap-4">
      <div className="text-lg">
        Resultados
        </div>
        <Textarea
          label="Resultados"
          placeholder="Ingrese los resultados..."
          className="w-full"
          value={resultado}
          onValueChange={setResultado}
        />
      </div>
 
      {
        tutoriaGrupal ?
        (<></>)
        :
        (
          <div className="w-full flex flex-row justify-start gap-4">
          <Button className='w-fit' isDisabled={!fileData} color='primary' startContent={<FileCheck size={20}/>} onPress={verHistoricoDeCalificaciones}>
            Histórico de calificaciones
          </Button>
          <Button className='w-fit' color='primary' startContent={<Send size={20}/>} onPress={derivarAOtraUnidad}>
            Derivar a otra unidad
          </Button>
        </div>
        )
      }

      {
        tutoriaGrupal ?
        (
          <></>
        )
        :
        (
          <div className="w-full flex flex-col">
          <div className="w-full flex flex-row justify-between">
            <div className="text-lg">
              Compromisos
            </div>
            <Button className="w-fit" color="primary" startContent={<CirclePlus size={20}/>} onPress={onOpen}>
            </Button>
          </div>
  
          <div className="w-full flex flex-row justify-between">
          <DndContext onDragEnd={handleDragEnd}>
            {containers.map((container, key) => (
              <div key={key} className="w-1/3 py-4 flex flex-col gap-4 p-4 ">
                <div>{container.id}</div>
                <Droppable id={container.id} color={container.color}>
                  {container.dragables.map((dragable, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Draggable id={dragable.id}>{dragable.content}</Draggable>
                      <div className="flex items-center">
                        <Tooltip content="Editar" placement="top">
                          <Edit
                            className="mr-2 cursor-pointer"
                            size={20}
                            color="#008000"
                            onClick={() => handleEdit(dragable.id, dragable.content)}
                          />
                        </Tooltip>
                        <Tooltip content="Borrar" placement="top" >
                          <Trash2
                            className="cursor-pointer"
                            size={20}
                            color="#ff4545"
                            onClick={() => deleteCompromiso(dragable.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </Droppable>
              </div>
            ))}
          </DndContext>

          </div>
          </div>
        )
      }

      <div className='w-full flex flex-row justify-center gap-[16px]'>
      <Button onClick={handleSave} className='bg-[#008000] text-white w-1/4'>
        Guardar
      </Button>
      <Button onClick={handleCancel} className='bg-[#FF4545] text-white w-1/4'>
        Cancelar
      </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar nuevo compromiso</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Ingrese el nuevo compromiso"
                  value={input}
                  onValueChange={setInput}
                  errorMessage={inputError ? "Este campo no puede estar vacío" : ""}
                  isInvalid={inputError}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={agregarCompromiso} className="bg-[#008000] text-white w-1/2">
                  Agregar
                </Button>
                <Button
                  onPress={() => {
                    onClose();
                    setInputError(false); // Reset the error state on cancel
                  }}
                  className="bg-[#FF4545] text-white w-1/2"
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar compromiso</ModalHeader>
              <ModalBody>
                <Input
                  type="text" 
                  label="Editar compromiso"
                  value={editInput}
                  onValueChange={setEditInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={saveEdit} className='bg-[#008000] text-white w-1/2'>
                  Guardar
                </Button>
                <Button onPress={onClose} className='bg-[#FF4545] text-white w-1/2'>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
      </ModalContent>
    </Modal>


    </div>
  )
}
