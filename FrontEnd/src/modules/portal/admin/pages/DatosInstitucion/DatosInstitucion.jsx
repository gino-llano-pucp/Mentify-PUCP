import { Button, Input } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import LogoSection from './LogoSection';
import fetchAPI from '@/modules/core/services/apiService';
import LogoInstitucion from './LogoInstitucion';
import { useInstitucion } from '@/modules/core/states/InstitutionContext';

const DatosInstitucion = ({ session }) => {
    const [formValues, setFormValues] = useState({
        nombre: '',
        siglas: '',
        foto: null,
    });

    const [errors, setErrors] = useState({});
    const { institucion, setInstitucion } = useInstitucion();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchInstitucionData = async () => {
          if (!session || !session.accessToken) {
            console.log('No session or token available');
            return;
          }
    
          try {
            const data = await fetchAPI({
              endpoint: '/institucion/',
              method: 'GET',
              token: session.accessToken,
              successMessage: 'Datos de la institución cargados correctamente',
              errorMessage: 'Error al cargar los datos de la institución',
              showToast: false
            });
    
            if (data) {
              setInstitucion(data);
            }
          } catch (error) {
            console.error('Error al cargar los datos de la institución:', error);
          }
        };
    
        fetchInstitucionData();
    }, []);

    const validateNombre = (value) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s.]+$/;
        if (!value) {
            return 'El nombre es requerido';
        } else if (value.length < 3) {
            return 'El nombre debe tener al menos 3 caracteres';
        } else if (value.length > 50) {
            return 'El nombre no debe exceder los 50 caracteres';
        } else if (!regex.test(value)) {
            return 'El nombre solo puede contener letras y espacios';
        }
        return '';
    };

    const validateSiglas = (value) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/;
        if (!value) {
            return 'Las siglas son requeridas';
        } else if (value.length < 2) {
            return 'Las siglas deben tener al menos 2 caracteres';
        } else if (value.length > 10) {
            return 'Las siglas no deben exceder los 10 caracteres';
        } else if (!regex.test(value)) {
            return 'Las siglas solo pueden contener letras';
        }
        return '';
    };

    const validateFoto = (file) => {
        if (!file) {
            return 'La foto es requerida';
        }
        const validFormats = ['image/jpeg', 'image/png'];
        if (!validFormats.includes(file.type)) {
            return 'Formato de foto no válido. Solo se permiten JPEG y PNG.';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleFileChange = (file) => {
        console.log("file data: ", file);
        setFormValues({
            ...formValues,
            foto: file,
        });
    };

    // Función para convertir una imagen a base64
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Obtener solo la parte base64
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        const nombreError = validateNombre(formValues.nombre);
        const siglasError = validateSiglas(formValues.siglas);
        const fotoError = validateFoto(formValues.foto);

        if (nombreError || siglasError || fotoError) {
            setErrors({
                nombre: nombreError,
                siglas: siglasError,
                foto: fotoError,
            });
            return;
        }

        try {
            // Convertir la imagen a base64
            const fotoBase64 = await convertImageToBase64(formValues.foto);
            const updatedFormValues = { ...formValues, foto: fotoBase64 };

            const response = await fetchAPI({
                endpoint: `/institucion/1`,
                method: 'PUT',
                token: session.accessToken,
                payload: updatedFormValues,
                successMessage: 'Datos de la institución actualizados con éxito',
                errorMessage: 'Error al actualizar los datos de la institución',
                showToast: true,
            });
            console.log('Response:', response);

            // Actualizar el estado de la institución con los nuevos datos
            setInstitucion({
                ...institucion,
                nombre: updatedFormValues.nombre,
                siglas: updatedFormValues.siglas,
                logo: updatedFormValues.foto
            });

            setFormValues({});
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar los datos de la institución:', error);
        }
    };

    return (
        <>
            {!isEditing && institucion ? (
                <>
                    <div className='flex flex-row gap-4 items-center'>
                        <LogoInstitucion
                            image={institucion?.logo ? `data:image/jpeg;base64,${institucion?.logo}` : null}
                        />
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-wrap gap-1'>
                                <span className='font-bold text-lg'>Nombre:</span>
                                <h3 className='font-medium text-lg'>{institucion?.nombre}</h3>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                                <span className='font-medium'>Siglas:</span>
                                <span>{institucion?.siglas}</span>
                            </div>
                        </div>
                    </div>
                    <Button className='mt-4' color='primary' variant='solid' onPress={() => setIsEditing(true)}>
                        Editar Datos
                    </Button>
                </>
            ) : (
                <div className='w-full flex flex-wrap gap-8'>
                    <div className='w-1/3 flex flex-col gap-4'>
                        <h3 className='text-lg font-bold'>{institucion ? 'Editar datos de institución' : 'Agregar datos de institución'}</h3>
                        <div className='flex flex-col gap-2'>
                            <h3 className='text-base font-bold'>Nombre</h3>
                            <div className='h-16'>
                                <Input
                                    size="md"
                                    type="text"
                                    name="nombre"
                                    placeholder="Ingrese el nombre de la institución"
                                    value={formValues.nombre}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.nombre}
                                    errorMessage={errors.nombre}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h3 className='text-base font-bold'>Siglas</h3>
                            <div className='h-16'>
                                <Input
                                    size="md"
                                    type="text"
                                    name="siglas"
                                    placeholder="Ingrese las siglas de la institución"
                                    value={formValues.siglas}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.siglas}
                                    errorMessage={errors.siglas}
                                />
                            </div>
                        </div>
                        <LogoSection
                            foto={formValues.foto}
                            onFileChange={handleFileChange}
                            error={errors.foto}
                        />
                        <div className='flex justify-end gap-2 mt-12'>
                            {institucion && (
                                <Button color='default' variant='ghost' onPress={() => setIsEditing(false)}>
                                    Cancelar
                                </Button>
                            )}
                            <Button color='primary' variant='solid' onPress={handleSubmit}>
                                Guardar cambios
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
        
    );
}

export default DatosInstitucion;
