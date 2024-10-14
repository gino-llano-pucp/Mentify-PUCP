'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Radio, 
  RadioGroup,
  Tooltip
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { Pencil } from 'lucide-react';

export default function EditTutoringType({tutoringType, update, page, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = useState({
    nombre: tutoringType.nombreTutoria,
    id_tipo_obligatoriedad: tutoringType.obligatoriedad === 'Obligatorio' ? '1' : '2',
    id_tipo_permanencia: tutoringType.duracion === 'Permanente' ? '1' : '2',
    id_tipo_tutor: tutoringType.tipoTutor === null ? '0' : tutoringType.tipoTutor === 'Variable' ? '1' : '2',
    id_tipo_formato: tutoringType.formato === 'Individual' ? '1' : '2'
  });
  const [isNameInvalid, setNameIsInvalid] = useState(false);
  const [isOblInvalid, setOblIsInvalid] = useState(false);
  const [isTiTutorInvalid, setTiTutorInvalid] = useState(false);
  const [isDurInvalid, setDurInvalid] = useState(false);
  const [isFormatInvalid, setFormatInvalid] = useState(false);

  const [isTutorDisabled, setTutorDisabled] = useState(type.id_tipo_formato === '2' ? true : false);

  const clearName = () => {
    setNameIsInvalid(false);
    setType((prev) => ({ ...prev, nombre: '' }));
  };

  useEffect(() => {
    setType({
      nombre: tutoringType.nombreTutoria,
      id_tipo_obligatoriedad: tutoringType.obligatoriedad === 'Obligatorio' ? '1' : '2',
      id_tipo_permanencia: tutoringType.duracion === 'Permanente' ? '1' : '2',
      id_tipo_tutor: tutoringType.tipoTutor === null ? '0' : tutoringType.tipoTutor === 'Variable' ? '1' : '2',
      id_tipo_formato: tutoringType.formato === 'Individual' ? '1' : '2'
    });
    setTutorDisabled(tutoringType.formato === 'Grupal' ? true : false);
    setNameIsInvalid(false);
    setOblIsInvalid(false);
    setTiTutorInvalid(false);
    setDurInvalid(false);
    setFormatInvalid(false);
  }, [isOpen]);

  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsValid) => {
    setIsValid(false);
    setType((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleChangeTipoFormato = (field, value, setIsInvalid) => {
    if (value === '2'){
      setTutorDisabled(true);
      setType((prevState) => ({
        ...prevState,
        id_tipo_tutor: 0,
        [field]: value
      }));
    } else {
      setTutorDisabled(false);
      setType((prevState) => ({
        ...prevState,
        id_tipo_tutor: 0,
        [field]: value
      }));
    }
    setIsInvalid(false);
  };

  const control = { ignore: ' ' };

  function capitalizeWords(str) {
    // Divide la cadena en palabras
    const words = str.split(' ');

    // Capitaliza la primera letra de cada palabra
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Une las palabras capitalizadas en una sola cadena
    return capitalizedWords.join(' ');
  }

  const submitForm = async () => {
    console.log(type.id_tipo_tutor)
    if(tutoringType.nombreTutoria === type.nombre && (tutoringType.obligatoriedad === 'Obligatorio' ? '1' : '2') === type.id_tipo_obligatoriedad &&
      (tutoringType.duracion === 'Permanente' ? '1' : '2') === type.id_tipo_permanencia &&
      (tutoringType.tipoTutor === null ? '0' : (tutoringType.tipoTutor === 'Variable' ? '1' : '2')) === type.id_tipo_tutor &&
      (tutoringType.formato === 'Individual' ? '1' : '2') === type.id_tipo_formato
    ){
      onOpenChange(false);
      return;
    }
    
    let name = false, oblig = false, tiTutor = false, format = false, duration = false;
    if (type.nombre.length === 0 || !validator.isAlpha(type.nombre, 'es-ES', control)) {
      setNameIsInvalid(true);
      name = true;
    } else {
      setNameIsInvalid(false);
    }
    if (type.id_tipo_obligatoriedad === 0) {
      setOblIsInvalid(true);
      oblig = true;
    } else {
      setOblIsInvalid(false);
    }
    if (type.id_tipo_permanencia === 0) {
      setDurInvalid(true);
      duration = true;
    } else {
      setDurInvalid(false);
    }
    if (type.id_tipo_formato === 0) {
      setFormatInvalid(true);
      format = true;
    } else {
      setFormatInvalid(false);
    }
    if (type.id_tipo_tutor === 0 && !isTutorDisabled) {
      setTiTutorInvalid(true);
      tiTutor = true;
    } else {
      setTiTutorInvalid(false);
    }
    if (name || oblig || duration || format || tiTutor) {
      throw new Error("Campos no validos");
    }

    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error("Token no valido");
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/${tutoringType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: type.nombre,
          fid_tipoObligatoriedad: parseInt(type.id_tipo_obligatoriedad),
          fid_tipoPermanencia: parseInt(type.id_tipo_permanencia),
          fid_tipoTutor: type.id_tipo_tutor === 0 ? null : parseInt(type.id_tipo_tutor),
          fid_tipoFormato: parseInt(type.id_tipo_formato)
        })
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error.message || 'Error en fetch');
      }
      update(page,filtro)
      onOpenChange(false);
    } catch (error) {
      throw new Error(error.message || 'Error al enviar el formulario');
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Editando Tipo Tutoría...',
          success: 'Tipo Tutoría actualizado con éxito',
          error: (error) => error.message || 'Error al actualizar tipo de tutoría'
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
      .then(async (response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Failed to post render request: ', error);
      });
  };

  return (
    <div onClick={(event) => {event.stopPropagation();}}>
      <Tooltip content='Editar Tipo de Tutoría' color='foreground' closeDelay={100}>
        <Button
          isIconOnly
          color='default'
          variant='light'
          aria-label='Editar tipo de tutoría'
          onClick={onOpen}
        >
          <Pencil size={16} />
        </Button>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size='2xl'
      >
        <ModalContent>
        {(onClose) => (
            <>
          <ModalHeader className='flex flex-col gap-1'>Editar Tipo de Tutoría</ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-4'>
          <h2 className='agregar-facultad-header'>Datos del Tipo de Tutoría</h2>
          <div className='flex flex-wrap w-full gap-4'>
            <div className='w-full h-16'>
            <Input
              isClearable
              isRequired
              onClear={clearName}
              className='w-[415px]'
              type='text'
              label='Nombre'
              placeholder='Ingresa el nombre del tipo de tutoría'
              value={type.nombre}
              onChange={(e) => handleChange('nombre', e.target.value, setNameIsInvalid)}
              isInvalid={isNameInvalid}
              errorMessage='Debe ingresar el nombre del tipo de tutoría, solo se permiten letras.'
            />
          </div>
          <RadioGroup 
            isRequired 
            label="Obligatoriedad" 
            orientation="horizontal"
            value={type.id_tipo_obligatoriedad}
            onChange={(e) => handleChange('id_tipo_obligatoriedad', e.target.value, setOblIsInvalid)}
            isInvalid={isOblInvalid}
          >
            <div className='w-[300px] gap-4 border-3 border-gray-200 rounded-lg'>
              <div className='p-4 flex flex-row'>
                <div className='w-[150px]'>
                  <Radio value="1">
                    Obligatorio
                  </Radio>
                </div>
                <Radio value="2">
                  Opcional
                </Radio>
              </div>
            </div>
          </RadioGroup>
          <RadioGroup 
            isRequired 
            label="Formato" 
            orientation="horizontal"
            value={type.id_tipo_formato}
            onChange={(e) => handleChangeTipoFormato('id_tipo_formato', e.target.value, setFormatInvalid)}
            isInvalid={isFormatInvalid}
          >
            <div className='w-[300px] gap-4 border-3 border-gray-200 rounded-lg'>
            <div className='p-4 flex flex-row'>
              <div className='w-[150px]'>
                <Radio value="1">
                  Individual
                </Radio>
              </div>
              <Radio value="2">
                Grupal
              </Radio>
            </div>
            </div>
          </RadioGroup>
          <RadioGroup 
            isRequired = {!isTutorDisabled} 
            label="Tipo Tutor" 
            orientation="horizontal"
            value={type.id_tipo_tutor}
            onChange={(e) => handleChange('id_tipo_tutor', e.target.value, setTiTutorInvalid)}
            isInvalid={isTiTutorInvalid}
            isDisabled={isTutorDisabled}
          >
            <div className='w-[300px] gap-4 border-3 border-gray-200 rounded-lg'>
            <div className='p-4 flex flex-row'>
              <div className='w-[150px]'>
                <Radio value="1">
                  Variable
                </Radio>
              </div>
              <Radio value="2">
                Fijo
              </Radio>
            </div>
            </div>
          </RadioGroup>
          <RadioGroup 
            isRequired 
            label="Duración" 
            orientation="horizontal"
            value={type.id_tipo_permanencia}
            onChange={(e) => handleChange('id_tipo_permanencia', e.target.value, setDurInvalid)}
            isInvalid={isDurInvalid}
          >
            <div className='w-[300px] gap-4 border-3 border-gray-200 rounded-lg'>
            <div className='p-4 flex flex-row'>
              <div className='w-[150px]'>
                <Radio value="1">
                  Permanente
                </Radio>
              </div>
              <Radio value="2">
                Temporal
              </Radio>
            </div>
            </div>
          </RadioGroup>
          </div>
          </div>
          </ModalBody>
          <ModalFooter className='flex justify-center items-center'>
            <Button className='bg-[#008000] text-white w-full' variant='solid' onClick={handleClick}>
              Guardar
            </Button>
            <Button className='bg-[#FF4545] text-white w-full' variant='solid' onPress={() => {onClose();}}>
              Cancelar
            </Button>
          </ModalFooter>
          </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
