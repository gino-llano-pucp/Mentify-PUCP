import React from "react"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';



export const GraficoArea = ({data, dataKeys, colors, strokeColors, maxHeight, minHeight, xAxis, yAxis, legend}) => {
let cont=0
return(
<>
<ResponsiveContainer width="100%" height="100%" maxHeight={maxHeight} minHeight={minHeight} className="">
        <AreaChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -15,
            bottom: 0
          }}
          >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis dataKey={yAxis}/>
        <Tooltip />

        {dataKeys.map((dataKey)=>{
            return (<Area type="line" dataKey={dataKey}  stroke={strokeColors[cont++]}  fill={colors[cont-1]}  stackId={cont} activeDot={{r: 8}} isAnimationActive={false}/>)
        
        })}
        {legend&&
        <Legend layout = 'horizontal' verticalAlign='bottom' align="center" />
        }
        </AreaChart>
        </ResponsiveContainer>
</>
)
}
