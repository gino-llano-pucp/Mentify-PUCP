import React from "react"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { content } from "../../../../../tailwind.config";



export const GraficoLinea = ({data, xAxis, dataKeys, colors, maxHeight, minHeight, legend, maxValue, labelNames, isVertical, legendNames}) => {
let cont=0;
let contLeg=1;
console.log(maxValue)
console.log(labelNames)
console.log(legendNames)
const CustomTooltip = ({ active, payload, label}) => {
  let cont = 0
  if (active && payload && payload.length) {
    console.log(payload)
    return ( labelNames&&
      <div  style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p> {`${labelNames[cont++]}: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${labelNames[cont++]}: ${entry.value}`}
            </p>
        ))}
        
      </div>
    );
  }

  return null;
};



const tickFormater = (tick) => {
  return Number.isInteger(tick)?tick:'';
}

return(
<>
<ResponsiveContainer width="100%" height="100%" maxHeight={maxHeight} minHeight={minHeight} >
      <LineChart  data={data} margin={{top: 0,right: 15,left: 15,bottom: 20}} >
      {isVertical?
      <XAxis dataKey={xAxis} angle={-45} height={90} textAnchor="end"
      tickFormatter={tickFormater}
      ticks={Array.from({length: maxValue + 1}, (_, i) => i)}/>
      :
      <XAxis dataKey={xAxis} angle={-45} height={70} textAnchor="end"
      />
      }
      <YAxis domain={[0,maxValue]}
      tickFormatter={tickFormater}
      ticks={Array.from({length: maxValue + 1}, (_, i) => i)}
      />
    
      
      <Tooltip content={<CustomTooltip/>}/>
      
      
    {dataKeys.map((dataKey)=>{
        return (<Line type="line" dataKey={dataKey} stroke={colors[cont++]} strokeWidth={2}  isAnimationActive={false}/>)
        
    })}
        {legend&&
          <Legend 
          layout = 'horizontal' verticalAlign='bottom' align="center" itemScope={Line}
          wrapperStyle={{ paddingTop: 25 }}
          />
        }
      </LineChart>
</ResponsiveContainer>
</>
)
}