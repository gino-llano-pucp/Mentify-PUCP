import CardAttribute from '../../admin/components/CardAttribute';
import React, { useEffect, useState } from 'react';
import { Calendar, Check, Circle, Clock, Hash, Library, Mail } from 'lucide-react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, select, useDisclosure } from '@nextui-org/react';
import { ModalSolicitarTutor } from './ModalSolicitarTutor';
import EliminarSolicitud from './EliminarSolicitud';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useEncuestaAlumno } from '../states/EncuestaContext';
import RespuestaEncuestaAlumno from '../pages/Encuestas/RespuestaEncuestaAlumno';
import { fetchRegitroRespuestaEncuesta } from '../services/RegistroRespuestaEncuestaService';
import toast from 'react-hot-toast';




const EncuestaAlumnoCard = ({ session, survey, functionSpecified, accessOption, deleteOption, update, page, encuestaType, initialLoad, setInitialLoad}) => {
  console.log(survey)
  console.log(survey.fechaRespuesta)
  console.log(encuestaType)
  const { setActiveComponentById } = useActiveComponent();
  const {addIdEncuesta, addEstadoEncuesta} = useEncuestaAlumno();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [answers, setAnswers] = useState([])
  const [validAnswers, setValidAnswers] = useState([])
  const [flag, setFlag] = useState(false)

  useEffect(()=>{
    setFlag(false);
  },[isOpen])
  

  console.log(survey)
  return (
    <div 
      className={ 'w-[300px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer relative flex-wrap transition-shadow hover:shadow-lg'}
      onClick={()=>{
        setInitialLoad(true)
        onOpen()
      }
      }
    >
      <div className='flex flex-row items-center justify-between w-full gap-4 card-header'>
      <h3 className='w-[255px] text-lg font-semibold break-words'>
        <CardAttribute icon={<Calendar size={20} />} text={`${survey.fechaEncuesta.split("T")[0].split("-")[2]}/${survey.fechaEncuesta.split("T")[0].split("-")[1]}/${survey.fechaEncuesta.split("T")[0].split("-")[0]}`} />  
        </h3>
      
      </div>
      {encuestaType===2?
      <div className='flex flex-col w-full gap-2'>
        {survey.fechaRespuesta===null?
        <CardAttribute icon={<Check size={20} />} text={`Encuesta completada en la fecha --/--/----`} />
        :
        <CardAttribute icon={<Check size={20} />} text={`Encuesta completada en la fecha ${survey.fechaRespuesta.split("T")[0].split("-")[2]}/${survey.fechaRespuesta.split("T")[0].split("-")[1]}/${survey.fechaRespuesta.split("T")[0].split("-")[0]}`} />
      }
      </div>
      :
      encuestaType===1?
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute icon={<Clock size={20} />} text={`Encuesta pendiente`} />
      </div>
      :null
      }
      { isOpen && (
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
            <ModalHeader className='flex flex-col gap-1'>ENCUESTA {encuestaType===2?'COMPLETADA':(encuestaType===1?'PENDIENTE':null)}</ModalHeader>
        <ModalBody
          className='mb-4 max-h-[670px] min-h-[600px] overflow-y-auto overflow-x-hidden'
        >
          <h2 className='agregar-facultad-header'>ENCUESTA DEL DÍA 
          {` ${survey.fechaEncuesta.split("T")[0].split("-")[2]}/${survey.fechaEncuesta.split("T")[0].split("-")[1]}/${survey.fechaEncuesta.split("T")[0].split("-")[0]}`}
            </h2>
          <RespuestaEncuestaAlumno session={session} surveyType={encuestaType} answers={answers} setAnswers={setAnswers} validAnswers={validAnswers} setValidAnswers={setValidAnswers} idSurvey={survey.idEncuesta} initialLoad={initialLoad} setInitialLoad={setInitialLoad}/>
        </ModalBody>
        { encuestaType == 1?
        <ModalFooter className='flex justify-center items-center'>
              <Button className='bg-[#008000] text-white w-full' variant='solid'
              onClick={()=>{
                if(!flag)setFlag(true);
                else return;
                let updatedItems = []
                if(answers.length!==0&&validAnswers.length!==0)
                  updatedItems = [...validAnswers]
                  
                  answers.forEach((element,index)=>{
                    updatedItems[index]=(element===null)?false:true;

                  })
                  setValidAnswers(updatedItems)
                  if(!answers.includes(null)&&answers.length>0){
                    console.log(answers)
                    toast
                      .promise(
                        fetchRegitroRespuestaEncuesta(session,survey.idEncuesta, answers),
                        {
                          loading: 'Registrando respuestas...',
                          success: 'Respuestas registradas con éxito',
                          error: (error) => error.message === 'Ya se registraron respuesta' ? `Error al agregar Respuestas: ${error.message}` : 'Error al agregar Respuestas'
                        },
                        {
                          style: {
                            minWidth: '250px'
                          }
                        }
                      )
                      .then(async (response) => {
                        update();
                        setAnswers([]);
                        setValidAnswers([]);
                        setInitialLoad(true)
                        onOpenChange(false)
                        console.log(response);
                        setFlag(false);
                      })
                      .catch((error) => {
                        setFlag(false);
                        console.error('Failed to post render request: ', error);
                      });   
                  }
                  setInitialLoad(false)
              }
              }
              >
                Enviar Respuestas
              </Button>
              <Button className='bg-[#FF4545] text-white w-full' variant='solid' 
              onPress={() => {
                if(answers){
                  setAnswers([]);
                  setValidAnswers([]);
                }
                  
                onClose()
                }}>
                Cancelar
              </Button>
            </ModalFooter>
        :
        <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
        }

            </>
            )}
            </ModalContent>
        </Modal>
      )}

    </div>
  );
};

export default EncuestaAlumnoCard;

//<CardAttribute icon={<Check size={20} />} text={`Encuesta completada en la fecha ${survey.fechaRespuesta.split("T")[0].split("-")[2]}/${survey.fechaRespuesta.split("T")[0].split("-")[1]}/${survey.fechaRespuesta.split("T")[0].split("-")[0]}`} />