'use client';
import { H4, Muted } from '@/modules/core/desing-system/typography';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { CloudUpload, File, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUnidades } from '../states/UnidadContext';
import { componentMapping } from '@/modules/core/lib/componentMapping';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { parse } from 'csv-parse';
import toast from 'react-hot-toast';
import validator from 'validator';
import Papa from 'papaparse';

export default function ModalCargaUnidadesAcademicas({title,componentId, componentName, session}){
    
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setActiveComponent } = useActiveComponent();
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

  //==============Contextos Usados==========
  const { addUnidad } = useUnidades();
  //========================================
  const [ unidades, setUnidades] = useState([]);


  const handleDownload = () => {
    let csvContent = "siglas,nombre,correoDeContacto\n";

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

  //==========Procesamiento del CSV===========
  useEffect(() => {
    const procesarCsvFileUnidades = async () => {
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
          error: (err) => {
            throw new Error('Error al procesar el archivo CSV: ' + err.message);
          },
          complete: (results) => {
            const unidadesArray = [];
            let id = 1;

            for (const record of results.data) {
              if (!record.siglas) {
                throw new Error(`La unidad académica ${id} no tiene siglas`);
              }
              if (!record.nombre) {
                throw new Error(`La unidad académica ${id} no tiene nombre`);
              }
              if (!validator.isEmail(record.correoDeContacto)) {
                throw new Error(`La unidad académica ${id} no tiene un correo de contacto válido`);
              }
              record.id_unidad_academica = id;
              record.esActivo = true;
              unidadesArray.push(record);
              id += 1;
            }

            if (id === 1) {
              setFile(undefined);
              setUnidades([]);
              throw new Error('El archivo CSV está vacío');
            }

            setUnidades(unidadesArray);
            setFlag(true);
          }
        });

      } catch (error) {
        console.error('Error al procesar el archivo CSV:', error);
        throw error;
      }
    };
  
    const fetchPromise = async () => {
      toast.promise(
        procesarCsvFileUnidades(),
        {
          loading: 'Cargando Unidades Académicas...',
          success: 'Unidades Académicas cargadas con éxito',
          error: (error) => `Error al cargar Unidades Académicas: ${error.message}`
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
  
    if (isOpen && file) {
      fetchPromise();
    }
  }, [file, isOpen]);
    
    //==========================================
    
    //===CUANDO SE ABRA EL MODAL=====
    useEffect(() => {
      if (!isOpen) {
        setFile(undefined);
        setUnidades([]);
        setFlag(false);
        console.log(unidades);
      }
    }, [isOpen]);
    //===============================

    const handleOnClick = (componentId, componentName) => {
        addUnidad(unidades);
        console.log(unidades);
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
                            <input {...getInputProps()} accept='.csv'/>
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
                        onClick={() => handleOnClick(componentId, componentName)}
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