import React from "react"
export function CardInformacionIndicador({textHeader, textContent}){
    return(
    <>
        
        
        <div className="flex flex-col h-fit">
        <div className='rounded-md stroke-black border-2 m-4 mb-0 flex flex-col gap-2 w-full h-fit'>
            <div className='rounded-t-md bg-primary text-white text-center font-semibold  self-center w-full h-20 flex justify-center items-center'>{textHeader}</div>
            <div className='text-2xl text-center font-bold self-center h-4 flex justify-center items-center mb-2 mt-1'>{textContent}</div>
        </div>
        </div>
        
          
    </>
    )
    

    
}

/*

<div className='rounded-md stroke-black border-2 flex flex-col h-full gap-2 w-full z-20'>
            <div className='flex flex-col gap-1 h-full'>
              <div className='rounded-t-md text-center font-semibold  bg-primary text-white py-2 w-full'>{textHeader}</div>
              <div className='text-2xl text-center font-bold h-full flex justify-center items-center'>{textContent}</div>
            </div>
          
        </div>



*/