/* eslint-disable no-shadow */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,  
  ]
;
};

export const  GraficoCircularMedio = ({data, datakey, indicator, iR, oR, width, height, maxHeight, minHeight}) =>  {
    
    const value = indicator;
    let cx = width*0.55
    let cy = height*3/4
    return (
    <ResponsiveContainer width="100%" height="100%" maxHeight={maxHeight} minHeight={minHeight}>
      <PieChart width={width} height={height}>
        <Pie
          dataKey={datakey}
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="75%"
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        
      </PieChart>
      </ResponsiveContainer>
    );
  
}


//{needle(value, data, cx, cy, iR, oR, '#d0d000')}