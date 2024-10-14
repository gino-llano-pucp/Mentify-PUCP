import { DonutChart } from '@tremor/react';

export const GraficoPastel = ({data}) => {
    const dataFormatter = (number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;
      

  return (
    <div className="space-y-3">
    <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        pie variant
    </span>
    <div className="flex justify-center">
        <DonutChart
        data={data}
        variant="Running"
        valueFormatter={dataFormatter}
        onValueChange={(v) => console.log(v)}
        />
    </div>
    </div>
  )
}
