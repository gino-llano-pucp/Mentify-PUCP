import React from 'react'

const GenericCard = ({ header, attributes, onClick }) => {
    return (
      <div
        className='flex flex-col gap-4 p-4 border w-fit h-fit rounded-xl hover:cursor-pointer transition-shadow hover:shadow-lg'
        onClick={onClick}
      >
        <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
          {header}
        </div>
        <div className='flex flex-col w-full gap-2'>
          {attributes.map((attr, index) => (
            <div key={index} className='flex items-center gap-2'>
              {attr.icon}
              <span className='text-sm'>{attr.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GenericCard;