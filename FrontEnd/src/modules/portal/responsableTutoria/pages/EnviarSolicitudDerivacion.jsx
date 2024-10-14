import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import React, { useEffect, useState } from 'react';
import { useDerivacion } from '../states/SolicitudDerivacionContext';
import { CircleHelp } from 'lucide-react';
import { Button, Textarea, Tooltip } from '@nextui-org/react';
import FilterServicioDerivar from '../../tutor/components/FilterServicioDerivar';
import { AlumnoDerivacionCard } from '../components/AlumnoDerivacionCard';
import { TutorDerivacionCard } from '../components/TutorDerivacionCard';
import toast from 'react-hot-toast';

export default function EnviarSolicitudDerivacion({session}) {
    const { derivacion, addDerivacion } = useDerivacion();
    const { setActiveComponentById } = useActiveComponent();

    console.log(derivacion);

    console.log(session);

    const [statusFilterEstado, setStatusFilterEstado] = useState(undefined);
    const [selectedKeys, setSelectedKeys] = useState(new Set([derivacion.UnidadAcademica.nombre]));

    console.log(statusFilterEstado);

    const [estado, setEstado] = useState(false);

    const fetchDerivacion = async () => {
    
        try {
          const token = session?.accessToken;
          console.log('sess: ', session);
          if (!token) {
              throw new Error("Token Invalido");
          }
    
          console.log(derivacion);
    
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/obtener-derivacion-detalle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              idCita: derivacion.fid_cita
            })
          });
          
          const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta
    
          console.log(data);
          console.log(response);
    
          if (!response.ok) {
            if (response.status === 500) {
                console.log(data.error);
                throw new Error(data.error);
            } else {
                throw new Error(data.error || 'Error inesperado al derivar al alumno');
            }
          }
          
          if(data.data){
            //Llenado de data
            console.log(data.data.estado);

            if(data.data.estado === 'Pendiente'){
                setEstado(true);
            } else {
                setEstado(false);
            }
            setSelectedKeys(new Set([data.data.datosUnidadAcademica.nombre]));
          }
    
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(() => {
        fetchDerivacion();  
    }, [])

    const submitForm = async () => {
    
        try {
    
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
                throw new Error("Token Invalido");
            }
        
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/enviar-derivacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idDerivacion: derivacion.id_derivacion,
                    motivo: derivacion.motivo,
                    antecedentes: derivacion.antecedentes,
                    comentarios: derivacion.comentarios,

                    unidadAcademica: statusFilterEstado,

                    codigoAlumno: derivacion.Alumno.codigo,
                    correoAlumno: derivacion.Alumno.email,
                    nombreAlumno: derivacion.Alumno.nombres,
                    primerApellidoAlumno: derivacion.Alumno.primerApellido,
                    segundoApellidoAlumno: derivacion.Alumno.segundoApellido,

                    codigoTutor: derivacion.Tutor.codigo,
                    correoTutor: derivacion.Tutor.email,
                    nombreTutor: derivacion.Tutor.nombres,
                    primerApellidoTutor: derivacion.Tutor.primerApellido,
                    segundoApellidoTutor: derivacion.Tutor.segundoApellido,

                    facultad: derivacion.Facultad.nombre
                })
            });
    
            const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta
        
            console.log(data);
        
            if (!response.ok) {
                if (response.status === 409) {
                    console.log(data.error);
                    throw new Error(data.error);
                } else {
                    throw new Error(data.error || 'Error inesperado al derivar al alumno');
                }
            }
        
            fetchDerivacion();
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const handleClick = async () => {
        toast.promise(
          submitForm(),
          {
            loading: 'Derivando alumno...',
            success: 'Derivación enviada',
            error: 'Error al efectuar la derivación'
          },
          {
            style: {
              minWidth: '250px'
            }
          }
        ).then(async (response) => {
          console.log(response);
        }).catch((error) => {
          console.log('Failed to post render request: ', error);
        });
    }

    return(

        <div className='h-full flex flex-col'>
            <div className='flex flex-row gap-4 mb-4 w-full'>
                <div className='flex flex-grow gap-4 w-1/2'>
                    <TutorDerivacionCard tutor={derivacion.Tutor} />
                </div>
                
                <div className='flex flex-grow gap-4 w-1/2'>
                    <AlumnoDerivacionCard alumno={derivacion.Alumno} />
                </div>
            </div>
    
          <div className='flex flex-col basis-1/12 gap-1 mt-4'>
            <div className='flex flex-row items-center space-x-2'>
              <span className='text-lg font-semibold'>
                Unidad académica a derivar<span style={{color: '#FF4545'}}>*</span>
              </span>
              <Tooltip
                content="La solicitud de derivación pasará por un filtro previo por parte de Bienestar. Si la recomendación de derivación es pertinente, será enviada a la unidad académica correspondiente, caso contrario, se derivará a la unidad académica más adecuada."
                placement='bottom'
                showArrow
                classNames = {{
                  base: [
                    "before:bg-black dark:before:bg-white",
                  ],
                  content: [
                    "text-white bg-black border-0 max-w-60"
                  ]
                }}
              >
                <CircleHelp size={20}/>
              </Tooltip>
            </div>
    
            <FilterServicioDerivar setStatusFilter={setStatusFilterEstado} setSelectedKeys={setSelectedKeys} selectedKeys={selectedKeys} puedoEditar={estado} session={session}/>
          </div>
    
          <div className='flex flex-col w-full mt-4'>
            <span className='text-lg font-semibold'>
              Motivo de derivación<span style={{color: '#FF4545'}}>*</span>
            </span>
            <div className='h-36'>
              <Textarea
                isReadOnly={true}
                variant="bordered"
                className="max-w-full"
                minRows={5}
                maxRows={5}
                isRequired={false}
                value={derivacion.motivo}
              />
            </div>
          </div>
    
          <div className='flex flex-col w-full'>
            <div className='flex flex-row items-center space-x-2'>
              <span className='text-lg font-semibold'>
                Antecedentes de importancia (Según la información que se tenga)<span style={{color: '#FF4545'}}>*</span>
              </span>
              <Tooltip
                content="Pueden incluirse evaluaciones de ingreso, historia, fichas de seguimiento, asesorías, entre otros."
                placement='bottom'
                showArrow
                classNames = {{
                  base: [
                    "before:bg-black dark:before:bg-white",
                  ],
                  content: [
                    "text-white bg-black border-0 max-w-60"
                  ]
                }}
              >
                <CircleHelp size={20}/>
              </Tooltip>
            </div>
            <div className='h-36'>
              <Textarea
                isReadOnly={true}
                variant="bordered"
                className="max-w-full"
                maxLength={500}
                value={derivacion.antecedentes}
                minRows={5}
                maxRows={5}
                isRequired={false}
              />
            </div>
          </div>
    
          <div className='flex flex-col w-full'>
            <span className='text-lg font-semibold'>
              Comentarios o sugerencias (Si fuera el caso)
            </span>
            <div className='h-36'>
              <Textarea
                isReadOnly={true}
                variant="bordered"
                value={derivacion.comentarios === null ? 'No se ingresó ningún comentario' : derivacion.comentarios}
                className={`max-w-full ${derivacion.comentarios === null ? 'text-gray-500' : 'text-black'}`}
                maxLength={500}
                minRows={5}
                maxRows={5}
                isRequired={false}
              />
            </div>
          </div>
    
          {estado && <div className='flex justify-center items-center space-x-4 mt-auto px-2 py-2'>
            <Button className='bg-[#008000] text-white w-44'    variant='solid'
            onClick={handleClick}
            >
              Derivar
            </Button>
            <Button className='bg-[#FF4545] text-white w-44' variant='solid'
              onClick={() => {
                setActiveComponentById('responsableTutoria', 'Derivaciones de Tutoría'); // ( id , title )
              }}  
            >
              Regresar
            </Button>
          </div>}
        </div>
    )
}