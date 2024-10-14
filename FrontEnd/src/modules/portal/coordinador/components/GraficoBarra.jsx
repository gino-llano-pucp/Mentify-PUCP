import React from "react"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const GraficoBarra = ({data,  dataKeys, maxHeight, minHeight,colors, strokeColors, vertical, xAxis, yAxis, xType, yType, legend, stackOffset, stackId}) => {
  let cont=0;
  console.log(colors)
  console.log(strokeColors)
  console.log(dataKeys)
  console.log(data)
  return (
    <ResponsiveContainer width="100%" height="100%" maxHeight={maxHeight} minHeight={minHeight} >
      <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 10,
          }}
          barCategoryGap="10%"
          layout={vertical?"vertical":"horizontal"}
          stackOffset={stackOffset}
        >
        
        
        <XAxis dataKey={xAxis} type={xType} angle={-45} height={90} textAnchor="end"/>
        <YAxis dataKey={yAxis} type={yType}/>
        <Tooltip />
        {legend &&
        <Legend layout = 'horizontal' verticalAlign='bottom' align="bottom" />}
        {dataKeys.map((dataKey)=>{
            return (
            <Bar dataKey={dataKey}  stroke={strokeColors}  fill={colors} stackId={stackId}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
            
            </Bar>
          
          )
        
        })}
        </BarChart>
      </ResponsiveContainer>
    
);
}

/*
activeBar={<Rectangle fill="#dc3545" stroke="#dc3545" />}
activeBar={<Rectangle fill="#ffc107" stroke="#ffc107" />}
activeBar={<Rectangle fill="#008000" stroke="#008000" />}
*/
/*
<ResponsiveContainer width="100%" maxHeight={maxHeight} minHeight={minHeight}  aspect={2} className=""></ResponsiveContainer>
</ResponsiveContainer >
*/