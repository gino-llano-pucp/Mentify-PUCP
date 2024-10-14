import { TimeInput } from '@nextui-org/react';
import React, { useState } from 'react'
import { format, parse } from 'date-fns';
import { Clock } from 'lucide-react';

const CustomTimeInput = ({ startTime, endTime }) => {

  function formatTime(time) {
    console.log("time: ", time);
    const [hours, minutes] = time.split(':');
    let period = 'am';
    let hour = parseInt(hours, 10);

    if (hour >= 12){
      period = 'pm';
      if (hour > 12){
        hour -= 12;
      }
    } else if (hour === 0){
      hour= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };


  return (
    <div className='px-4 w-full flex flex-col justify-center rounded-xl bg-[#F2F2F3] gap-1 hover:bg-[#E0E0E3] transition duration-200 h-14'>
      <span className='text-xs text-gray-600 transition duration-200 hover:text-gray'>Hora programada</span>
      <div className='flex flex-row gap-2'>
          <Clock size={20} className='text-gray-500'/>
          <span className='text-sm text-gray-700 transition duration-200 hover:text-gray'>
              {formatTime(startTime)} - {formatTime(endTime)}
          </span>
      </div>
    </div>
  );
};

export default CustomTimeInput