import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDerivacion } from '../states/DerivacionContext';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import { Book, CircleHelp, Hash, Library, Mail } from 'lucide-react';

import FilterServicioDerivar from '../components/FilterServicioDerivar';
import { Button, Textarea, Tooltip } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';

const DerivacionAlumnos = ({session}) => {

  const [derivacionForms, setDerivacion] = useState({
    motivoDerivacion: '',
    antecedentes: '',
    comentarios: '',
    idAlumno: '',
    idTutor: '',
    tipoTutoria: '',
    unidadAcademica: '',
    idCita: '',
    facultad: ''
  });
  
  const {derivacion, addDerivacion} = useDerivacion();

  const [statusFilterEstado, setStatusFilterEstado] = useState(undefined);
  const [isUnidadDerivarInvalid, setUnidadDerivarIsInvalid] = useState(false);
  const [isMotivoInvalid, setMotivoIsInvalid] = useState(false);
  const [isAntecedentesInvalid, setAntecedentesIsInvalid] = useState(false);
  const { setActiveComponentById } = useActiveComponent();
  const [selectedKeys, setSelectedKeys] = useState(new Set(['Seleccione la unidad académica a derivar']));
  const [puedoEditar, setPuedoEditar] = useState(false);
  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsValid) => {
    setIsValid(false);
    setDerivacion((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

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
          idCita: derivacion.idCita
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
        setDerivacion({
          motivoDerivacion: data.data.motivoDerivacion,
          antecedentes: data.data.antecedentes,
          comentarios: data.data.comentarios === null ? '' : data.data.comentarios,
          idAlumno: data.data.datosAlumno.id_usuario,
          idTutor: data.data.datosTutor.id_usuario,
          tipoTutoria: data.data.datosTipoTutoria.id_tipoTutoria,
          unidadAcademica: data.data.datosUnidadAcademica.nombre,
          idCita: data.data.idCita
        })
        setSelectedKeys(new Set([data.data.datosUnidadAcademica.nombre]));
        setPuedoEditar(false)
        

      }else if(data.message) { 
        // Me deja editar
        setPuedoEditar(true)
      }

    } catch (error) {
      console.log(error);
      setPuedoEditar(true);
    }
  }

  useEffect(() => {
    fetchDerivacion();  
  }, [])

  const submitForm = async () => {
    let motivo = false, antecedentes = false, unidad = false;

    if (derivacionForms.motivoDerivacion === '') {
      setMotivoIsInvalid(true);
      motivo = true;
    } else {
      setMotivoIsInvalid(false);
    }

    if (derivacionForms.antecedentes === '') {
      setAntecedentesIsInvalid(true);
      antecedentes = true;
    } else {
      setAntecedentesIsInvalid(false);
    }

    console.log(statusFilterEstado);
    if (statusFilterEstado === 'Seleccione la unidad académica a derivar') {
      setUnidadDerivarIsInvalid(true);
      unidad = true;
      console.log('aqui llegueee')
    } else {
      derivacionForms.unidadAcademica = statusFilterEstado;
      setUnidadDerivarIsInvalid(false);
    }

    console.log(derivacion);

    derivacionForms.idAlumno = derivacion.alumnos[0].idAlumno;
    derivacionForms.idTutor = derivacion.tutor.idTutor;
    derivacionForms.tipoTutoria = derivacion.idTipoDeTutoria;
    derivacionForms.idCita = derivacion.idCita;
    derivacionForms.comentarios = derivacionForms.comentarios === '' ? null : derivacionForms.comentarios;
    derivacionForms.facultad = derivacion.alumnos[0].programaOFacultad;

    if (unidad) {
      throw new Error('Por favor, seleccione la unidad académica a derivar');
    }

    if (motivo || antecedentes) {
      throw new Error('Por favor, rellene los campos obligatorios');
    }

    try {
      console.log('Derivacion: ', derivacionForms);

      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
          throw new Error("Token Invalido");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/registrar-derivacion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          motivoDerivacion: derivacionForms.motivoDerivacion,
          antecedentes: derivacionForms.antecedentes,
          comentarios: derivacionForms.comentarios,
          idAlumno: derivacionForms.idAlumno,
          idTutor: derivacionForms.idTutor,
          tipoTutoria: derivacionForms.tipoTutoria, 
          unidadAcademica: derivacionForms.unidadAcademica,
          idCita: derivacionForms.idCita,
          facultad: derivacionForms.facultad
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
        error: (error) => error.message === 'Por favor, seleccione la unidad académica a derivar' ? 'Error al derivar al alumno: Debe seleccionar la unidad académica a derivar' : 'Por favor, rellene los campos obligatorios' ? 'Error al derivar al alumno: Debe llenar los campos obligatorios' : 'El alumno ya fue derivado' ? 'Error al derivar al alumno: El alumno ya fue derivado' : 'Error al derivar al alumno'
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
      <div className='w-full py-4 flex flex-col gap-4 p-4 border rounded-xl card-content'>
        <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
          <h3 className='w-[500px] text-lg font-semibold break-words'>
            {derivacion.alumnos[0].nombres+ ' ' + derivacion.alumnos[0].primerApellido + ' ' + derivacion.alumnos[0].segundoApellido}
          </h3>
        </div>
        <div className='flex flex-row w-full justify-between'>
          <CardAttribute
            icon={<Hash size={20} />} 
            text={derivacion.alumnos[0].codigo} />
          <CardAttribute
            icon={<Mail size={20} />}
            text={derivacion.alumnos[0].email}
          />
          <CardAttribute
            icon={<Library size={20} />} 
            text={derivacion.nombreTipoDeTutoria} />
          <CardAttribute
            icon={<Book size={20} />} 
            text={derivacion.alumnos[0].programaOFacultad} />
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

        <FilterServicioDerivar setStatusFilter={setStatusFilterEstado} setSelectedKeys={setSelectedKeys} selectedKeys={selectedKeys} puedoEditar={puedoEditar} session={session}/>
      </div>

      <div className='flex flex-col w-full mt-4'>
        <span className='text-lg font-semibold'>
          Motivo de derivación<span style={{color: '#FF4545'}}>*</span>
        </span>
        <div className='h-36'>
          <Textarea
            isReadOnly={!puedoEditar}
            variant="bordered"
            placeholder='Ingresa el motivo de derivación . . .'
            onChange={(e) => handleChange('motivoDerivacion', e.target.value, setMotivoIsInvalid)}
            className="max-w-full"
            minRows={5}
            maxRows={5}
            isRequired={false}
            errorMessage='Este campo es obligatorio'
            isInvalid={isMotivoInvalid}
            value={derivacionForms.motivoDerivacion}
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
            isReadOnly={!puedoEditar}
            variant="bordered"
            placeholder='Ingresa los antecendentes de importancia relevantes para su derivación . . .'
            onChange={(e) => handleChange('antecedentes', e.target.value, setAntecedentesIsInvalid)}
            className="max-w-full"
            maxLength={500}
            errorMessage='Este campo es obligatorio'
            isInvalid={isAntecedentesInvalid}
            value={derivacionForms.antecedentes}
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
            isReadOnly={!puedoEditar}
            variant="bordered"
            placeholder='Ingresa los comentarios o sugerencias pertinentes . . .'
            value={derivacionForms.comentarios}
            className="max-w-full"
            maxLength={500}
            minRows={5}
            maxRows={5}
            onChange={(e) => handleChange('comentarios', e.target.value, () => {})}
            isRequired={false}
          />
        </div>
      </div>

      {puedoEditar && <div className='flex justify-center items-center space-x-4 mt-auto px-2 py-2'>
        <Button className='bg-[#008000] text-white w-44'    variant='solid'
        onClick={handleClick}
        >
          Derivar
        </Button>
        <Button className='bg-[#FF4545] text-white w-44' variant='solid'
          onClick={() => {
            setActiveComponentById('resultadosDeCita', 'Resultados y compromisos'); // ( id , title )
          }}  
        >
          Regresar
        </Button>
      </div>}
    </div>
  )
};

export default DerivacionAlumnos;