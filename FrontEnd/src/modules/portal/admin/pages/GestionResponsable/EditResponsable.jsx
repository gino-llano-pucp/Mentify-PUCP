'use client';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Tooltip } from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import validator from 'validator';
import FacultadDerivacionDropdown from "../../components/FacultadDerivacionDropdown";
import { useFacultad } from "../../states/FacultadContext";

function EditResponsable({user, update, session}) {

    console.log(user);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [responsable, setResponsable] = useState({
        codigo: user.codigo,
        nombre: user.nombre,
        primerApellido: user.primerApellido,
        segundoApellido: user.segundoApellido,
        correo: user.correo,
        idFacultad: user.idFacultad
    });

    const [isCodeInvalid, setCodeIsInvalid] = useState(false); // Estado para validar el campo de código
    const [isNameInvalid, setNameIsInvalid] = useState(false);
    const [isLastName1Invalid, setLastName1IsInvalid] = useState(false);
    const [isLastName2Invalid, setLastName2IsInvalid] = useState(false);
    const [isEmailInvalid, setEmailIsInvalid] = useState(false);
    const [isFacultadSelected, setIsFacultadSelected] = useState(false);
    const { facultad } = useFacultad();

    useEffect(() => {
        if(isOpen){
            setResponsable({
                codigo: user.codigo,
                nombre: user.nombre,
                primerApellido: user.primerApellido,
                segundoApellido: user.segundoApellido,
                correo: user.correo,
                idFacultad: user.idFacultad
            });
        }
      }, [isOpen]);

    const clearCode = () => {
        setCodeIsInvalid(false);
        setResponsable((prev) => ({ ...prev, codigo: '' }));
    };
    const clearName = () => {
        setNameIsInvalid(false);
        setResponsable((prev) => ({ ...prev, nombre: '' }));
    };
    const clearPrimerApellidos = () => {
        setLastName1IsInvalid(false);
        setResponsable((prev) => ({ ...prev, primerApellido: '' }));
    };
    const clearSegundoApellidos = () => {
        setLastName2IsInvalid(false);
        setResponsable((prev) => ({ ...prev, segundoApellido: '' }));
    };
    const clearEmail = () => {
        setEmailIsInvalid(false);
        setResponsable((prev) => ({ ...prev, correo: '' }));
    };

    const clearFields = () => {
        setResponsable({
            codigo: user.codigo,
            nombre: user.nombre,
            primerApellido: user.primerApellido,
            segundoApellido: user.segundoApellido,
            correo: user.correo,
            idFacultad: user.idFacultad
        });
    };

    const handleChange = (field, value, setIsValid = null) => {
        console.log(value);
        if(setIsValid) setIsValid(false);
        setResponsable((prevState) => ({
          ...prevState,
          [field]: value
        }));
    };

    const handleChangeFacultad = (field, value, setIsValid) => {
        if (field !== 'fid_facultad') {
          setIsValid(false);
        }
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
        let code = false,
            name = false,
            last1 = false,
            last2 = false,
            email = false;
            
        //verificar que el codigo de alumno tenga 8 digitos
        if (responsable.codigo.length === 0 || responsable.codigo.length > 8) {
            setCodeIsInvalid(true); // Establecer como inválido si el código no tiene 8 dígitos
            code = true;
        } else {
            setCodeIsInvalid(false); // Establecer como válido si el código tiene 8 dígitos
        }

        //verificar que el nombre de alumno tenga caracteres y no tenga digitos
        if (responsable.nombre.length === 0 || !validator.isAlpha(responsable.nombre, 'es-ES', control)) {
            setNameIsInvalid(true);
            name = true;
        } else {
            setNameIsInvalid(false);
        }

        if (responsable.primerApellido.length === 0 || !validator.isAlpha(responsable.primerApellido, 'es-ES', control)) {
            setLastName1IsInvalid(true);
            last1 = true;
        } else {
            setLastName1IsInvalid(false);
        }

        if (responsable.segundoApellido.length > 0 && !validator.isAlpha(responsable.segundoApellido, 'es-ES', control)
        ) {
            setLastName2IsInvalid(true);
            last2 = true;
        } else {
            setLastName2IsInvalid(false);
        }

        if (responsable.correo.length !== 0 && validator.isEmail(responsable.correo)) {
            setEmailIsInvalid(false);
        } else {
            setEmailIsInvalid(true);
            email = true;
        }
        
        // Verificar si alguno de los campos es inválido
        if (code || name || last1 || last2 || email) {
            throw new Error("Campos no validos");
        }

        try {
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
                throw new Error("Token Invalido");
            }
            responsable.nombre = capitalizeWords(responsable.nombre);
            responsable.primerApellido = capitalizeWords(responsable.primerApellido);
            responsable.segundoApellido = capitalizeWords(responsable.segundoApellido);
            console.log(user.idFacultad);
            console.log(user.codigo);
            console.log(responsable);
            
            console.log(facultad);
            console.log(user);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/editar-responsable-tutoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigoNuevo: responsable.codigo,
                    codigo: user.codigo,
                    nombre: responsable.nombre,
                    primerApellido: responsable.primerApellido,
                    segundoApellido: responsable.segundoApellido,
                    correo: user.correo,
                    correoNuevo: responsable.correo,
                    idFacultad: responsable.idFacultad,
                    idFacultadNuevo: facultad
                })
            });

            const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta

            if (!response.ok) {
                if (response.status === 409) {
                    console.log(data.error);
                    throw new Error(data.error);
                } else {
                    throw new Error(data.error || 'Error inesperado al registrar responsable de tutoría');
                }
            }

            clearFields();
            update();
            onOpenChange(false);
        } catch (error) {
            throw error;
        }
    };

    const handleClick = async () => {
        toast.promise(
            submitForm(),
            {
                loading: 'Editando Responsable de Tutoría...',
                success: 'Responsable de Tutoría editado con éxito',
                error: (error) => error.message
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
            <Tooltip content='Editar Responsable' color='foreground' closeDelay={100}>
                <Button
                    isIconOnly
                    color='default'
                    variant='light'
                    aria-label='Editar Responsable'
                    onClick={onOpen}
                    >
                    <Pencil size={16} />
                </Button>
            </Tooltip>

            {isOpen && (
                <Modal
                    backdrop="blur"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    size='4xl'
                >
                    <ModalContent>
                        {(onClose) => (
                        <>
                        <ModalHeader className='flex flex-col gap-1'>
                            Editar Responsable de Tutoría
                        </ModalHeader>

                        <ModalBody>
                            <div className='flex flex-col gap-4'>

                                <h2 className='agregar-facultad-header'>
                                    Datos del Responsable
                                </h2>

                                <div className='flex flex-wrap w-full gap-4'>
                                    <div className='h-16'>
                                        <Input
                                        isClearable
                                        isRequired
                                        onClear={clearCode}
                                        className='w-[415px]'
                                        type='text'
                                        label='Código'
                                        placeholder='Ingresa el código del responsable de tutoría'
                                        value={responsable.codigo}
                                        onChange={(e) => handleChange('codigo', e.target.value, setCodeIsInvalid)}
                                        isInvalid={isCodeInvalid}
                                        errorMessage='El código ingresado debe ser numérico'
                                        />
                                    </div>
                                
                                    <div className='h-16'>
                                        <Input
                                        isClearable
                                        isRequired
                                        onClear={clearName}
                                        className='w-[415px]'
                                        type='text'
                                        label='Nombre'
                                        placeholder='Ingresa el nombre del responsable de tutoría'
                                        value={responsable.nombre}
                                        onChange={(e) => handleChange('nombre', e.target.value, setNameIsInvalid)}
                                        isInvalid={isNameInvalid}
                                        errorMessage='Debe ingresar el nombre del alumno'
                                        />
                                    </div>

                                    <div className='h-16'>
                                        <Input
                                        isClearable
                                        isRequired
                                        onClear={clearPrimerApellidos}
                                        className='w-[415px]'
                                        type='text'
                                        label='Primer Apellido'
                                        placeholder='Ingresa el primer apellido del responsable de tutoría'
                                        value={responsable.primerApellido}
                                        onChange={(e) => handleChange('primerApellido', e.target.value, setLastName1IsInvalid)}
                                        isInvalid={isLastName1Invalid}
                                        errorMessage='El campo no debe estar vacío y no debe contener dígitos'
                                        />
                                    </div>

                                    <div className='h-16'>
                                        <Input
                                        isClearable
                                        onClear={clearSegundoApellidos}
                                        className='w-[415px]'
                                        type='text'
                                        label='Segundo Apellido'
                                        placeholder='Ingresa el segundo apellido del responsable de tutoría'
                                        value={responsable.segundoApellido}
                                        onChange={(e) => handleChange('segundoApellido', e.target.value, setLastName2IsInvalid)}
                                        isInvalid={isLastName2Invalid}
                                        errorMessage='El campo no debe contener dígitos'
                                        />
                                    </div>

                                    <div className='h-20'>
                                        <Input
                                        isClearable
                                        isRequired
                                        onClear={clearEmail}
                                        className='w-[415px]'
                                        type='text'
                                        label='Correo electrónico'
                                        placeholder='Ingresa el correo electrónico del responsable de tutoría'
                                        value={responsable.correo}
                                        onChange={(e) => handleChange('correo', e.target.value, setEmailIsInvalid)}
                                        isInvalid={isEmailInvalid}
                                        errorMessage='El correo ingresado no es válido'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-wrap w-full gap-4'>
                                    <div className='w-[415px] flex flex-col gap-4'>
                                        <h2 className='agregar-facultad-header'>Datos de la Facultad</h2>
                                        <FacultadDerivacionDropdown
                                        facultad = {user.facultad}
                                        handleChange={handleChangeFacultad}
                                        isFacultadSelected={isFacultadSelected}
                                        setIsFacultadSelected={setIsFacultadSelected}
                                        session={session}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        
                        <ModalFooter className='flex flex-col w-full gap-4 md:flex-row justify-center items-center'>
                            <Button className='bg-[#008000] text-white w-40 h-9' variant='solid' onClick={handleClick}>
                                Guardar
                            </Button>
                            <Button className='bg-[#FF4545] text-white w-40 h-9' variant='solid' onPress={() => {clearFields(); onClose()}}>
                                Cancelar
                            </Button>
                        </ModalFooter>

                        </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}

export default EditResponsable;