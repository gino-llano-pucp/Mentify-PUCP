'use client';
import { 
    useDisclosure, 
    Button, 
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    ModalFooter
} from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { useFacultad } from '../../states/FacultadContext';
import FacultadDerivacionDropdown from '../../components/FacultadDerivacionDropdown';

const AddResponsable = ({update, session}) => {
    const [responsable, setReponsable] = useState({
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        correo: '',
        codigo: '',
        fid_facultad: ''
    });

    const [isCodeInvalid, setCodeIsInvalid] = useState(false); // Estado para validar el campo de código
    const [isNameInvalid, setNameIsInvalid] = useState(false);
    const [isLastName1Invalid, setLastName1IsInvalid] = useState(false);
    const [isLastName2Invalid, setLastName2IsInvalid] = useState(false);
    const [isEmailInvalid, setEmailIsInvalid] = useState(false);
    const [isFacultadSelected, setIsFacultadSelected] = useState(false);
    const { facultad } = useFacultad();
    console.log(facultad)
    const { clearFields } = useFacultad();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        setReponsable({
            nombre: '',
            primerApellido: '',
            segundoApellido: '',
            correo: '',
            codigo: '',
            fid_facultad: ''
        })
        setFlag(false);
      }, [isOpen]);

    const clearCode = () => {
        setCodeIsInvalid(false);
        setReponsable((prev) => ({ ...prev, codigo: '' }));
    };
    const clearName = () => {
        setNameIsInvalid(false);
        setReponsable((prev) => ({ ...prev, nombre: '' }));
    };
    const clearPrimerApellidos = () => {
        setLastName1IsInvalid(false);
        setReponsable((prev) => ({ ...prev, primerApellido: '' }));
    };
    const clearSegundoApellidos = () => {
        setLastName2IsInvalid(false);
        setReponsable((prev) => ({ ...prev, segundoApellido: '' }));
    };
    const clearEmail = () => {
        setEmailIsInvalid(false);
        setReponsable((prev) => ({ ...prev, correo: '' }));
    };

    function clearAllInvalidFields() {
        clearCode();
        clearName();
        clearPrimerApellidos();
        clearSegundoApellidos();
        clearEmail();
        clearFields();
    }

    const handleChange = (field, value, setIsValid = null) => {
        if(setIsValid) setIsValid(false);
        setReponsable((prevState) => ({
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

    // Poner los parametros en el async nos va a permitir  que los flags puedan estar actualizados
    const submitForm = async () => {
        let code = false,
            name = false,
            last1 = false,
            last2 = false,
            email = false;
            
        //verificar que el codigo de alumno tenga 8 digitos
        if (responsable.codigo.length > 8 || responsable.codigo.length === 0) {
            setCodeIsInvalid(true); // Establecer como inválido si el código es mayor a 8 dígitos
            code = true;
        } else {
            setCodeIsInvalid(false); // Establecer como válido si el código tiene 8 dígitos o menos
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

        console.log(facultad);

        if (facultad === null) {
            setFlag(false);
            toast.error('Debe elegir una facultad');
        }
        
        // Verificar si alguno de los campos es inválido
        if (code || name || last1 || last2 || email || facultad === null) {
            setFlag(false);
            throw new Error("Campos no validos");
        }

        try {
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
                setFlag(false);
                throw new Error("Token Invalido");
            }
            responsable.fid_facultad = facultad;
            responsable.nombre = capitalizeWords(responsable.nombre);
            responsable.primerApellido = capitalizeWords(responsable.primerApellido);
            responsable.segundoApellido = capitalizeWords(responsable.segundoApellido);
            console.log(responsable);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/registrar-responsable-tutoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigo: responsable.codigo,
                    nombre: responsable.nombre,
                    primerApellido: responsable.primerApellido,
                    segundoApellido: responsable.segundoApellido,
                    correo: responsable.correo,
                    idFacultad: responsable.fid_facultad
                })
            });

            const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta

            console.log(data);

            if (!response.ok) {
                if (response.status === 409) {
                    console.log(data.error);
                    setFlag(false);
                    throw new Error(data.error);
                } else {
                    setFlag(false);
                    throw new Error(data.error || 'Error inesperado al registrar responsable de tutoría');
                }
            }
            
            update();
            clearAllInvalidFields();
            onOpenChange(false);
        } catch (error) {
            setFlag(false);
            throw error;
        }
    };

    const handleClick = async () => {
        toast.promise(
            submitForm(),
            {
                loading: 'Agregando Responsable de Tutoría...',
                success: 'Responsable de Tutoría agregado con éxito',
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
            <Button
                color='primary'
                variant='shadow'
                className='flex items-center justify-center w-40'
                startContent={<CirclePlus size={20} />}
                onPress={onOpen}
            >
                Agregar
            </Button>

            {isOpen && (
                <Modal
                    backdrop="blur"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    size='4xl'
                    onClose={clearAllInvalidFields}
                >
                    <ModalContent>
                        {(onClose) => (
                        <>
                        <ModalHeader className='flex flex-col gap-1'>
                            Agregar Responsable
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
                            <Button className='bg-[#008000] text-white w-40 h-9' variant='solid'
                            onClick={()=>{
                                if(!flag){
                                    setFlag(true)
                                  }else
                                    return;
                                handleClick()
                                }}>
                                Agregar
                            </Button>
                            <Button className='bg-[#FF4545] text-white w-40 h-9' variant='solid' onPress={() => {clearAllInvalidFields(); onClose()}}>
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
};

export default AddResponsable;