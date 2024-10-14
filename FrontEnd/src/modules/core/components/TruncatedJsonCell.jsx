import { TableCell } from '@nextui-org/react';
import React from 'react'

const TruncatedJsonCell = ({ value, maxLength = 100 }) => {
    const stringValue = JSON.stringify(value);
    const truncatedValue = stringValue.length > maxLength 
      ? stringValue.slice(0, maxLength) + '...' 
      : stringValue;
  
    return (
      <TableCell className='w-[10%] h-96 text-left max-w-[10rem] overflow-hidden'>
        <div className='h-96 flex justify-center w-full items-center'>
          <div className='w-full break-words overflow-hidden'>
            {truncatedValue}
          </div>
        </div>
      </TableCell>
    );
  };
  
  export default TruncatedJsonCell;