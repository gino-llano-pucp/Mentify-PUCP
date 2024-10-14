import FilterTutoringTypeDropdown from "@/modules/core/components/FilterTutoringTypeDropdown"
import { GraficoArea } from "../../components/GraficoArea"
import { GraficoBarra } from "../../components/GraficoBarra"
import { GraficoCircular } from "../../components/GraficoCircular"
import { GraficoCircularMedio } from "../../components/GraficoCircularMedio"
import { GraficoLinea } from "../../components/GraficoLinea"
import TipoValoracionDropDown from "../../components/TipoValoracionDropDown"
import { ControllerDateRange } from "@/modules/core/components/ControllerDateRange"
import { Checkbox, CircularProgress } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { CardInformacionIndicador } from "../../components/CardInformacionIndicador"
import { fetchTypeTutoriasTutorFijo } from "../../services/ListarTutoriasTutorFijo"
import { fetchProgramasFacultad, fetchTipoTutoriasFacultadPrograma } from "../../services/ListarDropdownsReportes"
import FilterProgramaDropdown from "@/modules/core/components/FilterProgramaDropdown"
import { jwtDecode } from "jwt-decode"
import fetchAPI from "@/modules/core/services/apiService"
import FilterTutoringTypesProgramDropdown from "../../components/FilterTutoringTypesProgramDropdown"
import FilterFrequencyDropdown from "../../components/FilterFrequencyDropdown"
import FilterFacultadProgramaReporteDropdown from "../../components/FilterFacultadProgramaReporteDropdown"


export const  ReporteAlumno = ({session, findMaxValue, esCoordinadorPrograma}) => {
  const [tipoTutoria, setTipoTutoria]=useState({ uid: 0, name: 'Todos' });
  const [programas, setProgramas]=useState([]);
  const [dateRange, setDateRange] = useState();
  const [reporteAlumno, setReporteAlumno] = useState(null);
  const [filterFacultadPrograma, setFilterFacultadPrograma]=useState({ uid: 0, name: 'Todos' });
  const [frequencyCitas, setFrequencyCitas] = useState({ uid: 1, name: 'Diaria' });
  const [registroCitas, setRegistroCitas] = useState([]);
  const [hasPrograms, setHasPrograms] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingSearchBar, setLoadingSearchBar] = useState(true);
  const maxElementsInterpolate = 30;
  const lowAmount = 40;

  useEffect(()=>{
    const fetchType = async () => {
      if (session?.accessToken) {
        const data = await fetchProgramasFacultad(session);
        console.log(jwtDecode(session.accessToken))
        console.log(data);
        if (data) {
          if(data.length>1)
            setHasPrograms(true);
          else
            setHasPrograms(false);
            
        }
      } else {
        console.error('No access token available');
      }
      setLoadingSearchBar(false);
    };
    fetchType()
    
  },[])


  useEffect(() => {
    console.log("alerta")  
    fetchDataReporteAlumno();
      
  }, [tipoTutoria, dateRange]);  
  
  useEffect(()=>{
    if(reporteAlumno&&reporteAlumno?.registroCitas)
      setRegistroCitas(groupAndAccumulateData(reporteAlumno.registroCitas,frequencyCitas));
  },[frequencyCitas])

  let colorAceptableLowValue  = (value) =>{
    return value > lowAmount ? "#008000":"#ff4545";
  }

  const parseDate = (str) => {
    const [year, month, day] = str.split('-').map(Number);
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
      endpoint: `/sesionCita/obtener-reporte-alumno`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idCoordinador": jwtDecode(session.accessToken).id,
        "searchCriteria": {
        "fechaDesde": dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
        "fechaHasta": dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
        "idTipoTutoria": tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria,
        }
      },
      successMessage: 'Reporte de Alumno cargado correctamente',
      errorMessage: 'Error al cargar Reporte del Alumno',
      showToast: false
    });
    /*
    console.log(jwtDecode(session.accessToken).id)
    console.log(dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined)
    console.log(dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined)
    console.log(tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria)
    */
    console.log(hasPrograms)
    console.log(programas)
    console.log(dateRange)
    console.log(data)
    console.log(data.proporcionModalidadVirtualCitas)
    
    if(data.proporcionModalidadVirtualCitas===0){
      data.dataProporcionModalidadVirtual = 
      [
        {
          name: "Presencial",
          value: 100,
        }
      ]
    }
    else if(data.proporcionModalidadVirtualCitas===100)
      data.dataProporcionModalidadVirtual = 
      [
        {
          name: "Virtual",
          value: 100,
        }
      ]
      
    else
      data.dataProporcionModalidadVirtual = [
        {
          name: "Presencial",
          value: 100 - data.proporcionModalidadVirtualCitas,
        },
        {
          name: "Virtual",
          value: data.proporcionModalidadVirtualCitas,
        }
    ]
    

    console.log(data.dataProporcionModalidad)
    if(data&&data.registroCitas){
      data.registroCitas = data.registroCitas.map(({cantidadCitasRegistradas,cantidadCitasRealizadas,cantidadCitasCanceladas,...rest})=>({
        "Cantidad de citas registradas": cantidadCitasRegistradas,
        "Cantidad de citas realizadas": cantidadCitasRealizadas,
        "Cantidad de citas canceladas": cantidadCitasCanceladas,
        ...rest
      }
      )
      )
      data.registroCitas = interpolateDataByDate(data.registroCitas,maxElementsInterpolate) 
      setReporteAlumno(data);
      setRegistroCitas(groupAndAccumulateData(data.registroCitas,frequencyCitas));
      setLoading(false);
    }
    else{
      setReporteAlumno(null)
      setLoading(false);
      
    }
        
    
    }

    return(
      <>
        {loadingSearchBar?
        <div className='flex flex-row items-center gap-3'>
        <CircularProgress aria-label='Loading...' />
        <div>Cargando...</div>
        </div>
        :(
        <div>
        <div className='flex items-end w-full gap-6 flex-row flex-wrap'>
        
        <ControllerDateRange setValue={setDateRange} isFullLength={true}/>
        
        {!esCoordinadorPrograma&&hasPrograms?
        <div className='flex flex-col basis-1/6 gap-1 min-w-80'>
            <span className='text-lg font-semibold'>Filtro Facultad/Programa</span>
            <FilterFacultadProgramaReporteDropdown statusFilter={filterFacultadPrograma} setStatusFilter={setFilterFacultadPrograma} isFullLength={true}/>
        </div>
        :
        null
        }
        {!esCoordinadorPrograma&&hasPrograms?
        <div className='flex flex-col basis-1/6 gap-1 min-w-80'>
            <span className='text-lg font-semibold'>Programa</span>
            <FilterProgramaDropdown setStatusFilter={setProgramas} fetch={fetchProgramasFacultad} isFullLength={true} session={session} filterFacultadPrograma={filterFacultadPrograma} />
        </div>
        :
        null
        }
        
        <div className='flex flex-col basis-1/6'>
            <span className='text-lg font-semibold '>Tipo de Tutoría</span>
            <FilterTutoringTypesProgramDropdown session={session} setStatusFilter={setTipoTutoria} fetch={fetchTipoTutoriasFacultadPrograma} isFullLength={true} program={programas} filterFacultadPrograma={filterFacultadPrograma}/>
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
        
        <div className="col-span-2">
          <CardInformacionIndicador textHeader={"CANTIDAD DE ALUMNOS ATENDIDOS"} textContent={reporteAlumno?reporteAlumno.cantidadAlumnosAtendidos:0}/>
        </div>

        <div className="col-span-2 ">
          <CardInformacionIndicador textHeader={"CANTIDAD PROMEDIO DE ALUMNOS ATENDIDOS POR DIA"} textContent={reporteAlumno&&reporteAlumno.promedioAlumnosPorDia&&typeof(reporteAlumno.promedioAlumnosPorDia)!=="String"?Math.ceil(reporteAlumno.promedioAlumnosPorDia):0}/>
        </div>
        
        <div className="col-span-2 ">
          <CardInformacionIndicador textHeader={"CANTIDAD PROMEDIO DE ALUMNOS ATENDIDOS POR SEMANA"} textContent={reporteAlumno&&reporteAlumno.promedioAlumnosPorSemana&&typeof(reporteAlumno.promedioAlumnosPorSemana)!=="String"?Math.ceil(reporteAlumno.promedioAlumnosPorSemana):0}/>
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
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
        <div className='text-xl text-blue-700  font-semibold  w-full'>
          <div className='text-center'>MODALIDAD DE CITAS</div>
        </div>
        {console.log(reporteAlumno)}
        <GraficoCircular data={reporteAlumno&&reporteAlumno.dataProporcionModalidadVirtual&&reporteAlumno.registroCitas&&reporteAlumno.registroCitas.length!==0?reporteAlumno.dataProporcionModalidadVirtual:[]}
        //<GraficoCircular data={reporteAlumno?[{ name: 'Virtual', value: reporteAlumno.proporcionModalidadVirtualCitas?(reporteAlumno.proporcionModalidadVirtualCitas):100},{ name: 'Presencial', value: reporteAlumno.proporcionModalidadVirtualCitas?(100-reporteAlumno.proporcionModalidadVirtualCitas):0 }]:[]}
        //colors={["#FF3A29","#FFB200"]}
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
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
        <div className='text-xl  text-center font-semibold flex flex-row self-center text-blue-700'>PORCENTAJE DE COMPROMISOS COMPLETADOS</div>
          <div className=" w-full h-fit">
            <GraficoCircular data={reporteAlumno?
            [
              { name: 'Finalizado', value: reporteAlumno.proporcionCompromisosCompletados?(reporteAlumno.proporcionCompromisosCompletados):0},
              { name: 'Por Finalizar', value: reporteAlumno.proporcionCompromisosCompletados?(100-reporteAlumno.proporcionCompromisosCompletados):100 }
            ]:[]}
            datakey={"value"}
            indicator={reporteAlumno?reporteAlumno.proporcionCompromisosCompletados:0}
            innerRadius="60%"
            outerRadius="80%"
            width={400}
            maxHeight={400}
            minHeight={200}
            colors={[colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionCompromisosCompletados:0), "rgba(226,232,240,0.5)"]}
            legend={false}
            labelCenter={true}
            labelCenterText={`${(reporteAlumno&&reporteAlumno.proporcionCompromisosCompletados?reporteAlumno.proporcionCompromisosCompletados:0).toFixed(2)}`+"%"}
            startAngle={90}
            endAngle={-270}
            labelCenterColor={colorAceptableLowValue(reporteAlumno?reporteAlumno.proporcionCompromisosCompletados:0)}
            
            />
            
          </div>
        </div>
        </div>
        </div>)}
        
        </div>
      )}
      </>
    )
}




