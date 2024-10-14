import React from 'react';
import { LineChart } from '@tremor/react';

export const GraficoLineas = ({ data }) => {
  const customTooltip = (props) => {
    const { payload, active } = props;
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category, idx) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              style={{ backgroundColor: category.color }} // Aplicando color directamente
              className="flex w-1 flex-col rounded"
            />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value} bpm
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Average BPM</h3>
      <LineChart
        className="mt-4 h-72"
        data={data}
        index="date"
        categories={['Running']}
        colors={['#007BFF']} // Asegúrate de usar un valor válido aquí
        yAxisWidth={30}
        strokeWidth={3}
        customTooltip={customTooltip}
      />
    </div>
  );
}
