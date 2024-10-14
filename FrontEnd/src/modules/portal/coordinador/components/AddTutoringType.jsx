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
  RadioGroup
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { CirclePlus } from 'lucide-react';

export default function AddTutoringType({update, page, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = useState({
    nombre: '',
    id_tipo_obligatoriedad: 0,
    id_tipo_permanencia: 0,
    id_tipo_tutor: 0,
    id_tipo_formato: 0
  });
  const [isNameInvalid, setNameIsInvalid] = useState(false);
  const [isOblInvalid, setOblIsInvalid] = useState(false);
  const [isTiTutorInvalid, setTiTutorInvalid] = useState(false);
  const [isDurInvalid, setDurInvalid] = useState(false);
  const [isFormatInvalid, setFormatInvalid] = useState(false);

  const [isTutorDisabled, setTutorDisabled] = useState(true);
  const [flag, setFlag] = useState(false);

  const clearAll = () => {
    setNameIsInvalid(false)
    setDurInvalid(false)
    setFormatInvalid(false)
    setOblIsInvalid(false)
    setTiTutorInvalid(false)
    setType({
      nombre: '',
      id_tipo_obligatoriedad: 0,
      id_tipo_permanencia: 0,
      id_tipo_tutor: 0,
      id_tipo_formato: 0
    })
    setFlag(false);
  }

  useEffect(() => {
    clearAll();
  }, [isOpen]);

  const clearName = () => {
    setNameIsInvalid(false);
    setType((prev) => ({ ...prev, nombre: '' }));
  };

  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsInvalid) => {
    setIsInvalid(false);
    setType((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  //handlechange para tipo formato
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

  const mapearValores = () => {
    const obligatoriedadMap = {
      1: '1',
      2: '2'
    };

    const formatoMap = {
      1: '1',
      2: '2'
    };

    const tipoTutorMap = {
      1: '1',
      2: '2'
    };

    const duracionMap = {
      1: '1',
      2: '2'
    };

    return {
      nombre: capitalizeWords(type.nombre),
      tipo_obligatoriedad: obligatoriedadMap[type.id_tipo_obligatoriedad],
      tipo_permanencia: duracionMap[type.id_tipo_permanencia],
      tipo_tutor: tipoTutorMap[type.id_tipo_tutor],
      tipo_formato: formatoMap[type.id_tipo_formato]
    };
  };

  const submitForm = async () => {
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
      setFlag(false);
      throw new Error("Campos no validos");
    }
    
    try {
      const token = session?.accessToken;
      if (!token) {
        setFlag(false)
        throw new Error("Token no valido");
      }
      const mappedValues = mapearValores();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mappedValues)
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'El tipo de tutoría ya existe'){
          setFlag(false)
          throw new Error(data.message);
        }
        setFlag(false)
        throw new Error("Error en fetch");
      }

      update(page,filtro);
      onOpenChange(false);
      clearAll()
    } catch (error) {
      setFlag(false)
      throw new Error(error.message || 'Error al enviar el formulario');
    }
  };
  
  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Agregando Tipo Tutoría...',
          success: 'Se agrego exitosamente el Tipo de Tutoría',
          error: (error) => error.message || 'Error al agregar tipo de tutoría'
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
    <div>
      <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center w-40'
        startContent={<CirclePlus size={20} />}
        onPress={onOpen}
      >
        Agregar
      </Button>
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
          <ModalHeader className='flex flex-col gap-1'>Agregar Tipo de Tutoría</ModalHeader>
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
                        <div className='flex flex-row p-4'>
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
                        <div className='flex flex-row p-4'>
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
                        <div className='flex flex-row p-4'>
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
                        <div className='flex flex-row p-4'>
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
          <ModalFooter className='flex items-center justify-center'>
            <Button className='bg-[#008000] text-white w-full' variant='solid' onClick={
              ()=>{
                if(!flag){
                  setFlag(true)
                }else
                  return;
                handleClick();
              }
              }>
              Agregar
            </Button>
            <Button className='bg-[#FF4545] text-white w-full' variant='solid' onPress={onClose}>
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
