import CardAttribute from "../../../admin/components/CardAttribute"
import { Calendar , Clock8 , CircleUser , MapPin } from 'lucide-react';
import {Checkbox} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useEventInfo } from "../../../tutor/states/EventContext";

import { Droppable } from "../../components/Droppable";

import fetchAPI from "@/modules/core/services/apiService";


export default function CompromisosDeCita({session}) {
  const {event, asistenciaContext, setAsistenciaContext} = useEventInfo();
  const [asistencia, setAsistencia] = useState(false);
  const [ esGrupal, setEsGrupal ] = useState(true);

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


  function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`; // Formato ISO
  }


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
    console.log(data)
    if (data && data.message == "Detalle de cita con éxito") {
        const {detalles} = data;

        if (0 < detalles.asistencias.length) {

          if (1 < detalles.asistencias.length) {
            for (let i=0; i<detalles.asistencias.length; i++) {
              if (detalles.asistencias[i].idAlumno == session.user.id) {
                setAsistencia(detalles.asistencias[i].asistio);
                break;
              }
            }
          } 
          else {
            setAsistencia(detalles.asistencias[0].asistio);
          }
        }

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
        setContainers(JSON.parse(JSON.stringify(initialContainers)));

        // Llamada a api para saber si es individual o grupal
        const data2 = await fetchAPI({
          endpoint: `/tipoTutoria/${detalles.idTipoDeTutoria}`,
          method: 'GET',
          token: session.accessToken,
          successMessage: '',
          errorMessage: '',
          showToast: false
        });
        if (data2) {
          console.log(data2);
          if (data2.fid_tipoFormato == 1)
            setEsGrupal(false);
        }
      }
    
  }

  useEffect(() => {
    fetchResultadosYCompromisos();
  }, [])

  useEffect(() => {
    console.log(event);
  }, [event])

  function formatTime(time) {
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


  return (
  <div className='w-full py-4 flex flex-col gap-8 p-4 justify-center overflow-y-auto'>
    <div className='w-full py-4 flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row w-full gap-2 justify-between'>
        <div>
          {event.tipoTutoria ? event.tipoTutoria : event.nombreTipoTutoria ? event.nombreTipoTutoria : "Sin titulo"}
        </div>
          <Checkbox 
            isSelected={asistencia}
            color="primary"
/*             onChange={(e) => setAsistencia(e.target.checked)} */
          >
            Alumno asistió
          </Checkbox>
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
          text={event?
            (event.tutor ? (event.tutor.nombres + " " + event.tutor.primerApellido + " " + event.tutor.segundoApellido) : null)
          :null} />
      </div>

    </div>

    {
      esGrupal ?
      (<></>)
      :
      (
        <div className="w-full flex flex-col">
      <div className="w-full flex flex-row justify-between">
        <div className="text-lg">
          Compromisos
        </div>
      </div>

      <div className="w-full flex flex-row justify-between">
{/*       <DndContext onDragEnd={handleDragEnd}> */}
        {
          containers.map((container, key) =>     
          <div key={key} className="w-1/3 py-4 flex flex-col gap-4 p-4 ">
            <div>
              {container.id}
            </div>
            <Droppable id={container.id} color={container.color}>
              {
              container.dragables.map((dragable, index) => 
/*                 <Draggable key={index} id={dragable.id} content={dragable.content} /> */
              <div
              key={index}
                className="border rounded-xl bg-white p-2"
              >
                {dragable.content}
              </div>
            )
              }
            </Droppable>
          </div>
          )
        }
{/*       </DndContext> */}
      </div>
      </div>
      )

    }
    </div>
  )
}
