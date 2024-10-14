import { GraficoBarra } from "../../components/GraficoBarra";
import { GraficoCircular } from "../../components/GraficoCircular";
import { Checkbox, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CardInformacionIndicador } from "../../components/CardInformacionIndicador";
import { fetchProgramasFacultad, fetchTipoTutoriasFacultadPrograma } from "../../services/ListarDropdownsReportes";
import fetchAPI from "@/modules/core/services/apiService";
import { jwtDecode } from "jwt-decode";
import FilterProgramaDropdown from "@/modules/core/components/FilterProgramaDropdown";
import FilterTutoringTypesProgramDropdown from "../../components/FilterTutoringTypesProgramDropdown";

const encuestasRespondidasSample = [
  { name: 'Asistió', value: 128, color: '#008000' },
  { name: 'No Asistió', value: 39, color: '#ff4545' },
];

export const ReporteEncuesta = ({session, findMaxValue}) => {
  const lowAmount = 50;
  const [selectTiposTutoriaFacultad,setSelectTiposTutoriaFacultad] = useState(false);
  const [tipoTutoria, setTipoTutoria]=useState();
  const [programa, setPrograma]=useState({id:0, nombrePrograma: "Todos"});
  const [reporteEncuesta, setReporteEncuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const colorsPieChart = ["#FF3A29","#FFB200","#39487F","#6AD2FF","#34B53A"]

  useEffect(() => {
    fetchDataReporteEncuestas();
  }, []);

  let colorAceptableLowValue  = (value) =>{
    return value > lowAmount ? "#008000":"#ff4545";
  }
    
  let ratioEncuestasRespondidas=(encuestasRespondidasSample[0].value*100/(encuestasRespondidasSample[1].value+(encuestasRespondidasSample[0].value))).toFixed(2)
  console.log(ratioEncuestasRespondidas)

  const fetchDataReporteEncuestas = async () => {
    setLoading(true);
    /*if(tipoTutoria === undefined)
      return*/
    
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
      
    const data = await fetchAPI({
    endpoint: `/sesionCita/obtener-reporte-encuestas`,
    method: 'POST',
    token: session.accessToken,
    payload: {
      "idCoordinador": jwtDecode(session.accessToken).id,
      "searchCriteria": {
      "idTipoTutoria": [],//tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria,
      //"cantidadElementos": 30
      }
    },
    successMessage: 'Reporte de Encuestas cargado correctamente',
    errorMessage: 'Error al cargar Reporte de Encuestas',
    showToast: false
    });
  
    console.log(data)
    console.log(jwtDecode(session.accessToken).id)
    //console.log(tipoTutoria.length === undefined ? tipoTutoria.id : tipoTutoria)
    if(data){
      data.proporcionEncuestasRespondidas=Number(data.proporcionEncuestasRespondidas.slice(0,-1))
      
      data.utilidadCitas.map((item,index)=>{
        item.color = colorsPieChart[index];
      })
      console.log(data.utilidadCitas)
      data.utilidadCitas = data.utilidadCitas.filter(item => item.cantidad !== 0)
      data.utilidadCitas.colors = data.utilidadCitas.map(item => item.color)
      console.log(data.utilidadCitas)
      setReporteEncuesta(data)
    }
      
    console.log(reporteEncuesta)
    
    setLoading(false);
  }

  return(
    <>
    <div>
    <div></div>
  {loading?(

  <div className='flex flex-row items-center gap-3'>
  <CircularProgress aria-label='Loading...' />
  <div>Generando Reporte...</div>
  </div>
  ):
  (
  <div className="grid grid-cols-6 gap-x-4">
  <div className="col-span-2">
  
  <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>

      <div className='text-xl  text-center font-semibold flex flex-row self-center text-blue-700'>ENCUESTAS RESPONDIDAS</div>
        <div className=" w-full h-fit">
        <GraficoCircular data={reporteEncuesta?
        [
          { name: 'Respondido', value: reporteEncuesta.proporcionEncuestasRespondidas?(reporteEncuesta.proporcionEncuestasRespondidas):0},
          { name: 'No Respondido', value: reporteEncuesta.proporcionEncuestasRespondidas?(100-reporteEncuesta.proporcionEncuestasRespondidas):100 }
        ]:[]}
          datakey={"value"}
          //indicator={encuestasRespondidasSample[0].value}
          innerRadius="60%"
          outerRadius="80%"
          width={400}
          maxHeight={400}
          minHeight={200}
          colors={[colorAceptableLowValue(reporteEncuesta?reporteEncuesta.proporcionEncuestasRespondidas:0), "rgba(226,232,240,0.5)"]}
          legend={false}
          labelCenter={true}
          labelCenterText={`${Number(reporteEncuesta&&reporteEncuesta.proporcionEncuestasRespondidas?reporteEncuesta.proporcionEncuestasRespondidas:0).toFixed(2)}`+"%"}
          startAngle={90}
          endAngle={-270}
          labelCenterColor={colorAceptableLowValue(reporteEncuesta?reporteEncuesta.proporcionEncuestasRespondidas:0)}
          />
        </div>
      </div>
  </div>

  <div className="col-span-2">
  <div className="flex flex-col">
    <CardInformacionIndicador textHeader={"CANTIDAD DE ENCUESTAS REALIZADAS"} textContent={reporteEncuesta?reporteEncuesta.cantidadEncuestasRealizadas:0}/>
    <CardInformacionIndicador textHeader={"FECHA DE ÚLTIMA ENCUESTA"} textContent={reporteEncuesta?reporteEncuesta.fechaUltimaEncuesta:"--/--/----"}/>
  </div>
  </div>
  <div className="col-span-2">
      <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
      <div className='text-xl text-blue-700  font-semibold w-full'>
        
        <div className='text-center'>UTILIDAD DE LAS CITAS</div>
        
      </div>
      
      <GraficoCircular data={reporteEncuesta&&reporteEncuesta.utilidadCitas?reporteEncuesta.utilidadCitas:[]}
      colors={reporteEncuesta&&reporteEncuesta.utilidadCitas&&reporteEncuesta.utilidadCitas.colors?reporteEncuesta.utilidadCitas.colors:[] }
      //colors={["#FF3A29","#FFB200","#39487F","#6AD2FF","#34B53A"]}
      dataKey={"cantidad"}
      nameKey={"categoria"}
      innerRadius={0}
      outerRadius="90%"
      indicateLabel={false}
      maxHeight={400}
      minHeight={200}
      showLabelInGraph={true}
      legend={true}
      />
      </div>
  </div>

  <div className="col-span-2">
      
      
    <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
    <div className='w-full text-xl  text-center font-semibold  text-blue-700'>SATISFACCIÓN DE EXPECTATIVAS</div>
      <div className=" w-full h-fit">
      <GraficoBarra data={reporteEncuesta?reporteEncuesta.satisfaccionExpectativas:[]} dataKeys={["cantidad"]}
            colors={new Array((reporteEncuesta?reporteEncuesta.satisfaccionExpectativas:[]).length).fill("rgb(29,78,216)")}
            strokeColors={new Array((reporteEncuesta?reporteEncuesta.satisfaccionExpectativas:[]).length).fill("rgb(29,78,216)")}
            xAxis={"categoria"}
            yType={"number"}
            xType={"category"}
            maxHeight={400}
            minHeight={300}
      />
      </div>
    </div>
  </div>

  <div className="col-span-2">
  <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
  <div className='w-full text-xl  text-center font-semibold  text-blue-700'>INTERÉS DE LOS TUTORES</div>
    <div className=" w-full h-fit">
    <GraficoBarra data={reporteEncuesta?reporteEncuesta.interesTutores:[]} dataKeys={["cantidad"]}
          colors={new Array((reporteEncuesta?reporteEncuesta.interesTutores:[]).length).fill("rgb(29,78,216)")}
          strokeColors={new Array((reporteEncuesta?reporteEncuesta.interesTutores:[]).length).fill("rgb(29,78,216)")}
          xAxis={"categoria"}
          yType={"number"}
          xType={"category"}
          maxHeight={400}
          minHeight={300}
    />
    </div>
  </div>
  </div>
  
  <div className="col-span-2">
      <div className='rounded-md stroke-black border-2 p-4 m-4 flex flex-col h-fit w-full'>
      <div className='w-full text-xl  text-center font-semibold self-center text-blue-700'>CLARIDAD DE LAS EXPLICACIONES</div>
        <div className=" w-full h-fit">
        <GraficoBarra data={reporteEncuesta?reporteEncuesta.valoracionCitas:[]} dataKeys={["cantidad"]}
              colors={new Array((reporteEncuesta?reporteEncuesta.valoracionCitas:[]).length).fill("rgb(29,78,216)")}
              strokeColors={new Array((reporteEncuesta?reporteEncuesta.valoracionCitas:[]).length).fill("rgb(29,78,216)")}
              xAxis={"categoria"}
              yType={"number"}
              xType={"category"}
              maxHeight={400}
              minHeight={300}
/>
        </div>
      </div>
  </div>
      
  </div>)}
  </div>
  </>
  )
}


/*
<div className='flex items-end w-full gap-2 flex-row flex-wrap'>
        <div className='flex flex-col basis-1/3 gap-1'>
            <span className='text-lg font-semibold'>Programa</span>
            <FilterProgramaDropdown setStatusFilter={setPrograma} fetch={fetchProgramasFacultad} isFullLength={true} session={session}/>
        </div>
        <div className='flex flex-col basis-1/3'>
            <span className='text-lg font-semibold '>Tipo de Tutoría</span>
            <FilterTutoringTypesProgramDropdown session={session} setStatusFilter={setTipoTutoria} fetch={fetchTipoTutoriasFacultadPrograma} isFullLength={true} program={programa} excludeFacultades={onlyFacultad} excludeProgramas={onlyPrograma}/>
        </div>
        <div className="basis-1/12">
        <Checkbox
            isSelected={onlyFacultad}
            color="primary"
            onChange={(e) => setOnlyFacultad(e.target.checked)}
            className="w-full"
          >
            Excluir Tipos de Tutoria de Facultad
          </Checkbox>
        </div>

        <div className="basis-1/12">
        <Checkbox
            isSelected={onlyPrograma}
            color="primary"
            onChange={(e) => setOnlyPrograma(e.target.checked)}
            className="w-full"
          >
            Excluir Tipos de Tutoria de Programas
          </Checkbox>
        </div>
  </div>
  */