import React, { useEffect, useState } from "react";
import {DatePicker} from "@nextui-org/react";

export const ControllerDateRange = ({setValue, isFullLength, noLogs = false }) => {
  const [hastaValue, setHastaValue] = useState()
  const [desdeValue, setDesdeValue] = useState()
  useEffect(() => {
    if(hastaValue && desdeValue){
      console.log(desdeValue, hastaValue)
      setValue({
        start: desdeValue,
        end: hastaValue
      })
    }
    if(!hastaValue && !desdeValue){
      setValue(undefined)
    }
  }, [hastaValue,desdeValue]);
  return (
    <>
      <div className={`flex flex-col gap-1 w-full ${noLogs ? 'md:w-1/5' : 'md:w-1/4'}`}>
        <span className='text-base font-medium'>Desde</span>
        <DatePicker
          value={desdeValue}
          onChange={setDesdeValue}
          maxValue={hastaValue}
        />
      </div>
      <div className={`flex flex-col gap-1 w-full ${noLogs ? 'md:w-1/5' : 'md:w-1/4'}`}>
        <span className='text-base font-medium'>Hasta</span>
        <DatePicker
          value={hastaValue}
          onChange={setHastaValue}
          minValue={desdeValue}
        />
      </div>
    </>
  );
}
