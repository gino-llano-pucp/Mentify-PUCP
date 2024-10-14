import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import fetchAPI from '@/modules/core/services/apiService';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import FilterTutoringTypesProgramDropdown from '../../coordinador/components/FilterTutoringTypesProgramDropdown';
import { CircularProgress } from '@nextui-org/react';
import FilterFrequencyDropdown from '../../coordinador/components/FilterFrequencyDropdown';
import { GraficoLinea } from '../../coordinador/components/GraficoLinea';
import { CardInformacionIndicador } from '../../coordinador/components/CardInformacionIndicador';
import { GraficoCircular } from '../../coordinador/components/GraficoCircular';
import { fetchTutoringTypesTutorStudent } from '../service/tiposDeTutoria';
import { useDetalleAlumno } from '../states/DetalleAlumnoContext';
import FilterTutoringTypeStudentTutor from '../components/FilterTutoringTypeStudentTutor';
import { GraficoBarra } from '../../coordinador/components/GraficoBarra';

const ReporteAlumnoAsignado = ({session}) => {
  const [tipoTutoria, setTipoTutoria]=useState({ uid: 0, name: 'Todos' });
  const {detalleAlumno} = useDetalleAlumno();
  const [dateRange, setDateRange] = useState();
  const [reporteAlumno, setReporteAlumno] = useState(null);
  const [frequencyCitas, setFrequencyCitas] = useState({ uid: 1, name: 'Diaria' });
  const [frequencyCompromisos, setFrequencyCompromisos] = useState({ uid: 1, name: 'Diaria' });
  const [registroCitas, setRegistroCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [compromisosCompletados, setCompromisosCompletados] = useState([]);
  const maxElementsInterpolate = 30;
  const maxElementsInterpolateMiniGraphic = 10;
  const lowAmount = 40;

  useEffect(()=>{
    if(reporteAlumno&&reporteAlumno?.trazabilidadObjetivosFinalizados){
      setCompromisosCompletados(groupAndAccumulateDataCompromisos(reporteAlumno.trazabilidadObjetivosFinalizados,frequencyCompromisos));
    }
  },[frequencyCompromisos])

  useEffect(()=>{
    if(reporteAlumno&&reporteAlumno?.registroCitas)
      setRegistroCitas(groupAndAccumulateData(reporteAlumno.registroCitas,frequencyCitas));
  },[frequencyCitas])

  useEffect(() => { 
    fetchDataReporteAlumno();
  }, [tipoTutoria, dateRange]);
  
  


  function findMaxValue(array, attribute){
    const values = array.map(obj=>obj[`${attribute}`])
    const maximo = Math.max(...values)
    return maximo;
  }

  let colorAceptableLowValue  = (value) =>{
    return value > lowAmount ? "#008000":"#ff4545";
  }

  const parseDate = (str) => {
    const [year, month, day] = String(str).split('-').map(Number);

    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const interpolateDataByDate = (data, maxPoints) => {
    if(data.length > maxPoints){
    // Convertir fechas a objetos Date
    const dataWithDates = data.map(item => ({
      ...item,
      parseDate: parseDate(item.fechaCita)
    }));
  
    // Ordenar los datos por fecha
    dataWithDates.sort((a, b) => a.parseDate - b.parseDate);
    const step = Math.ceil(dataWithDates.length / maxPoints);
    const interpolatedData = dataWithDates.filter((_, index) => index % step === 0);
    let accumulatedData = []
    let currentAccumulated = {fechaCita: '', "Cantidad de citas registradas": 0, "Cantidad de citas canceladas": 0, "Cantidad de citas realizadas": 0}
    dataWithDates.forEach((item, index) => {
      currentAccumulated["Cantidad de citas registradas"] += item["Cantidad de citas registradas"];
      currentAccumulated["Cantidad de citas canceladas"] += item["Cantidad de citas canceladas"];
      currentAccumulated["Cantidad de citas realizadas"] += item["Cantidad de citas realizadas"];
      if (index % step === 0 || index === dataWithDates.length - 1) {
        currentAccumulated.fechaCita = item.fechaCita;
        accumulatedData.push({ ...currentAccumulated });
        currentAccumulated = {fechaCita: '', "Cantidad de citas registradas": 0, "Cantidad de citas canceladas": 0, "Cantidad de citas realizadas": 0}
      }
    });
    return accumulatedData
  }  
    else
      return data;
  };

  const groupAndAccumulateData = (data, frequency) => {
    const groupedData = {};
  
    data.forEach(item => {
      const date = parseDate(item.fechaCita);
      let key;
  
      if (frequency.uid === 1) {
        key = formatDate(date);
      } else if (frequency.uid === 2) {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = formatDate(weekStart);
      } else if (frequency.uid === 3) {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
  
      if (!groupedData[key]) {
        groupedData[key] = {fechaCita: '', "Cantidad de citas registradas": 0, "Cantidad de citas canceladas": 0, "Cantidad de citas realizadas": 0};
      }
      groupedData[key]["Cantidad de citas registradas"] += item["Cantidad de citas registradas"];
      groupedData[key]["Cantidad de citas canceladas"] += item["Cantidad de citas canceladas"];
      groupedData[key]["Cantidad de citas realizadas"] += item["Cantidad de citas realizadas"];
      groupedData[key]["fechaCita"] = item["fechaCita"];
    });
  
    // Convertir el objeto agrupado en un array y ordenarlo por fecha
    return Object.values(groupedData).sort((a, b) => new Date(a.fechaCita) - new Date(b.fechaCita));
  };

  const interpolateDataCompromisosFinalizados = (data, maxPoints) => {
    if(data.length > maxPoints){
    // Convertir fechas a objetos Date
    const dataWithDates = data.map(item => ({
      ...item,
      parseDate: parseDate(item.fecha)
    }));
  
    // Ordenar los datos por fecha
    dataWithDates.sort((a, b) => a.parseDate - b.parseDate);
    const step = Math.ceil(dataWithDates.length / maxPoints);
    const interpolatedData = dataWithDates.filter((_, index) => index % step === 0);
    let accumulatedData = []
    let currentAccumulated = {fecha: '', "cantidadFinalizados": 0}
    dataWithDates.forEach((item, index) => {
      currentAccumulated["cantidadFinalizados"] += item["cantidadFinalizados"];
      if (index % step === 0 || index === dataWithDates.length - 1) {
        currentAccumulated.fecha = item.fecha;
        accumulatedData.push({ ...currentAccumulated });
        currentAccumulated = {fecha: '', "cantidadFinalizados": 0}
      }
    });
    return accumulatedData
    //return interpolatedData.map(({ parsedDate, ...rest }) => rest);  
  }  
    else
      return data;
  };

  const groupAndAccumulateDataCompromisos = (data, frequency) => {
    const groupedData = {};
  
    data.forEach(item => {
      const date = parseDate(item.fecha);
      let key;
  
      if (frequency.uid === 1) {
        key = formatDate(date);
      } else if (frequency.uid === 2) {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = formatDate(weekStart);
      } else if (frequency.uid === 3) {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
  
      if (!groupedData[key]) {
        groupedData[key] = {fecha: '', "cantidadFinalizados": 0};
      }
      groupedData[key]["cantidadFinalizados"] += item["cantidadFinalizados"];
      groupedData[key]["fecha"] = item["fecha"];
    });
  
    // Convertir el objeto agrupado en un array y ordenarlo por fecha
    return Object.values(groupedData).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };



  const fetchDataReporteAlumno = async () => {
    setLoading(true);
    console.log(tipoTutoria)
    if(tipoTutoria === undefined){
      return
    }
    if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }
      const data = await fetchAPI({
      endpoint: `/sesionCita/obtener-reporte-alumno-para-tutor`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idAlumno": detalleAlumno.idAlumno,
        "idTutor": jwtDecode(session.accessToken).id,
        "idTipoTutoria": tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria,
        "fechaDesde": dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
        "fechaHasta": dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
      },
      successMessage: 'Reporte de Alumno cargado correctamente',
      errorMessage: 'Error al cargar Reporte del Alumno',
      showToast: false
    });
    console.log(data)
    
    if(data){
      if(data.proporcionModalidadCitasVirtual===0){
        data.proporcionModalidadCitasVirtual = 
        [
          {
            name: "Presencial",
            value: 100,
          }
        ]
      }
      else if(data.proporcionModalidadCitasVirtual===100)
        data.proporcionModalidadCitasVirtual = 
        [
          {
            name: "Virtual",
            value: 100,
          }
        ]
    else
      data.proporcionModalidadCitasVirtual = [
        {
          name: "Presencial",
          value: 100 - data.proporcionModalidadCitasVirtual,
        },
        {
          name: "Virtual",
          value: data.proporcionModalidadCitasVirtual,
        }
    ]

    if(data&&data.registroCitas){
      data.registroCitas = data.registroCitas.map(({cantidadCitasRegistradas,cantidadCitasRealizadas,cantidadCitasCanceladas,...rest})=>({
        "Cantidad de citas registradas": cantidadCitasRegistradas,
        "Cantidad de citas realizadas": cantidadCitasRealizadas,
        "Cantidad de citas canceladas": cantidadCitasCanceladas,
        ...rest
      }
      )
      )  
    }
    if(data.registroCitas){
      data.registroCitas = interpolateDataByDate(data.registroCitas,maxElementsInterpolate) 
      setRegistroCitas(groupAndAccumulateData(data.registroCitas,frequencyCitas));
    }
    
    if(data.trazabilidadObjetivosFinalizados){
      data.trazabilidadObjetivosFinalizados = interpolateDataCompromisosFinalizados(data.trazabilidadObjetivosFinalizados,maxElementsInterpolateMiniGraphic);
      setCompromisosCompletados(groupAndAccumulateDataCompromisos(data.trazabilidadObjetivosFinalizados,frequencyCompromisos));
    }
    setReporteAlumno(data);
    setLoading(false);
    }
    else{
      setReporteAlumno(null)
      setLoading(false);
      
    }
  }

  return (
  <>
    
        <div>
        <div className='flex items-end w-full gap-6 flex-row flex-wrap'>
        <ControllerDateRange setValue={setDateRange}/>
        
        
        <div className='flex flex-col basis-1/6'>
            <span className='text-lg font-semibold '>Tipo de Tutoría</span>
            <FilterTutoringTypeStudentTutor setStatusFilter={setTipoTutoria} fetch={fetchTutoringTypesTutorStudent} idStudent={detalleAlumno.idAlumno} session={session}/>
        </div>
        
        </div>
        {loading?(

          <div className='flex flex-row items-center gap-3'>
          <CircularProgress aria-label='Loading...' />
          <div>Generando Reporte...</div>
          </div>
        ):
        (
        <div className='grid grid-cols-6 gap-x-4 -ml-4'>
        
        <div className="col-span-6">
        <div className='rounded-md stroke-black border-4 p-4 m-4 flex flex-col h-fit w-full relative'>
          <div className='w-full text-xl text-center font-semibold text-blue-700'>
            <div className="inline">REGISTRO DE CITAS</div>  
            <div className="inline absolute ml-auto right-3">
              <FilterFrequencyDropdown statusFilter={frequencyCitas} setStatusFilter={setFrequencyCitas} className="w-full"/>
            </div>
          </div>
          
          <div className=" w-full h-fit">
          <GraficoLinea data={registroCitas?registroCitas:null} xAxis={"fechaCita"} dataKeys={["Cantidad de citas registradas","Cantidad de citas realizadas","Cantidad de citas canceladas"]}
           //colors={["#39487F","#39487F","#39487F"]} strokeColors={["#39487F","#39487F","#39487F"]}
           maxHeight={600} minHeight={400} legend={true}
           maxValue={Math.ceil(findMaxValue(registroCitas?registroCitas:[], "Cantidad de citas registradas")*1.5)}
           labelNames={["Fecha","Citas Registradas", "Citas Atendidas", "Citas Canceladas"]}
           legendNames={["Citas Registradas", "Citas Atendidas", "Citas Canceladas"]}
           colors={["green","blue","red"]} strokeColors={["green","blue","red"]}
           
           />
          </div>
        </div>
        </div>
        
        <div className="col-span-2 flex flex-col">
          <CardInformacionIndicador textHeader={"CANTIDAD DE CITAS ATENDIDOS"} textContent={reporteAlumno?reporteAlumno.cantidadCitasAtendidas:0}/>
          <CardInformacionIndicador textHeader={"CANTIDAD DE DERIVACIONES EFECTUADAS"} textContent={reporteAlumno&&reporteAlumno.cantidadDerivaciones&&typeof(reporteAlumno.cantidadDerivaciones)!=="String"?Math.ceil(reporteAlumno.cantidadDerivaciones):0}/>
        </div>
        

        

        <div className="col-span-2">
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
        <div className='text-xl text-blue-700  font-semibold  w-full'>
          <div className='text-center'>MODALIDAD DE CITAS</div>
        </div>
        {console.log(reporteAlumno)}
        <GraficoCircular data={reporteAlumno&&reporteAlumno.proporcionModalidadCitasVirtual&&reporteAlumno.registroCitas&&reporteAlumno.registroCitas.length!==0?reporteAlumno.proporcionModalidadCitasVirtual:[]}
        colors={["blue","purple"]}
        dataKey={"value"}
        nameKey={"name"}
        innerRadius={0}
        outerRadius="90%"
        indicateLabel={false}
        maxHeight={400}
        minHeight={200}
        showLabelInGraph={true}
        legend={true}
        startAngle={90}
        endAngle={-270}
        />
        </div>
        </div>

        <div className="col-span-2">
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full '>
        <div className='text-xl  text-center font-semibold flex flex-row self-center text-blue-700'>ASISTENCIA DE CITAS</div>
          <div className=" w-full h-fit">
          <GraficoCircular data={reporteAlumno?
          [
            { name: 'Asistió', value: reporteAlumno.proporcionAsistenciaCitas?(reporteAlumno.proporcionAsistenciaCitas):0},
            { name: 'No Asistió', value: reporteAlumno.proporcionAsistenciaCitas?(100-reporteAlumno.proporcionAsistenciaCitas):100 }
          ]:[]}
            datakey={"value"}
            //indicator={}
            innerRadius="60%"
            outerRadius="80%"
            width={400}
            maxHeight={400}
            minHeight={200}
            colors={[colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionAsistenciaCitas:0), "rgba(226,232,240,0.5)"]}
            legend={false}
            labelCenter={true}
            labelCenterText={`${(reporteAlumno&&reporteAlumno.proporcionAsistenciaCitas&&typeof(reporteAlumno.proporcionAsistenciaCitas)!=="String"?reporteAlumno&&reporteAlumno.proporcionAsistenciaCitas:0).toFixed(2)}`+"%"}
            startAngle={90}
            endAngle={-270}
            labelCenterColor={colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionAsistenciaCitas:0)}
            />
          </div>
        </div>
        </div>
        <div className="col-span-2">
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full relative'>
        <div className='w-full text-xl text-center font-semibold text-blue-700'>
            <div className="inline ">COMPROMISOS COMPLETADOS</div>
        </div>
            <GraficoLinea data={compromisosCompletados?compromisosCompletados:null} xAxis={"fecha"} dataKeys={["cantidadFinalizados"]} colors={["#0080002"]} strokeColors={["#39487F"]} maxHeight={400} minHeight={300}
            maxValue={Math.ceil(findMaxValue(compromisosCompletados?compromisosCompletados:[], "cantidadFinalizados")*1.5)}
            labelNames={["Fecha","Cantidad de Compromisos"]}
            />
            
        </div>
        </div>

        
        <div className="col-span-2">
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
        <div className='text-xl  text-center font-semibold flex flex-row self-center text-blue-700'>PROPORCIÓN DE COMPROMISOS COMPLETADOS</div>
          <div className=" w-full h-fit">
            <GraficoCircular data={reporteAlumno?
            [
              { name: 'Finalizado', value: reporteAlumno.proporcionObjetivosFinalizados?(reporteAlumno.proporcionObjetivosFinalizados):0},
              { name: 'Por Finalizar', value: reporteAlumno.proporcionObjetivosFinalizados?(100-reporteAlumno.proporcionObjetivosFinalizados):100 }
            ]:[]}
            datakey={"value"}
            indicator={reporteAlumno?reporteAlumno.proporcionObjetivosFinalizados:0}
            innerRadius="60%"
            outerRadius="80%"
            width={400}
            maxHeight={400}
            minHeight={200}
            colors={[colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionObjetivosFinalizados:0), "rgba(226,232,240,0.5)"]}
            legend={false}
            labelCenter={true}
            labelCenterText={`${(reporteAlumno&&reporteAlumno.proporcionObjetivosFinalizados?reporteAlumno.proporcionObjetivosFinalizados:0).toFixed(2)}`+"%"}
            startAngle={90}
            endAngle={-270}
            labelCenterColor={colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionObjetivosFinalizados:0)}
            
            />
            
          </div>
        </div>
        </div>

      <div className="col-span-2">
      <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
      <div className='w-full text-xl  text-center font-semibold  text-blue-700'>ESTADO DE COMPROMISOS</div>
        <div className=" w-full h-fit">
        <GraficoBarra data={reporteAlumno?reporteAlumno.estadoCompromisos:[]} dataKeys={["cantidad"]}
              colors={["#fecaca","#fde68a","#bbf7d0"]}
              strokeColors={["#fecaca","#fde68a","#bbf7d0"]}
              //colors={new Array((reporteAlumno?reporteAlumno.estadoCompromisos:[]).length).fill("rgb(29,78,216)")}
              //strokeColors={new Array((reporteAlumno?reporteAlumno.estadoCompromisos:[]).length).fill("rgb(29,78,216)")}
              xAxis={"categoria"}
              yType={"number"}
              xType={"category"}
              maxHeight={450}
              minHeight={350}
        />
      </div>
      </div>
      </div>


      


        </div>)}
        
        </div>
      

  </>
);
};

export default ReporteAlumnoAsignado;


