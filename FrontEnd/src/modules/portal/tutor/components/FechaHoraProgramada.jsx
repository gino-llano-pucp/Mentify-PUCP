import { DateInput } from '@nextui-org/react'
import { CalendarDate, parseDate, Time } from "@internationalized/date";
import React from 'react'
import { CalendarIcon } from 'lucide-react';
import CustomTimeInput from './CustomTimeInput';
import { useState, useEffect } from 'react';
import { parse, format } from 'date-fns';

const FechaHoraProgramada = ({date, startTime, endTime}) => {
  console.log("date is: ", date);

  const formatDate = (dateString) => {
    console.log("Original date string: ", dateString);
  
    // Split the date string assuming the common delimiter '/'
    const parts = dateString.split('/');
    let day, month, year;
  
    // Check if the first part (month in MM/dd/yyyy or day in dd/MM/yyyy) exceeds 12
    if (parseInt(parts[0]) > 12) {
      // European style dd/MM/yyyy
      day = parts[0];
      month = parts[1];
      year = parts[2];
    } else {
      // US style MM/dd/yyyy
      month = parts[0];
      day = parts[1];
      year = parts[2];
    }
  
    // Return the date in ISO-8601 format (yyyy-MM-dd)
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
    
  return (
    <div className='flex flex-row items-center w-full gap-4 fecha-hora'>
                    <DateInput
                        label="Fecha"
                        isReadOnly
/*                         defaultValue={date ? parseDate(formatDate(date)) : undefined} */
                        defaultValue={startTime ? parseDate((startTime.split("T"))[0]) : undefined}
                        placeholderValue={new CalendarDate(1995, 11, 6)} 
                        labelPlacement="inside"
                        className='w-full'
                        startContent={
                        <CalendarIcon className="flex-shrink-0 text-2xl pointer-events-none text-default-400" />
                        }
                    />
                    <CustomTimeInput startTime={(((startTime.split("T"))[1]).split("-"))[0]} endTime={(((endTime.split("T"))[1]).split("-"))[0]}/>
                </div>
  )
}

export default FechaHoraProgramada