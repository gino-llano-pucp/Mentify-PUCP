'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { CloudUpload, File, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { H4, Muted } from '@/modules/core/desing-system/typography';
import { componentMapping } from '@/modules/core/lib/componentMapping';
import { useUsers } from '@/modules/core/states/UsersContext';
import { jwtDecode } from 'jwt-decode';
import { set } from 'lodash';

export default function ModalNotas({ title, session }) {
  const { addUser } = useUsers();
  const { setActiveComponent } = useActiveComponent();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState();
  const decoded = jwtDecode(session?.accessToken);
  const [flag, setFlag] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    console.log(acceptedFile);
    if (acceptedFile.type === 'application/x-zip-compressed' || acceptedFile.type === 'application/zip') {
      setFile(acceptedFile);
    } else {
      toast.error('Solo se permiten archivos ZIP');
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const processZipFile = async (zipFile) => {
      if (!zipFile) return;
      try {
        const reader = new FileReader();
  
        // Promesa para leer el archivo como ArrayBuffer
        const readFileAsArrayBuffer = (file) => {
          return new Promise((resolve, reject) => {
            reader.readAsArrayBuffer(file);
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
          });
        };
  
        const zipData = await readFileAsArrayBuffer(zipFile);
        const jsZip = new JSZip();
        const zip = await jsZip.loadAsync(zipData);
        const extractedFiles = [];
  
        // Promesa para procesar los archivos en el ZIP
        const processZipEntries = new Promise(async (resolve, reject) => {
          for (const relativePath in zip.files) {
            const zipEntry = zip.files[relativePath];
            if (zipEntry.name.endsWith('.pdf')) {
              const fileData = await zipEntry.async('blob');
              if (fileData.size > 2 * 1024 * 1024) {
                toast.error(`El archivo ${zipEntry.name} excede el tamaño máximo permitido de 2 MB`);
                continue;
              }
              const fileName = zipEntry.name.split('.pdf')[0];
              if (!/^[a-zA-Z0-9]{1,8}$/.test(fileName)) {
                toast.error(`El archivo ${zipEntry.name} no cumple con el formato de nombre requerido`);
                continue;
              }
              extractedFiles.push({ name: zipEntry.name, data: fileData, codigo: fileName });
            }
          }
          if (extractedFiles.length === 0) {
            return reject(new Error('No se encontraron archivos PDF correctos en el ZIP'));
          }
          try {
            await fetchNotas(extractedFiles);
            setFlag(true);
            resolve(true);
          } catch (fetchError) {
            reject(fetchError);
          }
        });
  
        await processZipEntries;
  
      } catch (error) {
        console.error('Error al procesar el archivo ZIP:', error);
        throw error;
      }
    };
  
    const fetchPromise = async () => {
      toast.promise(
        processZipFile(file),
        {
          loading: 'Cargando Notas...',
          success: 'Notas cargadas con éxito',
          error: (error) => `Error al cargar Notas: ${error.message}`
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      ).catch((error) => {
        console.error('Failed to post render request: ', error);
      });
    };
  
    if (file && isOpen) {
      fetchPromise();
    }
  }, [file]);
  

  useEffect(() => {
    if (!isOpen) {
      setFlag(false);
      setFile(undefined);
      addUser([])
    }
  }, [isOpen]);

  const fetchNotas = async (filesData) => {
    console.log(filesData);
    try {
      const token = session?.accessToken;
      if (!token) {
        throw new Error('Token Invalido');
      }
  
      const formData = new FormData();
      formData.append('idCoord', decoded.id);
  
      filesData.forEach((file, index) => {
        formData.append(`file_${index}`, file.data, file.name);
        formData.append(`codigo_${index}`, file.codigo);
      });
  
      // Verifica el contenido de formData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      console.log('formData', formData)
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/verificar-alumnos-historico-notas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la verificación de archivos');
      }
  
      const data = await response.json();
      console.log(data);
      if(data && data.data && data.data.length > 0) {
        addUser(data.data);
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar los archivos');
    }
  };
  
  

  const handleOnClick = (componentId, componentName) => {
    const Component = componentMapping[componentId];
    if (Component) {
      // Create the component instance only when needed
      const componentInstance = <Component />;
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
        Registrar Notas
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
              className={flag === false ? 'p-[20px] border-dashed border-2 border-[#00C1BC] rounded-xl hover:bg-gray-200 transition-colors duration-300 cursor-pointer flex justify-center items-center' : 
                'py-[85px] border-dashed border-2 border-[#00C1BC] rounded-xl hover:bg-gray-200 transition-colors duration-300 cursor-pointer flex justify-center items-center'}
            >
              <input {...getInputProps()} accept='.zip' />
              {flag === false ? (
                isDragActive ? (
                  <div className='flex flex-col items-center justify-center'>
                    <CloudUpload className='size-16 text-[#00C1BC]' />
                    <p className='text-[#00C1BC]'>Arrastra el archivo aquí</p>
                    <Muted>Único formato permitido: ZIP</Muted>
                    <Muted>Los .pdf deben ser llamados con el codigo del alumno</Muted>
                    <Muted>Estos no deben estar dentro de una carpeta</Muted>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center'>
                    <CloudUpload className='size-16 text-[#00C1BC]' />
                    <p>Arrastra el archivo aquí o</p>
                    <p className='text-[#00C1BC]'>Seleccione desde su PC</p>
                    <Muted>Único formato permitido: ZIP</Muted>
                    <Muted>Los .pdf deben ser llamados con el codigo del alumno</Muted>
                    <Muted>Estos no deben estar dentro de una carpeta</Muted>
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
              onClick={() => handleOnClick('procesadoNotas','Cargar Historial de Notas')}
            >
              CARGAR ARCHIVO
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
