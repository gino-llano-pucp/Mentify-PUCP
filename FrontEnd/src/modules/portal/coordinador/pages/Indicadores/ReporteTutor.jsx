import { GraficoCircular } from "../../components/GraficoCircular"
import { GraficoLinea } from "../../components/GraficoLinea"
import { GraficoBarra } from "../../components/GraficoBarra"
import { ControllerDateRange } from "@/modules/core/components/ControllerDateRange"
import { useEffect, useState } from "react"
import { Checkbox, CircularProgress } from "@nextui-org/react"
import { CardInformacionIndicador } from "../../components/CardInformacionIndicador"
import { fetchProgramasFacultad, fetchTipoTutoriasFacultadPrograma } from "../../services/ListarDropdownsReportes"
import fetchAPI from "@/modules/core/services/apiService"
import { jwtDecode } from "jwt-decode"
import FilterProgramaDropdown from "@/modules/core/components/FilterProgramaDropdown"
import FilterTutoringTypesProgramDropdown from "../../components/FilterTutoringTypesProgramDropdown"
import FilterFrequencyDropdown from "../../components/FilterFrequencyDropdown"
import FilterFacultadProgramaReporteDropdown from "../../components/FilterFacultadProgramaReporteDropdown"

export const ReporteTutor = ({session, findMaxValue, esCoordinadorPrograma}) => {
    const [tipoTutoria, setTipoTutoria]=useState();
    const [programas, setProgramas]=useState([]);
    const [dateRange, setDateRange] = useState();
    const [reporteTutor, setReporteTutor] = useState(null);
    const [frequencyCitasAtendidas, setFrequencyCitasAtendidas] = useState({ uid: 1, name: 'Diaria' });
    const [frequencySolicitudes, setFrequencySolicitudes] = useState({ uid: 1, name: 'Diaria' });
    const [filterFacultadPrograma, setFilterFacultadPrograma]=useState({ uid: 0, name: 'Todos' });
    const [citasAtendidas, setCitasAtendidas] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasPrograms, setHasPrograms] = useState(true);
    const [loadingSearchBar, setLoadingSearchBar] = useState(true);
    const maxElementsInterpolate = 30;
    
    useEffect(()=>{
      const fetchType = async () => {
        if (session?.accessToken) {
          const data = await fetchProgramasFacultad(session);
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
      console.log(tipoTutoria)
      fetchDataReporteTutor();
    }, [tipoTutoria, dateRange]);


    useEffect(()=>{
      if(reporteTutor&&reporteTutor?.citasAtendidas){
        setCitasAtendidas(groupAndAccumulateDataCitas(reporteTutor.citasAtendidas,frequencyCitasAtendidas));
      console.log(groupAndAccumulateDataCitas(reporteTutor.citasAtendidas,frequencyCitasAtendidas))
    }
    },[frequencyCitasAtendidas])


    useEffect(()=>{
      if(reporteTutor&&reporteTutor?.solicitudesAsignacion){
        setSolicitudes(groupAndAccumulateDataSolicitudes(reporteTutor.solicitudesAsignacion,frequencySolicitudes));
        console.log(groupAndAccumulateDataCitas(reporteTutor.solicitudesAsignacion,frequencySolicitudes))
      }
    },[frequencySolicitudes])


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
  
    const interpolateDataCitasByDate = (data, maxPoints) => {
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
      let currentAccumulated = {fecha: '', "cantidadCitasAtendidas": 0}
      dataWithDates.forEach((item, index) => {
        currentAccumulated["cantidadCitasAtendidas"] += item["Cantidad de citas realizadas"];
        if (index % step === 0 || index === dataWithDates.length - 1) {
          currentAccumulated.fecha = item.fecha;
          accumulatedData.push({ ...currentAccumulated });
          currentAccumulated = {fecha: '', "cantidadCitasAtendidas": 0}
        }
      });
      return accumulatedData
      //return interpolatedData.map(({ parsedDate, ...rest }) => rest);  
    }  
      else
        return data;
    };
  
    const groupAndAccumulateDataCitas = (data, frequency) => {
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
          groupedData[key] = {fecha: '', "cantidadCitasAtendidas": 0};
        }
        groupedData[key]["cantidadCitasAtendidas"] += item["cantidadCitasAtendidas"];
        groupedData[key]["fecha"] = item["fecha"];
      });
    
      // Convertir el objeto agrupado en un array y ordenarlo por fecha
      return Object.values(groupedData).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    };

    const interpolateDataSolicitudessByDate = (data, maxPoints) => {
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
      let currentAccumulated = {fecha: '', "cantidadSolicitudesAsignacion": 0}
      dataWithDates.forEach((item, index) => {
        currentAccumulated["cantidadSolicitudesAsignacion"] += item["cantidadSolicitudesAsignacion"];
        if (index % step === 0 || index === dataWithDates.length - 1) {
          currentAccumulated.fecha = item.fecha;
          accumulatedData.push({ ...currentAccumulated });
          currentAccumulated = {fecha: '', "cantidadSolicitudesAsignacion": 0}
        }
      });
      return accumulatedData
      //return interpolatedData.map(({ parsedDate, ...rest }) => rest);  
    }  
      else
        return data;
    };
  
    const groupAndAccumulateDataSolicitudes = (data, frequency) => {
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
          groupedData[key] = {fecha: '', "cantidadSolicitudesAsignacion": 0};
        }
        groupedData[key]["cantidadSolicitudesAsignacion"] += item["cantidadSolicitudesAsignacion"];
        groupedData[key]["fecha"] = item["fecha"];
      });
    
      // Convertir el objeto agrupado en un array y ordenarlo por fecha
      return Object.values(groupedData).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    };





    const fetchDataReporteTutor = async () => {
      setLoading(true);
      console.log(tipoTutoria)
      if(tipoTutoria === undefined){
        return
      } 
      console.log("tipoTutoria")
      if (!session || !session.accessToken) {
          console.log('No session or token available');
          return;
        }
        
        const data = await fetchAPI({
        endpoint: `/sesionCita/obtener-reporte-tutor`,
        method: 'POST',
        token: session.accessToken,
        payload: {
          "idCoordinador": jwtDecode(session.accessToken).id,
          "searchCriteria": {
          "fechaDesde": dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
          "fechaHasta": dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
          "idTipoTutoria": tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria
          }
        },
        successMessage: 'Reporte de Tutor cargado correctamente',
        errorMessage: 'Error al cargar Reporte del Tutor',
        showToast: false
      });
      /*
      console.log(jwtDecode(session.accessToken).id)
      console.log(dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined)
      console.log(dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined)
      console.log(tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria)
      */
      console.log(data)
      if(data){
        (data.topTutores).map((item)=>{item=item,item.nombreCompleto=`${item.nombres} ${item.primerApellido}`})
        console.log(data)
        //if(data?.citasAtendidas){
          data.citasAtendidas = interpolateDataCitasByDate(data.citasAtendidas,maxElementsInterpolate) 
          setCitasAtendidas(groupAndAccumulateDataCitas(data.citasAtendidas,frequencyCitasAtendidas));
        //}
          
        //if(data?.solicitudesAsignacion){
          data.solicitudesAsignacion = interpolateDataSolicitudessByDate(data.solicitudesAsignacion,maxElementsInterpolate) 
          setSolicitudes(groupAndAccumulateDataSolicitudes(data.solicitudesAsignacion,frequencySolicitudes));
        //} 
        console.log(data)
        if(Number(data.proporcionModalidadVirtualCitas)===0){
          data.dataProporcionModalidadVirtual = 
          [
            {
              name: "Presencial",
              value: 100,
            }
          ]
        }
        else if(Number(data.proporcionModalidadVirtualCitas)===100)
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
              value: 100 - Number(data.proporcionModalidadVirtualCitas),
            },
            {
              name: "Virtual",
              value: Number(data.proporcionModalidadVirtualCitas),
            }
        ]
        console.log(data)
        setReporteTutor(data);
        setLoading(false);
      }
      else{
        setReporteTutor(null)
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
        <div className="grid grid-cols-6 gap-x-4">

        <div className="col-span-6">
        
        <div className='rounded-md stroke-black border-4 p-4 m-4 flex flex-col h-fit w-full relative'>
        <div className='w-full text-xl text-center font-semibold text-blue-700 '>
            <div className="inline">CITAS ATENDIDAS</div>
            <div className="inline absolute right-3">
            <FilterFrequencyDropdown statusFilter={frequencyCitasAtendidas} setStatusFilter={setFrequencyCitasAtendidas} className="w-full"/>
            </div>
        </div>
            <GraficoLinea
            data={citasAtendidas?citasAtendidas:null}
            xAxis={"fecha"} dataKeys={["cantidadCitasAtendidas",]} colors={["#39487F"]}
            strokeColors={["#39487F"]}
            maxHeight={600}
            minHeight={400} 
            maxValue={Math.ceil(findMaxValue(citasAtendidas? citasAtendidas:[],"cantidadCitasAtendidas")*1.5)}
            labelNames={["Fecha","Citas Atendidas"]}
            />
        </div>
        </div>
        
        <div className="col-span-2">
        <div className="col-span-2">
          <CardInformacionIndicador textHeader={"CANTIDAD DE CITAS ATENDIDAS"} textContent={reporteTutor?(String(reporteTutor.cantidadTotalCitasAtendidas)!=="NaN"&&reporteTutor.cantidadTotalCitasAtendidas!==null?reporteTutor.cantidadTotalCitasAtendidas:0):0}/>
        </div>
        </div>

        <div className="col-span-2">
        <div className="col-span-2">
          <CardInformacionIndicador textHeader={"CANTIDAD PROMEDIO DE CITAS POR TUTOR"} textContent={reporteTutor?(String(reporteTutor.cantidadPromedioCitasAtendidasTutor)!=="NaN"?Math.ceil(reporteTutor.cantidadPromedioCitasAtendidasTutor):0):0}/>
        </div>
        </div>

        <div className="col-span-2">
        <div className="col-span-2">
          <CardInformacionIndicador textHeader={"CANTIDAD PROMEDIO DE CITAS DIARIA POR TUTOR"} textContent={reporteTutor?(String(reporteTutor.cantidadPromedioCitasDiarioAtendidasTutor)!=="NaN"?Math.ceil(reporteTutor.cantidadPromedioCitasDiarioAtendidasTutor):0):0}/>
        </div>
        </div>


        <div className="col-span-3">
        <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
        <div className='text-xl text-blue-700  font-semibold  w-full'>
          <div className='text-center'>MODALIDAD DE CITAS ATENDIDAS</div>
        </div>
        {console.log(reporteTutor.citasAtendidas.length)}
        <GraficoCircular data={reporteTutor&&reporteTutor.dataProporcionModalidadVirtual&&reporteTutor.citasAtendidas&&reporteTutor.citasAtendidas.length!==0?reporteTutor.dataProporcionModalidadVirtual:[]}
        //colors={["#FF3A29","#FFB200"]}
        colors={["blue","purple"]}
        dataKey={"value"}
        nameKey={"name"}
        innerRadius={0}
        outerRadius="90%"
        indicateLabel={false}
        maxHeight={500}
        minHeight={400}
        showLabelInGraph={true}
        legend={true}
        startAngle={90}
        endAngle={-270}
        />
        </div>
        </div>

        <div className="col-span-3">
        <div className='rounded-md stroke-black border-4 p-4 m-4 h-fit w-full flex flex-col '>
            
            <div className='text-xl text-blue-700  font-semibold  w-full text-center self-center'>
                TUTORES CON MAYOR REGISTRO DE CITAS ATENDIDAS
            </div>
            <GraficoBarra data={reporteTutor?reporteTutor.topTutores:[]} dataKeys={["citasAtendidas"]}
                colors={new Array((reporteTutor?reporteTutor.topTutores:[]).length).fill("rgb(29,78,216)")}
                strokeColors={new Array((reporteTutor?reporteTutor.topTutores:[]).length).fill("rgb(29,78,216)")}
                vertical={true}
                yAxis={"nombreCompleto"}
                xType={"number"}
                yType={"category"}
                maxHeight={500}
                minHeight={400}
                isVertical={true}
            />
        </div>
        </div>




        <div className="col-span-6">
        <div className='rounded-md stroke-black border-4 p-4 m-4 flex flex-col h-fit w-full relative'>
        <div className='w-full text-xl text-center font-semibold text-blue-700'>
            <div className="inline ">SOLICITUDES DE ASIGNACIÓN</div>
            <div className="inline absolute right-3">
              <FilterFrequencyDropdown statusFilter={frequencySolicitudes} setStatusFilter={setFrequencySolicitudes} className="w-full"/>
            </div>
        </div>
            <GraficoLinea data={solicitudes?solicitudes:null} xAxis={"fecha"} dataKeys={["cantidadSolicitudesAsignacion"]} colors={["#39487F"]} strokeColors={["#39487F"]} maxHeight={400} minHeight={300}
            maxValue={Math.ceil(findMaxValue(solicitudes?solicitudes:[], "cantidadSolicitudesAsignacion")*1.5)}
            labelNames={["Fecha","Solicitudes de Asignación"]}
            />
            
        </div>
        </div>

        
        <div className="col-span-3">
        
        
        <CardInformacionIndicador textHeader={"SOLICITUDES DE ASIGNACIÓN DE TUTOR"} textContent={reporteTutor?(String(reporteTutor.cantidadTotalSolicitudesRegistradas)!=="NaN"?reporteTutor.cantidadTotalSolicitudesRegistradas:0):0}/>
        </div>

        <div className="col-span-3">
        <CardInformacionIndicador textHeader={"SOLICITUDES DE ASIGNACIÓN DE TUTOR REGISTRADAS POR DÍA"}
        textContent={reporteTutor?(String(reporteTutor.cantidadPromedioSolicitudesDiariasRegistradas)!=="NaN"&&String(reporteTutor.cantidadPromedioSolicitudesDiariasRegistradas)!==null ? Math.ceil(Number(reporteTutor.cantidadPromedioSolicitudesDiariasRegistradas)):0):0}/>
        </div>
        
        </div>)}
        </div>
        )}
        </>
    )
}
