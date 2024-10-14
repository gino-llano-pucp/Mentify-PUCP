'use client';
import { H4, Muted } from '@/modules/core/desing-system/typography';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react';
import { CloudUpload, File, Upload } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { parse } from 'csv-parse';
import { useUsers } from '../states/UsersContext';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { componentMapping } from '../lib/componentMapping';
import { useFacultad } from '@/modules/portal/admin/states/FacultadContext';
import { jwtDecode } from 'jwt-decode';
import { usePrograma } from '@/modules/portal/admin/states/ProgramaContext';
import validator from 'validator';
import Papa from 'papaparse';
 
export default function ModalCargaUsuariosTipoTutoria({ title, componentId, componentName, idRol, fetch, PasoFetch=false, session }) {
  const { facultad, Nombrefacultad } = useFacultad();
  const { Programa, NombrePrograma } = usePrograma();
  console.log(Programa)
  const decoded = jwtDecode(session.accessToken);
  const esCoord = decoded.roles.some(role => role.includes('Coordinador'));
  const { setActiveComponent } = useActiveComponent();
  const { addUser } = useUsers();
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState();
  const [flag, setFlag] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0].type === 'text/csv') {
      setFile(acceptedFiles[0]);
    } else {
      toast.error('Solo se permiten archivos CSV');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDownload = () => {
    let csvContent = null;
    if(PasoFetch){
      csvContent = "codigo,rol\n"
    } else{
      if (idRol === 4) {
        if(decoded.roles.some(role => role.includes('Coordinador de Facultad'))){
          csvContent = "codigo,nombres,primerApellido,segundoApellido,email,programa\n"
          
        } else if(decoded.roles.some(role => role.includes('Coordinador de Programa'))){
          csvContent = "codigo,nombres,primerApellido,segundoApellido,email\n"
          
        } else{
          csvContent = "codigo,nombres,primerApellido,segundoApellido,email,facultad,programa\n"
          
        }
      } else if (idRol === 3) {
        csvContent = "codigo,nombres,primerApellido,segundoApellido,email\n"
      }
    }

    const bom = '\uFEFF';
    csvContent = bom + csvContent;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

  useEffect(() => {
    // Función para leer y procesar el archivo CSV
    const processCsvFile = async () => {
      try {
        const reader = new FileReader();
    
        // Promesa para leer el archivo
        const readFileAsText = (file) => {
          return new Promise((resolve, reject) => {
            reader.readAsText(file, 'UTF-8');
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
          });
        };
    
        const csvData = await readFileAsText(file);
    
        // Parsea el contenido CSV
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        }).data;
    
        // Promesa para procesar el CSV
        const processParsedData = new Promise((resolve, reject) => {
          const usersArray = [];
          let haserror = false;
          let id = 1;
    
          for (const record of parsedData) {
            console.log(record)
            // Aquí puedes acceder a cada registro (fila) del archivo CSV
            if(record.codigo === null || record.codigo === undefined){
              setFile(undefined);
              setUsers(undefined);
              reject(new Error(`El usuario de la fila "${id}" tiene un código no válido`));
              haserror = true;
              break;
            }
            record.codigo = record.codigo.toString().trim();
            if (record.codigo.length === 0 || record.codigo.length > 8) {
              setFile(undefined);
              setUsers(undefined);
              reject(new Error(`El usuario de la fila "${id}" tiene un código no válido`));
              haserror = true;
              break;
            }
            if (!PasoFetch) {
              // código debe ser numérico
              if (record.email === null || record.email === undefined || record.email.length === 0 || !validator.isEmail(record.email)) {
                setFile(undefined);
                setUsers(undefined);
                reject(new Error(`El usuario de la fila "${id}" tiene un correo no válido`));
                haserror = true;
                break;
              }
              if (record.nombres === null || record.nombres === undefined || record.nombres.length === 0 || !validator.isAlpha(record.nombres, 'es-ES', { ignore: ' ' })) {
                console.log(record.nombres)
                setFile(undefined);
                setUsers(undefined);
                reject(new Error(`El usuario de la fila "${id}" tiene un nombre no válido`));
                haserror = true;
                break;
              }
              if (record.primerApellido === null || record.primerApellido === undefined || record.primerApellido.length === 0 || !validator.isAlpha(record.primerApellido, 'es-ES', { ignore: ' ' })) {
                setFile(undefined);
                setUsers(undefined);
                reject(new Error(`El usuario de la fila "${id}" tiene un primer apellido no válido`));
                haserror = true;
                break;
              }
              if (record.segundoApellido !== null && record.segundoApellido !== undefined && record.segundoApellido.length > 0 && !validator.isAlpha(record.segundoApellido, 'es-ES', { ignore: ' ' })) {
                setFile(undefined);
                setUsers(undefined);
                reject(new Error(`El usuario de la fila "${id}" tiene un segundo apellido no válido`));
                haserror = true;
                break;
              }
              record.nombres = capitalizeWords(record.nombres);
              record.primerApellido = capitalizeWords(record.primerApellido);
              record.segundoApellido = capitalizeWords(record.segundoApellido || '');
              record.id_usuario = id;
              record.idRol = idRol;
              record.esActivo = true;
              if (esCoord && idRol === 4) {
                if (record.facultad !== Nombrefacultad && record.facultad !== null && record.facultad !== undefined && record.facultad !== '') {
                  setFile(undefined);
                  setUsers(undefined);
                  reject(new Error(`El usuario de la fila "${id}" tiene facultad "${record.facultad}" debería ser "${Nombrefacultad}" o dejarlo en blanco`));
                  haserror = true;
                  break;
                }
                record.facultad = Nombrefacultad;
                if (Programa) {
                  if(NombrePrograma){
                    record.programa = NombrePrograma;
                  }
                  if (record.programa === null || record.programa === '' || record.programa === undefined) {
                    setFile(undefined);
                    setUsers(undefined);
                    reject(new Error(`El usuario de la fila "${id}" no se especifica el programa`));
                    haserror = true;
                    break;
                  } else {
                    record.Facultad = {
                      idFacultad: facultad,
                      nombrePrograma: record.programa
                    };
                  }
                } else {
                  if (record.programa === null || record.programa === '' || record.programa === undefined) {
                    record.programa = null;
                  }
                  record.Facultad = {
                    idFacultad: facultad,
                    nombrePrograma: record.programa
                  };
                }
              } else {
                if (record.facultad === null || record.facultad === undefined || record.facultad === '') {
                  if (idRol === 4) {
                    setFile(undefined);
                    setUsers(undefined);
                    reject(new Error(`Subió un archivo incorrecto o el usuario de la fila ${id} no posee una facultad o un programa`));
                    haserror = true;
                    break;
                  }
                  record.Facultad = null;
                } else {
                  if (record.programa === null || record.programa === null || record.programa === '') {
                    record.programa = null;
                  }
                  record.Facultad = {
                    nombre: record.facultad,
                    nombrePrograma: record.programa
                  };
                }
              }
            } else {
              if (record.rol === null || record.rol.length === 0 || !validator.isAlpha(record.rol, 'es-ES', { ignore: ' ' })) {
                setFile(undefined);
                setUsers(undefined);
                reject(new Error(`El usuario de la fila "${id}" tiene un rol no válido`));
                haserror = true;
                break;
              }
              record.rol = record.rol.toLowerCase();
            }
            usersArray.push(record);
            id = id + 1;
          }
    
          if (id === 1) {
            setFile(undefined);
            setUsers(undefined);
            reject(new Error('El archivo CSV está vacío'));
            haserror = true;
          }
    
          if (!haserror) resolve(usersArray);
        });
    
        const usersArray = await processParsedData;

        if (PasoFetch) {
          console.log(usersArray);
          await fetch(usersArray);
          setFlag(true);
        } else {
          const uniqueUsers = [];
          usersArray.forEach(user => {
            const exists = uniqueUsers.some(existingUser => existingUser.codigo === user.codigo || existingUser.email === user.email);
            if (!exists) {
              uniqueUsers.push(user);
            }
          });
          console.log(uniqueUsers)
          setUsers(uniqueUsers);
          setFlag(true);
        }
    
      } catch (error) {
        console.error('Error al procesar el archivo CSV:', error);
        throw error;
      }
    };
  
    const fetchPromise = async () => {
      toast.promise(
        processCsvFile(),
        {
          loading: 'Cargando Usuarios...',
          success: 'Usuarios cargados con éxito',
          error: (error) => `Error al cargar usuarios: ${error.message}`
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
        .catch((error) => {
          console.error('Failed to post render request: ', error);
        });
    };
  
    if (isOpen && file) {
      fetchPromise();
    }
  }, [file]);
  
  
  

  useEffect(() => {
    if (!isOpen) {
      setFile(undefined);
      setUsers([]);
      setFlag(false);
    }
  }, [isOpen]);

  const handleOnClick = (componentId, componentName) => {
    if(!PasoFetch){
      addUser(users);
    }
    console.log(users);
    const Component = componentMapping[componentId];
    if (Component) {
      console.log('Activating component:', componentName);
      setActiveComponent(Component, componentName);
    }
  };

  return (
    <div>
      <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center w-40'
        startContent={<Upload size={20} />}
        onPress={onOpen}
      >
        Cargar
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
          <ModalBody>
            <div
              {...getRootProps()}
              className='p-[20px] border-dashed border-2 border-[#00C1BC] rounded-xl h-40 hover:bg-gray-200 transition-colors duration-300 cursor-pointer flex justify-center items-center'
            >
              <input {...getInputProps()} accept='.csv' />
              {flag === false ? (
                isDragActive ? (
                  <div className='flex flex-col items-center justify-center'>
                    <CloudUpload className='size-16 text-[#00C1BC]' />
                    <p className='text-[#00C1BC]'>Arrastra el archivo aquí</p>
                    <Muted>Único formato permitido: CSV</Muted>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center'>
                    <CloudUpload className='size-16 text-[#00C1BC]' />
                    <p>Arrastra el archivo aquí o</p>
                    <p className='text-[#00C1BC]'>Seleccione desde su PC</p>
                    <Muted>Único formato permitido: CSV</Muted>
                  </div>
                )
              ) : (
                <div className="flex flex-row items-center justify-center">
                  <File className="size-10 text-[#00C1BC] mr-2" />
                  <H4 className="text-[#00C1BC] truncate max-w-xs">
                    {file.name}
                  </H4>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={flag === false}
              type='submit'
              color='primary'
              variant='solid'
              className='flex w-full font-bold'
              onClick={() => {
                handleOnClick(componentId, componentName)
              }}
            >
              CARGAR ARCHIVO
            </Button>
            <Button
              type='submit'
              color='secondary'
              variant='solid'
              className='flex w-full font-bold'
              onClick={() => handleDownload()}
            >
              DESCARGAR PLANTILLA
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
