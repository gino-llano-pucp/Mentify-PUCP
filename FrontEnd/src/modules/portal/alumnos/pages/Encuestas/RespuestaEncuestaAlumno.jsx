import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import React, { useContext, useEffect, useState } from 'react';

import { CirclePlus } from 'lucide-react';
import DropdownStatusSurvey from '../../components/DropdownStatusSurvey';
import ListaEncuestasAlumno from '../../components/ListaEncuestasAlumno';
import fetchAPI from '@/modules/core/services/apiService';
import { jwtDecode } from 'jwt-decode';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useEncuestaAlumno } from '../../states/EncuestaContext';
import { Radio, RadioGroup } from '@nextui-org/react';
import { array } from 'zod';

const RespuestaEncuestaAlumno = ({session, surveyType, answers, setAnswers, validAnswers, setValidAnswers, idSurvey, initialLoad, setInitialLoad}) => {
  const [loading, setLoading] = useState(true);
  const [questionsAnswers, setQuestionsAnswers] = useState(null);
  const {idEncuesta, estadoEncuesta} = useEncuestaAlumno();
  const [flag, setFlag] = useState(false);
  //Si typcard es 1, se listaran las encuestas pendientes, si es 2, las encuestas completadas
  useEffect(() => {
    fetchPreguntasRespuestas();
  }, []);
  
  // Manejadores para cambiar cada campo de respuesta
  const handleChange = (index, value) => {
    let updatedvalid = [...validAnswers]
    updatedvalid[index]=true
    setValidAnswers(updatedvalid)
    let updatedValue = [...answers]
    updatedValue[index]=value
    setAnswers(updatedValue)
    
  };


  
  const fetchPreguntasRespuestas = async () => {
    setLoading(true);
    console.log(session)
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    
    const data = await fetchAPI({
      endpoint: `/Encuesta/listado-preguntas-opciones`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idEncuesta": idSurvey,
        "estado": surveyType,
      },
      successMessage: 'Preguntas y Opciones cargadas correctamente',
      errorMessage: 'Error al cargar Preguntas y Opciones',
      showToast: false
  });
  console.log(idSurvey)
  console.log(surveyType)
  console.log(data)
  
  
  if (data && data.length > 0) {
    setQuestionsAnswers(data);
    setAnswers(new Array(data.length).fill(null))
    setValidAnswers(new Array(data.length).fill(true))
    //const codigosTutores = data.data.tutores.map(asignacion => asignacion.Tutor.codigo);
  } else {
    setQuestionsAnswers([]);
  }   
  
  console.log(validAnswers)
  setLoading(false);  
}



  
  if(surveyType===1)
  return (
  <div className='w-full h-full flex flex-col gap-10 mx-2 my-4 pr-4'>
      {questionsAnswers&&questionsAnswers.map((element, index)=>{
        return(
        <div className='w-full flex flex-col gap-2'>
          <div className='font-semibold text-2xl w-full '>
          {index + 1}. {element.descripcionPregunta}
          </div>
          <RadioGroup 
          isRequired
          orientation="horizontal"
          className='w-ful px-1'
          onChange={(e) => handleChange(index, {idPregunta:element.preguntaId, idRespuesta: e.target.value})}
          //isInvalid={!(validAnswers.length!==0&&validAnswers[index])}
          isInvalid={initialLoad===false&&answers[index]===null}
          >
          <div className={`w-full flex flex-row gap-x-5 items-center justify-between`}>
          {element&&element.opciones&&element.opciones.map((questAns)=>{
            return(
            <Radio
            //value={[quest.preguntaId, questAns.idRespuesta]}>
            value={ questAns.idOpcion}>
              {questAns.nombreOpcion}
            </Radio>
            
            )
          })}
          </div>
          </RadioGroup>
          </div>
        
      )})}
      </div>
  )
  else if(surveyType===2)
    return (
      <div className='w-full h-full flex flex-col gap-10 mx-2 my-4 pr-4'>
          {questionsAnswers&&questionsAnswers.map((element, index)=>{
            console.log(element)
            return(
            <div className='w-full flex flex-col gap-2'>
              <div className='font-semibold text-2xl w-full '>
              {index + 1}. {element.descripcionPregunta}
              </div>
              <RadioGroup 
              isRequired
              orientation="horizontal"
              className='w-ful px-1'
              value={element.opcionSeleccionada}
              isDisabled={true}
              //onChange={(e) => handleChange(quest.preguntaId, e.target.value)}
              
              >
              <div className={`w-full flex flex-row gap-x-5 items-center justify-between`}>
              {element&&element.opciones&&element.opciones.map((questAns)=>{
                return(
                <Radio
                //value={[quest.preguntaId, questAns.idRespuesta]}>
                value={ questAns.idOpcion} >
                  {questAns.nombreOpcion}
                  
                </Radio>
                
                )
              })}
              </div>
              </RadioGroup>
              </div>
            
          )})}
          </div>
      )
  
};

export default RespuestaEncuestaAlumno;
