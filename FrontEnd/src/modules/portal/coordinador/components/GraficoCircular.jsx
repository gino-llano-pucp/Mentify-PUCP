import React from "react"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Label } from 'recharts';

export const GraficoCircular = ({data, colors, outerRadius, innerRadius, indicateLabel, dataKey, nameKey, maxHeight, minHeight, startAngle, endAngle, labelCenter, labelCenterText, labelCenterColor, legend, showLabelInGraph}) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
        <text x={x} y={y} fill='white' stroke="white" fontStyle="semibold" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
        );
    }
  return (
    <>
  <ResponsiveContainer width="100%" height="100%" maxHeight={maxHeight} minHeight={minHeight}>
          <PieChart >
          {indicateLabel?
          (
          <Pie
            width="100%"
            height="100%"
            dataKey={dataKey}
            data={data}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            label
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }}
            startAngle={startAngle}
            endAngle={endAngle}
            strokeWidth={0}
            >
              {data.map((entry,index)=>(
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
          </Pie>
          )
          :
          (
            <Pie
              width="100%"
              height="100%"
              dataKey={dataKey}
              data={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              labelLine={false}
              label={showLabelInGraph?renderCustomizedLabel:null}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0
              }}
              startAngle={startAngle}
              endAngle={endAngle}
              >
                {data.map((entry,index)=>(
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              {
                labelCenter&&
                <Label
                  value={labelCenterText}
                  position="center"
                  style={{
                  fontSize: '24px',
                  fill: labelCenterColor,
                  stroke: labelCenterColor
                  
                }}
                />

              }
            
            </Pie>
            )

        }
          <Tooltip />
          {legend&&<Legend layout = "vertical" align='right' verticalAlign='middle'/>}
          </PieChart>
    </ResponsiveContainer>  
    </>
)};