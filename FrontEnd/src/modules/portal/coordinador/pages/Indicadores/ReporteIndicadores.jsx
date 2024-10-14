import { Button } from '@nextui-org/react';
import React, { PureComponent, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import TipoValoracionDropDown from '../../components/TipoValoracionDropDown';
import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import FilterTutoringTypeDropdown from '@/modules/core/components/FilterTutoringTypeDropdown';

import { ReporteTutor } from './ReporteTutor';
import { ReporteAlumno } from './ReporteAlumno';
import { ReporteEncuesta } from './ReporteEncuesta';
import { jwtDecode } from 'jwt-decode';

export default function ReporteIndicadores({session}) {
  const esCoordinadorPrograma = (jwtDecode(session.accessToken).roles.includes("Coordinador de Programa"))
  const [selectedButton, setSelectedButton] = useState(1);
  function findMaxValue(array, attribute){
    const values = array.map(obj=>obj[`${attribute}`])
    const maximo = Math.max(...values)
    return maximo;
  }
  //Se realiza un mapeo por estados, para indicar que ventana
  //se va a desplegar, 1 corresponde al resporte de alumnos,
  //2 corresponde al reporte de tutores y 3 corresponde
  //al reporte de encuestas
  return (
    <div className='w-full h-full relative'> 
    {
      selectedButton===1?

    <ReporteAlumno session={session} findMaxValue={findMaxValue} esCoordinadorPrograma={esCoordinadorPrograma}/>
    :
      selectedButton===2?
    <ReporteTutor session={session} findMaxValue={findMaxValue} esCoordinadorPrograma={esCoordinadorPrograma}/>
    :
      !esCoordinadorPrograma&&selectedButton===3?
    <ReporteEncuesta session={session} findMaxValue={findMaxValue}/>
    :null}
    
    <div className=' h-[70px] w-full'>
    </div>
    <nav className='fixed bottom-0 w-[100%] bg-[#F9F9F9] py-2 z-50 flex flex-row h-[70px]'>
        <div className={`${selectedButton===1?"text-[#00C1BC]":"text-black"} mx-2 text-2xl hover:bg-[#F2F2F2] hover:cursor-pointer px-6 py-2 rounded-lg font-bold`} onClick={()=>{setSelectedButton(1)}} >Alumnos</div>
        <div className={`${selectedButton===2?"text-[#00C1BC]":"text-black"} mx-2 text-2xl hover:bg-[#F2F2F2] hover:cursor-pointer px-6 py-2 rounded-lg font-bold`} onClick={()=>{setSelectedButton(2)}}>Tutores</div>
        {!esCoordinadorPrograma&&<div className={`${selectedButton===3?"text-[#00C1BC]":"text-black"} mx-2 text-2xl hover:bg-[#F2F2F2] hover:cursor-pointer px-6 py-2 rounded-lg font-bold`} onClick={()=>{setSelectedButton(3)}}>Encuesta</div>}
    </nav>
    
    </div>
  );
}

